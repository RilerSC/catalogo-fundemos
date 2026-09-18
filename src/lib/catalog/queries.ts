import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  academicTypes,
  knowledgeFields,
  offeringPriceComponents,
  offerings,
  programKnowledgeFields,
  programs,
} from "@/db/schema";
import {
  formatPriceLabel,
  formatStartDate,
  shortenText,
  toDateKey,
  todayUtcDateKey,
} from "./format";
import type {
  CatalogOpening,
  CatalogPriceComponent,
  CatalogProgramCard,
  CatalogProgramDetail,
  CatalogTaxonomy,
} from "./types";
import { isCatalogPreview } from "./visibility";

type ProgramRow = typeof programs.$inferSelect;
type TypeRow = typeof academicTypes.$inferSelect;
type FieldRow = typeof knowledgeFields.$inferSelect;
type OfferingRow = typeof offerings.$inferSelect;
type PriceComponentRow = typeof offeringPriceComponents.$inferSelect;

function toPriceComponents(
  rows: PriceComponentRow[],
): CatalogPriceComponent[] {
  return rows
    .slice()
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }
      return left.kind.localeCompare(right.kind);
    })
    .flatMap((row) => {
      const formatted = formatPriceLabel(row.amount, row.currency);
      if (!formatted) {
        return [];
      }
      return [
        {
          kind: row.kind,
          label: row.label,
          amount: String(row.amount),
          currency: row.currency,
          formatted,
        },
      ];
    });
}

function toOpening(
  row: OfferingRow,
  componentRows: PriceComponentRow[],
): CatalogOpening {
  const startDate = toDateKey(row.startDate);
  return {
    startDate,
    startDateLabel: formatStartDate(startDate),
    modality: row.modality,
    schedule: row.schedule,
    priceComponents: toPriceComponents(componentRows),
  };
}

function selectOpening(
  programOfferings: OfferingRow[],
  componentsByOffering: Map<string, PriceComponentRow[]>,
  preview: boolean,
): CatalogOpening | null {
  const today = todayUtcDateKey();
  const eligible = programOfferings
    .filter((offering) => preview || offering.editorialStatus === "published")
    .filter((offering) => toDateKey(offering.startDate) >= today)
    .sort((left, right) =>
      toDateKey(left.startDate).localeCompare(toDateKey(right.startDate)),
    );
  const selected = eligible[0];
  if (!selected) {
    return null;
  }
  return toOpening(selected, componentsByOffering.get(selected.id) ?? []);
}

function toCard(
  program: ProgramRow,
  academicType: TypeRow,
  fields: FieldRow[],
  programOfferings: OfferingRow[],
  componentsByOffering: Map<string, PriceComponentRow[]>,
  preview: boolean,
): CatalogProgramCard | null {
  if (!preview && program.editorialStatus !== "published") {
    return null;
  }
  const opening = selectOpening(
    programOfferings,
    componentsByOffering,
    preview,
  );
  if (!opening) {
    return null;
  }
  return {
    id: program.id,
    slug: program.slug,
    name: program.name,
    academicType: { slug: academicType.slug, name: academicType.name },
    knowledgeFields: fields
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((field) => ({ slug: field.slug, name: field.name })),
    shortDescription: shortenText(program.description),
    duration: program.duration,
    opening,
  };
}

function groupComponents(
  rows: PriceComponentRow[],
): Map<string, PriceComponentRow[]> {
  const map = new Map<string, PriceComponentRow[]>();
  for (const row of rows) {
    const current = map.get(row.offeringId) ?? [];
    current.push(row);
    map.set(row.offeringId, current);
  }
  return map;
}

export async function getAcademicTypes(): Promise<CatalogTaxonomy[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: academicTypes.slug, name: academicTypes.name })
    .from(academicTypes)
    .orderBy(asc(academicTypes.sortOrder));
  return rows;
}

export async function getKnowledgeFields(): Promise<CatalogTaxonomy[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: knowledgeFields.slug, name: knowledgeFields.name })
    .from(knowledgeFields)
    .orderBy(asc(knowledgeFields.sortOrder));
  return rows;
}

export async function getCatalogPrograms(): Promise<CatalogProgramCard[]> {
  const db = getDb();
  const preview = isCatalogPreview();
  const [
    programRows,
    typeRows,
    fieldRows,
    associationRows,
    offeringRows,
    componentRows,
  ] = await Promise.all([
    db.select().from(programs),
    db.select().from(academicTypes),
    db.select().from(knowledgeFields),
    db.select().from(programKnowledgeFields),
    db.select().from(offerings),
    db.select().from(offeringPriceComponents),
  ]);

  const typeById = new Map(typeRows.map((row) => [row.id, row]));
  const fieldById = new Map(fieldRows.map((row) => [row.id, row]));
  const fieldsByProgram = new Map<string, FieldRow[]>();
  for (const association of associationRows) {
    const field = fieldById.get(association.knowledgeFieldId);
    if (!field) {
      continue;
    }
    const current = fieldsByProgram.get(association.programId) ?? [];
    current.push(field);
    fieldsByProgram.set(association.programId, current);
  }
  const offeringsByProgram = new Map<string, OfferingRow[]>();
  for (const offering of offeringRows) {
    const current = offeringsByProgram.get(offering.programId) ?? [];
    current.push(offering);
    offeringsByProgram.set(offering.programId, current);
  }
  const componentsByOffering = groupComponents(componentRows);

  return programRows
    .map((program) => {
      const academicType = typeById.get(program.academicTypeId);
      if (!academicType) {
        return null;
      }
      return toCard(
        program,
        academicType,
        fieldsByProgram.get(program.id) ?? [],
        offeringsByProgram.get(program.id) ?? [],
        componentsByOffering,
        preview,
      );
    })
    .filter((program): program is CatalogProgramCard => program !== null)
    .sort((left, right) => {
      const dateCompare = (left.opening?.startDate ?? "").localeCompare(
        right.opening?.startDate ?? "",
      );
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return left.name.localeCompare(right.name, "es");
    });
}

export async function getProgramBySlug(
  slug: string,
): Promise<CatalogProgramDetail | null> {
  const db = getDb();
  const preview = isCatalogPreview();
  const programRows = await db
    .select()
    .from(programs)
    .where(eq(programs.slug, slug))
    .limit(1);
  const program = programRows[0];
  if (!program) {
    return null;
  }

  const academicTypeRows = await db
    .select()
    .from(academicTypes)
    .where(eq(academicTypes.id, program.academicTypeId))
    .limit(1);
  const academicType = academicTypeRows[0];
  if (!academicType) {
    return null;
  }

  const [associationRows, offeringRows, fieldRows, componentRows] =
    await Promise.all([
      db
        .select()
        .from(programKnowledgeFields)
        .where(eq(programKnowledgeFields.programId, program.id)),
      db.select().from(offerings).where(eq(offerings.programId, program.id)),
      db.select().from(knowledgeFields),
      db.select().from(offeringPriceComponents),
    ]);
  const fieldById = new Map(fieldRows.map((row) => [row.id, row]));
  const fields = associationRows
    .map((association) => fieldById.get(association.knowledgeFieldId))
    .filter((field): field is FieldRow => Boolean(field));
  const offeringIds = new Set(offeringRows.map((row) => row.id));
  const componentsByOffering = groupComponents(
    componentRows.filter((row) => offeringIds.has(row.offeringId)),
  );

  const card = toCard(
    program,
    academicType,
    fields,
    offeringRows,
    componentsByOffering,
    preview,
  );
  if (!card) {
    return null;
  }

  return {
    ...card,
    description: program.description,
    entryProfile: program.entryProfile,
    exitProfile: program.exitProfile,
    requirements: program.requirements,
    curriculum: program.curriculum,
    complementaryInfo: program.complementaryInfo,
    seoTitle: program.seoTitle,
    seoDescription: program.seoDescription,
  };
}
