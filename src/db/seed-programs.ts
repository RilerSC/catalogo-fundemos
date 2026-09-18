import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { PROGRAMS, type AcademicTypeSlug } from "./data/programs";
import { getDb } from "./index";
import {
  academicTypes,
  knowledgeFields,
  programKnowledgeFields,
  programs,
} from "./schema";

config({ path: ".env.local" });

const EXPECTED_TYPE_COUNTS: Record<AcademicTypeSlug, number> = {
  tecnico: 8,
  diplomado: 1,
  especialista: 10,
  "mision-academica": 2,
  seminario: 1,
  "programa-ejecutivo": 1,
  bachillerato: 2,
  licenciatura: 1,
  maestria: 3,
  master: 2,
  doctorado: 1,
};

function validateDataset() {
  const errors: string[] = [];

  if (PROGRAMS.length !== 32) {
    errors.push(`Expected 32 programs, got ${PROGRAMS.length}.`);
  }

  const slugs = PROGRAMS.map((program) => program.slug);
  if (new Set(slugs).size !== slugs.length) {
    errors.push("Program slugs are not unique.");
  }

  const sources = PROGRAMS.map((program) => program.sourceFile);
  if (new Set(sources).size !== sources.length) {
    errors.push("Source files are not unique.");
  }

  const hoja = PROGRAMS.filter((program) =>
    program.sourceFile.includes("/HOJA DE VENTAS/"),
  );
  const hv2 = PROGRAMS.filter((program) => program.sourceFile.includes("/HV2/"));
  if (hoja.length !== 23) {
    errors.push(`Expected 23 HOJA DE VENTAS sources, got ${hoja.length}.`);
  }
  if (hv2.length !== 9) {
    errors.push(`Expected 9 HV2 sources, got ${hv2.length}.`);
  }

  const typeCounts: Partial<Record<AcademicTypeSlug, number>> = {};
  for (const program of PROGRAMS) {
    if (!program.name.trim()) {
      errors.push(`Program ${program.slug} is missing a name.`);
    }
    if (!program.slug.trim()) {
      errors.push(`A program is missing a slug.`);
    }
    if (program.knowledgeFieldSlugs.length === 0) {
      errors.push(`Program ${program.slug} has no knowledge fields.`);
    }
    typeCounts[program.academicTypeSlug] =
      (typeCounts[program.academicTypeSlug] ?? 0) + 1;
  }

  for (const [slug, expected] of Object.entries(EXPECTED_TYPE_COUNTS) as [
    AcademicTypeSlug,
    number,
  ][]) {
    if ((typeCounts[slug] ?? 0) !== expected) {
      errors.push(
        `Academic type ${slug}: expected ${expected}, got ${typeCounts[slug] ?? 0}.`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(`Dataset validation failed:\n- ${errors.join("\n- ")}`);
  }
}

async function seedPrograms() {
  validateDataset();

  const db = getDb();
  const typeRows = await db.select().from(academicTypes);
  const fieldRows = await db.select().from(knowledgeFields);

  const typeIdBySlug = new Map(typeRows.map((row) => [row.slug, row.id]));
  const fieldIdBySlug = new Map(fieldRows.map((row) => [row.slug, row.id]));

  if (typeRows.length !== 11 || fieldRows.length !== 6) {
    throw new Error(
      `Expected DATA-003 taxonomies (11 types, 6 fields); found ${typeRows.length} types and ${fieldRows.length} fields.`,
    );
  }

  for (const program of PROGRAMS) {
    if (!typeIdBySlug.has(program.academicTypeSlug)) {
      throw new Error(`Unknown academic type: ${program.academicTypeSlug}`);
    }
    for (const fieldSlug of program.knowledgeFieldSlugs) {
      if (!fieldIdBySlug.has(fieldSlug)) {
        throw new Error(`Unknown knowledge field: ${fieldSlug}`);
      }
    }
  }

  await db
    .insert(programs)
    .values(
      PROGRAMS.map((program) => ({
        academicTypeId: typeIdBySlug.get(program.academicTypeSlug)!,
        slug: program.slug,
        name: program.name,
        description: program.description,
        entryProfile: program.entryProfile,
        exitProfile: program.exitProfile,
        requirements: program.requirements,
        curriculum: program.curriculum,
        complementaryInfo: program.complementaryInfo,
        duration: program.duration,
        seoTitle: program.seoTitle,
        seoDescription: program.seoDescription,
        editorialStatus: program.editorialStatus,
      })),
    )
    .onConflictDoUpdate({
      target: programs.slug,
      set: {
        academicTypeId: sql`excluded.academic_type_id`,
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        entryProfile: sql`excluded.entry_profile`,
        exitProfile: sql`excluded.exit_profile`,
        requirements: sql`excluded.requirements`,
        curriculum: sql`excluded.curriculum`,
        complementaryInfo: sql`excluded.complementary_info`,
        duration: sql`excluded.duration`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
        editorialStatus: sql`excluded.editorial_status`,
      },
    });

  const persisted = await db
    .select({
      id: programs.id,
      slug: programs.slug,
    })
    .from(programs);

  const programIdBySlug = new Map(persisted.map((row) => [row.slug, row.id]));

  const associations = PROGRAMS.flatMap((program) => {
    const programId = programIdBySlug.get(program.slug);
    if (!programId) {
      throw new Error(`Program ${program.slug} was not persisted.`);
    }
    return program.knowledgeFieldSlugs.map((fieldSlug) => ({
      programId,
      knowledgeFieldId: fieldIdBySlug.get(fieldSlug)!,
    }));
  });

  await db
    .insert(programKnowledgeFields)
    .values(associations)
    .onConflictDoNothing();

  console.log(`programs=${persisted.length}`);
  console.log(`program_knowledge_fields=${associations.length}`);
}

seedPrograms().catch((error) => {
  console.error(error instanceof Error ? error.message : "Program seed failed.");
  process.exit(1);
});
