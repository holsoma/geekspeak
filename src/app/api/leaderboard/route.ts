import { database } from "@/lib/db";
export async function GET() {
  if (!process.env.DATABASE_URL)
    return Response.json({ available: false, entries: [] });
  try {
    const sql = database();
    const rows =
      await sql`SELECT p.username, count(v.term_id)::int AS terms, (count(v.term_id)*10)::int AS xp FROM profiles p JOIN verified_terms v ON v.github_id=p.github_id WHERE p.opt_in=true GROUP BY p.github_id,p.username ORDER BY xp DESC,p.username ASC LIMIT 20`;
    return Response.json(
      { available: true, entries: rows },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ available: false, entries: [] }, { status: 503 });
  }
}
