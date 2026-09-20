import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationsDir = join(__dirname, "migrations");

const migrationSql = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => readFileSync(join(migrationsDir, entry.name, "migration.sql"), "utf8"))
  .join("\n")
  // Ignore SQL comments so explanatory text can mention the keywords below.
  .replace(/--.*$/gm, "");

function matchAll(pattern: RegExp): string[] {
  return [...migrationSql.matchAll(pattern)].map((match) => match[1]);
}

describe("row level security", () => {
  it("enables RLS on every table created by a migration", () => {
    const created = matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?"([^"]+)"/gi);
    const secured = new Set(
      matchAll(/ALTER TABLE\s+(?:IF EXISTS\s+)?"([^"]+)"\s+ENABLE ROW LEVEL SECURITY/gi)
    );

    expect(created.length).toBeGreaterThan(0);
    // Supabase exposes `public` tables via its Data API; unsecured ones are
    // readable with the anon key. Add ENABLE ROW LEVEL SECURITY in the migration.
    expect(created.filter((table) => !secured.has(table))).toEqual([]);
  });

  it("never forces RLS, which would lock out the app's connection role", () => {
    expect(migrationSql).not.toMatch(/FORCE ROW LEVEL SECURITY/i);
  });
});
