import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Editorial publication is independent from temporal eligibility.
 * Public visibility is resolved in the application from published program +
 * published offering whose startDate is today or later. Not persisted.
 * Price is optional and does not affect visibility.
 */
export const editorialStatusEnum = pgEnum("editorial_status", [
  "draft",
  "published",
]);

export const offeringPriceKindEnum = pgEnum("offering_price_kind", [
  "enrollment",
  "program",
  "subject",
  "investment",
]);

export const leadChannelEnum = pgEnum("lead_channel", ["email", "whatsapp"]);

export const leadDeliveryStatusEnum = pgEnum("lead_delivery_status", [
  "PENDING",
  "SENT",
  "FAILED",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const academicTypes = pgTable(
  "academic_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("academic_types_slug_uidx").on(table.slug),
  ],
);

export const knowledgeFields = pgTable(
  "knowledge_fields",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("knowledge_fields_slug_uidx").on(table.slug),
  ],
);

export const programs = pgTable(
  "programs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    academicTypeId: uuid("academic_type_id")
      .notNull()
      .references(() => academicTypes.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    entryProfile: text("entry_profile"),
    exitProfile: text("exit_profile"),
    requirements: text("requirements"),
    curriculum: text("curriculum"),
    complementaryInfo: text("complementary_info"),
    duration: text("duration"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    editorialStatus: editorialStatusEnum("editorial_status")
      .notNull()
      .default("draft"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("programs_slug_uidx").on(table.slug),
    index("programs_academic_type_id_idx").on(table.academicTypeId),
    index("programs_editorial_status_idx").on(table.editorialStatus),
  ],
);

export const programKnowledgeFields = pgTable(
  "program_knowledge_fields",
  {
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    knowledgeFieldId: uuid("knowledge_field_id")
      .notNull()
      .references(() => knowledgeFields.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "program_knowledge_fields_pk",
      columns: [table.programId, table.knowledgeFieldId],
    }),
    index("program_knowledge_fields_field_idx").on(table.knowledgeFieldId),
  ],
);

export const offerings = pgTable(
  "offerings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    modality: text("modality"),
    schedule: text("schedule"),
    /** @deprecated Presentation uses offering_price_components. Kept nullable for compatibility. */
    priceAmount: numeric("price_amount", { precision: 12, scale: 2 }),
    /** @deprecated Presentation uses offering_price_components. Kept nullable for compatibility. */
    priceCurrency: text("price_currency"),
    editorialStatus: editorialStatusEnum("editorial_status")
      .notNull()
      .default("draft"),
    ...timestamps,
  },
  (table) => [
    index("offerings_program_id_idx").on(table.programId),
    index("offerings_start_date_idx").on(table.startDate),
    index("offerings_editorial_status_idx").on(table.editorialStatus),
    check(
      "offerings_price_amount_currency_chk",
      sql`(
        (${table.priceAmount} IS NULL AND ${table.priceCurrency} IS NULL)
        OR
        (${table.priceAmount} IS NOT NULL AND ${table.priceCurrency} IS NOT NULL)
      )`,
    ),
  ],
);

export const offeringPriceComponents = pgTable(
  "offering_price_components",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    offeringId: uuid("offering_id")
      .notNull()
      .references(() => offerings.id, { onDelete: "cascade" }),
    kind: offeringPriceKindEnum("kind").notNull(),
    label: text("label").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: text("currency").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("offering_price_components_offering_kind_uidx").on(
      table.offeringId,
      table.kind,
    ),
    index("offering_price_components_offering_id_idx").on(table.offeringId),
  ],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size"),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("media_assets_program_id_idx").on(table.programId)],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    contactChannel: leadChannelEnum("contact_channel").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

export const leadPrograms = pgTable(
  "lead_programs",
  {
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: "lead_programs_pk",
      columns: [table.leadId, table.programId],
    }),
    index("lead_programs_program_id_idx").on(table.programId),
  ],
);

export const leadDeliveries = pgTable(
  "lead_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    channel: leadChannelEnum("channel").notNull(),
    status: leadDeliveryStatusEnum("status").notNull().default("PENDING"),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("lead_deliveries_lead_id_idx").on(table.leadId),
    index("lead_deliveries_status_idx").on(table.status),
  ],
);

export const academicTypesRelations = relations(academicTypes, ({ many }) => ({
  programs: many(programs),
}));

export const knowledgeFieldsRelations = relations(
  knowledgeFields,
  ({ many }) => ({
    programs: many(programKnowledgeFields),
  }),
);

export const programsRelations = relations(programs, ({ one, many }) => ({
  academicType: one(academicTypes, {
    fields: [programs.academicTypeId],
    references: [academicTypes.id],
  }),
  knowledgeFields: many(programKnowledgeFields),
  offerings: many(offerings),
  mediaAssets: many(mediaAssets),
  leadPrograms: many(leadPrograms),
}));

export const programKnowledgeFieldsRelations = relations(
  programKnowledgeFields,
  ({ one }) => ({
    program: one(programs, {
      fields: [programKnowledgeFields.programId],
      references: [programs.id],
    }),
    knowledgeField: one(knowledgeFields, {
      fields: [programKnowledgeFields.knowledgeFieldId],
      references: [knowledgeFields.id],
    }),
  }),
);

export const offeringsRelations = relations(offerings, ({ one, many }) => ({
  program: one(programs, {
    fields: [offerings.programId],
    references: [programs.id],
  }),
  priceComponents: many(offeringPriceComponents),
}));

export const offeringPriceComponentsRelations = relations(
  offeringPriceComponents,
  ({ one }) => ({
    offering: one(offerings, {
      fields: [offeringPriceComponents.offeringId],
      references: [offerings.id],
    }),
  }),
);

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  program: one(programs, {
    fields: [mediaAssets.programId],
    references: [programs.id],
  }),
}));

export const leadsRelations = relations(leads, ({ many }) => ({
  programs: many(leadPrograms),
  deliveries: many(leadDeliveries),
}));

export const leadProgramsRelations = relations(leadPrograms, ({ one }) => ({
  lead: one(leads, {
    fields: [leadPrograms.leadId],
    references: [leads.id],
  }),
  program: one(programs, {
    fields: [leadPrograms.programId],
    references: [programs.id],
  }),
}));

export const leadDeliveriesRelations = relations(leadDeliveries, ({ one }) => ({
  lead: one(leads, {
    fields: [leadDeliveries.leadId],
    references: [leads.id],
  }),
}));
