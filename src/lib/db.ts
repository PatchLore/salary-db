import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  const withoutPsql = trimmed.replace(/^psql(%20|\s)+/i, "");
  if (!withoutPsql) throw new Error("DATABASE_URL is missing. Add it to .env or .env.local");
  return withoutPsql;
}

// Lazy init so build can succeed without DATABASE_URL (only needed at runtime)
let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db) {
    const sql = neon(getDatabaseUrl());
    _db = drizzle(sql);
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});
