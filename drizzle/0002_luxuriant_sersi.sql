CREATE TYPE "public"."offering_price_kind" AS ENUM('enrollment', 'program', 'subject', 'investment');--> statement-breakpoint
CREATE TABLE "offering_price_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offering_id" uuid NOT NULL,
	"kind" "offering_price_kind" NOT NULL,
	"label" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offering_price_components" ADD CONSTRAINT "offering_price_components_offering_id_offerings_id_fk" FOREIGN KEY ("offering_id") REFERENCES "public"."offerings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "offering_price_components_offering_kind_uidx" ON "offering_price_components" USING btree ("offering_id","kind");--> statement-breakpoint
CREATE INDEX "offering_price_components_offering_id_idx" ON "offering_price_components" USING btree ("offering_id");