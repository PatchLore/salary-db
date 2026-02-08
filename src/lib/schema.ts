import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const companySizeEnum = ["1-10", "11-50", "51-200", "200+"] as const;
export type CompanySize = (typeof companySizeEnum)[number];

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    role: varchar("role", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    salaryMin: integer("salary_min").notNull(),
    salaryMax: integer("salary_max").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    yearsExp: integer("years_exp").notNull(),
    companySize: varchar("company_size", { length: 50 }).notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  },
  (table) => [
    index("submissions_role_idx").on(table.role),
    index("submissions_location_idx").on(table.location),
    index("submissions_salary_min_idx").on(table.salaryMin),
    index("currency_idx").on(table.currency),
  ]
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
