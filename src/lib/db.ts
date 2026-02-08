import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  // Strip "psql " or "psql%20" if copied from CLI example (psql postgresql://...)
  const withoutPsql = trimmed.replace(/^psql(%20|\s)+/i, "");
  if (!withoutPsql) throw new Error("DATABASE_URL is missing. Add it to .env or .env.local");
  return withoutPsql;
}

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql);
