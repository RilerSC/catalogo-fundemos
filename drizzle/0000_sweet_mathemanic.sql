CREATE TYPE "public"."editorial_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."lead_channel" AS ENUM('email', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."lead_delivery_status" AS ENUM('PENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TABLE "academic_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"channel" "lead_channel" NOT NULL,
	"status" "lead_delivery_status" DEFAULT 'PENDING' NOT NULL,
	"attempted_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_programs" (
	"lead_id" uuid NOT NULL,
	"program_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_programs_pk" PRIMARY KEY("lead_id","program_id")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"contact_channel" "lead_channel" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer,
	"alt_text" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"modality" text,
	"schedule" text,
	"price_amount" numeric(12, 2) NOT NULL,
	"price_currency" text NOT NULL,
	"editorial_status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_knowledge_fields" (
	"program_id" uuid NOT NULL,
	"knowledge_field_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "program_knowledge_fields_pk" PRIMARY KEY("program_id","knowledge_field_id")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"academic_type_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"entry_profile" text,
	"exit_profile" text,
	"requirements" text,
	"curriculum" text,
	"complementary_info" text,
	"duration" text,
	"seo_title" text,
	"seo_description" text,
	"editorial_status" "editorial_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_deliveries" ADD CONSTRAINT "lead_deliveries_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_programs" ADD CONSTRAINT "lead_programs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_programs" ADD CONSTRAINT "lead_programs_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_knowledge_fields" ADD CONSTRAINT "program_knowledge_fields_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_knowledge_fields" ADD CONSTRAINT "program_knowledge_fields_knowledge_field_id_knowledge_fields_id_fk" FOREIGN KEY ("knowledge_field_id") REFERENCES "public"."knowledge_fields"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_academic_type_id_academic_types_id_fk" FOREIGN KEY ("academic_type_id") REFERENCES "public"."academic_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "academic_types_slug_uidx" ON "academic_types" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_fields_slug_uidx" ON "knowledge_fields" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "lead_deliveries_lead_id_idx" ON "lead_deliveries" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_deliveries_status_idx" ON "lead_deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lead_programs_program_id_idx" ON "lead_programs" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_assets_program_id_idx" ON "media_assets" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "offerings_program_id_idx" ON "offerings" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "offerings_start_date_idx" ON "offerings" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "offerings_editorial_status_idx" ON "offerings" USING btree ("editorial_status");--> statement-breakpoint
CREATE INDEX "program_knowledge_fields_field_idx" ON "program_knowledge_fields" USING btree ("knowledge_field_id");--> statement-breakpoint
CREATE UNIQUE INDEX "programs_slug_uidx" ON "programs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "programs_academic_type_id_idx" ON "programs" USING btree ("academic_type_id");--> statement-breakpoint
CREATE INDEX "programs_editorial_status_idx" ON "programs" USING btree ("editorial_status");