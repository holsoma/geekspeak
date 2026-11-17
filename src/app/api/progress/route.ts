import { database, profile, sameOrigin } from "@/lib/db";
import { readProgress, mergeProgress } from "@/lib/progress";
import { terms, packs } from "@/data/packs";
const termIds = new Set(terms.map((t) => t.id));
const lessonIds = new Set(
  packs.flatMap((p) => p.lessons.map((_, i) => `${p.id}/${i + 1}`)),
);
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 100000)
      return Response.json({ error: "Too much data" }, { status: 413 });
    const input = readProgress(JSON.parse(text));
    input.learned = input.learned.filter((id) => termIds.has(id));
    input.completed = input.completed.filter((id) => lessonIds.has(id));
    input.bookmarks = Object.fromEntries(
      Object.entries(input.bookmarks).filter(([id]) => termIds.has(id)),
    );
    input.mistakes = Object.fromEntries(
      Object.entries(input.mistakes).filter(([id]) => termIds.has(id)),
    );
    if (input.lastLesson && !lessonIds.has(input.lastLesson))
      input.lastLesson = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      const data = await profile();
      if (!data)
        return Response.json({ error: "Sign in first" }, { status: 401 });
      const merged = mergeProgress(data.progress, input);
      const sql = database();
      const rows =
        await sql`UPDATE profiles SET progress=${JSON.stringify(merged)}::jsonb,revision=revision+1 WHERE github_id=${data.user.id} AND revision=${data.revision} RETURNING progress`;
      if (rows.length) return Response.json({ progress: merged });
    }
    return Response.json(
      { error: "Progress changed. Please retry." },
      { status: 409 },
    );
  } catch {
    return Response.json(
      { error: "Progress could not be saved. Your device keeps a copy." },
      { status: 503 },
    );
  }
}
