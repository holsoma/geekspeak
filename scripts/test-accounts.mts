import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { encode } from "@auth/core/jwt";
import { neon } from "@neondatabase/serverless";
import { getTerm } from "../src/data/packs";

// Explicit integration check. Creates two temporary, clearly named test profiles.
// The OAuth browser handshake is a separate check; these sessions test the app's
// session handling, data ownership, persistence and scoring after authentication.
const origin = process.env.TEST_URL;
const secret = process.env.AUTH_SECRET;
const connection = process.env.DATABASE_URL;
if (!origin || !secret || !connection)
  throw new Error(
    "Set TEST_URL, AUTH_SECRET and DATABASE_URL for this integration check.",
  );
const sql = neon(connection);
const prefix = `geekspeak-e2e-${randomUUID()}`;
const ids = [`${prefix}-a`, `${prefix}-b`];
const usernames = [`test-${prefix}-a`, `test-${prefix}-b`];
const cookieName =
  new URL(origin).protocol === "https:"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
const cookies = await Promise.all(
  ids.map(
    async (id, i) =>
      `${cookieName}=${await encode({
        token: { sub: id, name: usernames[i], username: usernames[i] },
        secret,
        salt: cookieName,
        maxAge: 300,
      })}`,
  ),
);
async function call(
  path: string,
  user: number | null,
  method = "GET",
  body?: unknown,
) {
  const response = await fetch(new URL(path, origin), {
    method,
    headers: {
      Origin: origin!,
      ...(user !== null ? { Cookie: cookies[user] } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    redirect: "manual",
  });
  const value = await response.json();
  return { status: response.status, value };
}
const checks: string[] = [];
try {
  for (let i = 0; i < ids.length; i++) {
    const profile = await call("/api/profile", i);
    assert.equal(profile.status, 200);
    assert.equal(profile.value.authEnabled, true);
    assert.equal(profile.value.user.id, ids[i]);
  }
  checks.push("encrypted sessions identify their own profiles");
  const now = Date.now();
  const progress = {
    version: 1,
    learned: ["token"],
    completed: ["llm-basics/1"],
    bookmarks: { idempotency: { value: true, at: now } },
    mistakes: {},
    lastLesson: "llm-basics/1",
  };
  assert.equal((await call("/api/progress", 0, "POST", progress)).status, 200);
  const anotherRequest = await call("/api/profile", 0);
  assert.ok(anotherRequest.value.progress.learned.includes("token"));
  assert.equal(anotherRequest.value.progress.bookmarks.idempotency.value, true);
  const other = await call("/api/profile", 1);
  assert.deepEqual(other.value.progress.learned, []);
  checks.push(
    "cloud progress survives a separate request and remains isolated between accounts",
  );
  assert.equal(
    (await call("/api/progress", null, "POST", progress)).status,
    401,
  );
  assert.equal(
    (await call("/api/profile", null, "PATCH", { optIn: true })).status,
    401,
  );
  const foreign = await fetch(new URL("/api/progress", origin), {
    method: "POST",
    headers: { Origin: "https://example.org", Cookie: cookies[0] },
    body: JSON.stringify(progress),
  });
  assert.equal(foreign.status, 403);
  checks.push("signed-out writes and foreign-origin writes are rejected");
  const term = getTerm("token")!;
  const wrong = await call("/api/answer", 0, "POST", {
    termId: term.id,
    option: (term.question.answer + 1) % 4,
  });
  assert.equal(wrong.value.awarded, 0);
  const correct = { termId: term.id, option: term.question.answer };
  assert.equal(
    (await call("/api/answer", 0, "POST", correct)).value.awarded,
    10,
  );
  assert.equal(
    (await call("/api/answer", 0, "POST", correct)).value.awarded,
    0,
  );
  checks.push(
    "wrong answers earn nothing and repeated correct answers cannot duplicate points",
  );
  const hidden = await call("/api/leaderboard", null);
  assert.equal(hidden.value.available, true);
  assert.ok(
    !hidden.value.entries.some((entry: any) => entry.username === usernames[0]),
  );
  assert.equal(
    (await call("/api/profile", 0, "PATCH", { optIn: true })).status,
    200,
  );
  const listed = await call("/api/leaderboard", null);
  const entry = listed.value.entries.find(
    (row: any) => row.username === usernames[0],
  );
  assert.equal(entry?.xp, 10);
  assert.equal(entry?.terms, 1);
  assert.equal(
    (await call("/api/profile", 0, "PATCH", { optIn: false })).status,
    200,
  );
  const removed = await call("/api/leaderboard", null);
  assert.ok(
    !removed.value.entries.some(
      (entry: any) => entry.username === usernames[0],
    ),
  );
  checks.push(
    "leaderboard participation is opt-in and withdrawing removes the profile",
  );
  const out = process.env.TEST_OUTPUT || ".jury/accounts";
  await mkdir(out, { recursive: true });
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        passed: true,
        origin,
        checks,
        oauthHandshake: "requires real GitHub login",
      },
      null,
      2,
    ),
  );
  console.log(
    "All account persistence, ownership and leaderboard integration checks passed.",
  );
} finally {
  await sql`DELETE FROM profiles WHERE github_id=${ids[0]} OR github_id=${ids[1]}`;
  const remaining =
    await sql`SELECT github_id FROM profiles WHERE github_id=${ids[0]} OR github_id=${ids[1]}`;
  assert.equal(remaining.length, 0);
  console.log("Temporary test profiles and their scores removed.");
}
