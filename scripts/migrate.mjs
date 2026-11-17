import { neon } from "@neondatabase/serverless";
import { readdir, readFile } from "node:fs/promises";
if (!process.env.DATABASE_URL) {
  console.log("No database configured; guest learning remains available.");
  process.exit(0);
}
const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
for (const name of (
  await readdir(new URL("../db/migrations/", import.meta.url))
)
  .filter((x) => x.endsWith(".sql"))
  .sort()) {
  const exists =
    await sql`SELECT name FROM schema_migrations WHERE name=${name}`;
  if (exists.length) continue;
  const source = await readFile(
    new URL(`../db/migrations/${name}`, import.meta.url),
    "utf8",
  );
  await sql.transaction([
    ...source
      .split(";")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((statement) => sql.query(statement)),
    sql`INSERT INTO schema_migrations (name) VALUES (${name})`,
  ]);
  console.log(`Applied ${name}`);
}
