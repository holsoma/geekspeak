import { authConfigured } from "@/auth";
import { profile, currentUser, database, sameOrigin } from "@/lib/db";
export async function GET() {
  try {
    const data = await profile();
    return Response.json(
      { ...data, user: data?.user || null, authEnabled: authConfigured },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Cloud saving is temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const user = await currentUser();
    if (!user)
      return Response.json({ error: "Sign in first" }, { status: 401 });
    const body = await request.json();
    if (typeof body.optIn !== "boolean")
      return Response.json({ error: "Invalid preference" }, { status: 400 });
    await profile();
    const sql = database();
    await sql`UPDATE profiles SET opt_in=${body.optIn} WHERE github_id=${user.id}`;
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Could not save the preference." },
      { status: 503 },
    );
  }
}
