import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import {
  CSV_ONLY,
  DATE_WITHOUT_PRICE,
  NO_2027_START_DATE,
  OFFERINGS,
  type OfferingPriceComponent,
} from "./data/offerings";
import { PROGRAMS } from "./data/programs";
import { getDb } from "./index";
import { offeringPriceComponents, offerings, programs } from "./schema";

config({ path: ".env.local" });

function validateDataset() {
  const errors: string[] = [];
  const programSlugs = new Set(PROGRAMS.map((program) => program.slug));
  const offeringKeys = new Set<string>();

  if (OFFERINGS.length === 0) {
    errors.push("No valid offerings were defined.");
  }

  for (const offering of OFFERINGS) {
    if (!programSlugs.has(offering.programSlug)) {
      errors.push(`Unknown program slug: ${offering.programSlug}`);
    }
    if (!offering.startDate.startsWith("2027-")) {
      errors.push(
        `${offering.programSlug} startDate is not 2027: ${offering.startDate}`,
      );
    }
    const kinds = new Set<string>();
    for (const component of offering.priceComponents) {
      if (!component.amount || !component.currency || !component.label) {
        errors.push(
          `${offering.programSlug} has an incomplete price component.`,
        );
      }
      if (component.amount === "0" || component.amount === "0.00") {
        errors.push(
          `${offering.programSlug} must not use zero as a price placeholder.`,
        );
      }
      if (kinds.has(component.kind)) {
        errors.push(
          `${offering.programSlug} has duplicate price kind ${component.kind}.`,
        );
      }
      kinds.add(component.kind);
    }
    const key = `${offering.programSlug}|${offering.startDate}`;
    if (offeringKeys.has(key)) {
      errors.push(`Duplicate offering identity: ${key}`);
    }
    offeringKeys.add(key);
  }

  if (errors.length > 0) {
    throw new Error(`Offering dataset validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function toDateKey(value: unknown): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function sameComponent(
  current: {
    kind: string;
    label: string;
    amount: string;
    currency: string;
    sortOrder: number;
  },
  desired: OfferingPriceComponent,
): boolean {
  return (
    current.kind === desired.kind &&
    current.label === desired.label &&
    String(current.amount) === desired.amount &&
    current.currency === desired.currency &&
    current.sortOrder === desired.sortOrder
  );
}

async function seedOfferings() {
  validateDataset();

  const db = getDb();
  const programRows = await db
    .select({
      id: programs.id,
      slug: programs.slug,
    })
    .from(programs);

  if (programRows.length !== 32) {
    throw new Error(`Expected 32 programs, found ${programRows.length}.`);
  }

  const programIdBySlug = new Map(programRows.map((row) => [row.slug, row.id]));
  const existing = await db.select().from(offerings);
  const existingByKey = new Map<string, (typeof existing)[number][]>();

  for (const row of existing) {
    const key = `${row.programId}|${toDateKey(row.startDate)}`;
    const group = existingByKey.get(key) ?? [];
    group.push(row);
    existingByKey.set(key, group);
  }

  const existingComponents = await db.select().from(offeringPriceComponents);
  const componentsByOfferingId = new Map<
    string,
    (typeof existingComponents)[number][]
  >();
  for (const row of existingComponents) {
    const group = componentsByOfferingId.get(row.offeringId) ?? [];
    group.push(row);
    componentsByOfferingId.set(row.offeringId, group);
  }

  let inserted = 0;
  let updated = 0;
  let componentsInserted = 0;
  let componentsUpdated = 0;
  let componentsDeleted = 0;

  for (const offering of OFFERINGS) {
    const programId = programIdBySlug.get(offering.programSlug);
    if (!programId) {
      throw new Error(`Program ${offering.programSlug} is not in Neon.`);
    }

    const key = `${programId}|${offering.startDate}`;
    const matches = existingByKey.get(key) ?? [];
    if (matches.length > 1) {
      throw new Error(
        `Cannot guarantee idempotency: ${matches.length} offerings already exist for ${offering.programSlug} on ${offering.startDate}.`,
      );
    }

    const payload = {
      startDate: offering.startDate,
      modality: offering.modality,
      schedule: offering.schedule,
      priceAmount: null,
      priceCurrency: null,
      editorialStatus: offering.editorialStatus,
    };

    let offeringId: string;

    if (matches.length === 1) {
      const current = matches[0];
      offeringId = current.id;
      const unchanged =
        toDateKey(current.startDate) === offering.startDate &&
        (current.modality ?? null) === offering.modality &&
        (current.schedule ?? null) === offering.schedule &&
        current.priceAmount === null &&
        current.priceCurrency === null &&
        current.editorialStatus === offering.editorialStatus;

      if (!unchanged) {
        await db
          .update(offerings)
          .set(payload)
          .where(and(eq(offerings.id, current.id)));
        updated += 1;
      }
    } else {
      const insertedRows = await db
        .insert(offerings)
        .values({
          programId,
          ...payload,
        })
        .returning({ id: offerings.id });
      offeringId = insertedRows[0].id;
      inserted += 1;
    }

    const currentComponents = componentsByOfferingId.get(offeringId) ?? [];
    const currentByKind = new Map(
      currentComponents.map((row) => [row.kind, row]),
    );
    const desiredKinds = new Set(
      offering.priceComponents.map((component) => component.kind),
    );

    for (const component of offering.priceComponents) {
      const current = currentByKind.get(component.kind);
      if (!current) {
        await db.insert(offeringPriceComponents).values({
          offeringId,
          kind: component.kind,
          label: component.label,
          amount: component.amount,
          currency: component.currency,
          sortOrder: component.sortOrder,
        });
        componentsInserted += 1;
        continue;
      }
      if (!sameComponent(current, component)) {
        await db
          .update(offeringPriceComponents)
          .set({
            label: component.label,
            amount: component.amount,
            currency: component.currency,
            sortOrder: component.sortOrder,
          })
          .where(eq(offeringPriceComponents.id, current.id));
        componentsUpdated += 1;
      }
    }

    for (const current of currentComponents) {
      if (!desiredKinds.has(current.kind)) {
        await db
          .delete(offeringPriceComponents)
          .where(eq(offeringPriceComponents.id, current.id));
        componentsDeleted += 1;
      }
    }
  }

  const finalOfferings = await db.select({ id: offerings.id }).from(offerings);
  const finalComponents = await db
    .select({ id: offeringPriceComponents.id })
    .from(offeringPriceComponents);

  const multi = OFFERINGS.filter(
    (offering) => offering.priceComponents.length > 1,
  ).length;
  const single = OFFERINGS.filter(
    (offering) => offering.priceComponents.length === 1,
  ).length;
  const none = OFFERINGS.filter(
    (offering) => offering.priceComponents.length === 0,
  ).length;

  console.log(`csv_real_rows=30`);
  console.log(`matched_existing_program=23`);
  console.log(`csv_only=${CSV_ONLY.length}`);
  console.log(`no_2027_start_date=${NO_2027_START_DATE.length}`);
  console.log(`date_without_price=${DATE_WITHOUT_PRICE.length}`);
  console.log(`valid_offering=${OFFERINGS.length}`);
  console.log(`offerings=${finalOfferings.length}`);
  console.log(`price_components=${finalComponents.length}`);
  console.log(`multi_component=${multi}`);
  console.log(`single_component=${single}`);
  console.log(`no_price=${none}`);
  console.log(`inserted=${inserted}`);
  console.log(`updated=${updated}`);
  console.log(`components_inserted=${componentsInserted}`);
  console.log(`components_updated=${componentsUpdated}`);
  console.log(`components_deleted=${componentsDeleted}`);
}

seedOfferings().catch((error) => {
  console.error(error instanceof Error ? error.message : "Offering seed failed.");
  process.exit(1);
});
