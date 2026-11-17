import { getTerm } from "@/data/packs";
import { currentUser, database, profile, sameOrigin } from "@/lib/db";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 1000)
      return Response.json({ error: "Invalid answer" }, { status: 400 });
    const body = JSON.parse(raw);
    const term = getTerm(body.termId);
    if (
      !term ||
      !Number.isInteger(body.option) ||
      body.option < 0 ||
      body.option > 3
    )
      return Response.json({ error: "Invalid answer" }, { status: 400 });
    const correct = body.option === term.question.answer;
    const user = await currentUser();
    let awarded = 0;
    if (correct && user) {
      await profile();
      const sql = database();
      const rows =
        await sql`INSERT INTO verified_terms (github_id,term_id) VALUES (${user.id},${term.id}) ON CONFLICT DO NOTHING RETURNING term_id`;
      awarded = rows.length ? 10 : 0;
    }
    return Response.json({ correct, answer: term.question.answer, awarded });
  } catch {
    return Response.json(
      {
        error:
          "Your answer could not be saved to the leaderboard. Personal progress is kept on this device.",
      },
      { status: 503 },
    );
  }
}
