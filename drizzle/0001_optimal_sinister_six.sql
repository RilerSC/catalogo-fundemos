ALTER TABLE "offerings" ALTER COLUMN "price_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "offerings" ALTER COLUMN "price_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "offerings" ADD CONSTRAINT "offerings_price_amount_currency_chk" CHECK ((
        ("offerings"."price_amount" IS NULL AND "offerings"."price_currency" IS NULL)
        OR
        ("offerings"."price_amount" IS NOT NULL AND "offerings"."price_currency" IS NOT NULL)
      ));