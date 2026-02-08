CREATE TABLE IF NOT EXISTS "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"salary_min" integer NOT NULL,
	"salary_max" integer NOT NULL,
	"years_exp" integer NOT NULL,
	"company_size" varchar(50) NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"ip_hash" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_role_idx" ON "submissions" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_location_idx" ON "submissions" USING btree ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submissions_salary_min_idx" ON "submissions" USING btree ("salary_min");