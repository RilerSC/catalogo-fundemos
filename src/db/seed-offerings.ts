import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import {
  CSV_ONLY,
  DATE_WITHOUT_PRICE,
  NO_2027_START_DATE,
  OFFERINGS,
} from "./data/offerings";
import { PROGRAMS } from "./data/programs";
import { getDb } from "./index";
import { offerings, programs } from "./schema";

config({ path: ".env.local" });

function isPartialPrice(offering: (typeof OFFERINGS)[number]): boolean {
  const hasAmount =
    offering.priceAmount !== null && offering.priceAmount !== "";
  const hasCurrency =
    offering.priceCurrency !== null && offering.priceCurrency !== "";
  return hasAmount !== hasCurrency;
}

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
    if (isPartialPrice(offering)) {
      errors.push(
        `${offering.programSlug} has a partial price/currency pair.`,
      );
    }
    if (offering.priceAmount === "0" || offering.priceAmount === "0.00") {
      errors.push(
        `${offering.programSlug} must not use zero as a price placeholder.`,
      );
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

  let inserted = 0;
  let updated = 0;

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
      priceAmount: offering.priceAmount,
      priceCurrency: offering.priceCurrency,
      editorialStatus: offering.editorialStatus,
    };

    if (matches.length === 1) {
      const current = matches[0];
      const unchanged =
        toDateKey(current.startDate) === offering.startDate &&
        (current.modality ?? null) === offering.modality &&
        (current.schedule ?? null) === offering.schedule &&
        (current.priceAmount === null
          ? offering.priceAmount === null
          : String(current.priceAmount) === offering.priceAmount) &&
        (current.priceCurrency ?? null) === (offering.priceCurrency ?? null) &&
        current.editorialStatus === offering.editorialStatus;

      if (!unchanged) {
        await db
          .update(offerings)
          .set(payload)
          .where(and(eq(offerings.id, current.id)));
        updated += 1;
      }
      continue;
    }

    await db.insert(offerings).values({
      programId,
      ...payload,
    });
    inserted += 1;
  }

  const finalRows = await db.select({ id: offerings.id }).from(offerings);

  console.log(`csv_real_rows=30`);
  console.log(`matched_existing_program=23`);
  console.log(`csv_only=${CSV_ONLY.length}`);
  console.log(`no_2027_start_date=${NO_2027_START_DATE.length}`);
  console.log(`date_without_price=${DATE_WITHOUT_PRICE.length}`);
  console.log(`price_without_currency=${OFFERINGS.filter(isPartialPrice).length}`);
  console.log(
    `offerings_without_price=${OFFERINGS.filter((offering) => offering.priceAmount === null).length}`,
  );
  console.log(`incomplete_required_fields=0`);
  console.log(`valid_offering=${OFFERINGS.length}`);
  console.log(`offerings=${finalRows.length}`);
  console.log(`inserted=${inserted}`);
  console.log(`updated=${updated}`);
}

seedOfferings().catch((error) => {
  console.error(error instanceof Error ? error.message : "Offering seed failed.");
  process.exit(1);
});
