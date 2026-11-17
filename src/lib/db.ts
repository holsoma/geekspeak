import { neon } from "@neondatabase/serverless";
import { auth, authConfigured } from "@/auth";
import { emptyProgress, readProgress } from "./progress";
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  return neon(process.env.DATABASE_URL);
}
export async function currentUser() {
  if (!authConfigured) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    username: session.user.name || "learner",
    name: session.user.name || "Learner",
  };
}
export async function profile() {
  const user = await currentUser();
  if (!user) return null;
  const sql = database();
  const rows =
    await sql`INSERT INTO profiles (github_id,username) VALUES (${user.id},${user.username}) ON CONFLICT (github_id) DO UPDATE SET username=EXCLUDED.username RETURNING progress,revision,opt_in`;
  return {
    user: { ...user, optIn: Boolean(rows[0].opt_in) },
    progress: readProgress(rows[0].progress || emptyProgress()),
    revision: Number(rows[0].revision),
  };
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
      : null;
    if (expected) return origin === expected;
    const parsed = new URL(origin);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      parsed.host === request.headers.get("host")
    );
  } catch {
    return false;
  }
}
