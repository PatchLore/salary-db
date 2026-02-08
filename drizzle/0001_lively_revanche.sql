ALTER TABLE "submissions" ADD COLUMN "currency" varchar(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currency_idx" ON "submissions" USING btree ("currency");