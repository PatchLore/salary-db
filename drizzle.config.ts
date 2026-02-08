import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env and .env.local so drizzle-kit gets DATABASE_URL when run from CLI
function loadEnv(file: string) {
  try {
    const content = readFileSync(resolve(process.cwd(), file), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch {
    // ignore missing file
  }
}
loadEnv(".env");
loadEnv(".env.local");

// Strip quotes, trim, and remove "psql " if copied from CLI example
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  const withoutPsql = trimmed.replace(/^psql(%20|\s)+/i, "");
  if (!withoutPsql) throw new Error("DATABASE_URL is missing in .env or .env.local");
  return withoutPsql;
}

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
