"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress } from "./ProgressProvider";
import { activeMarks } from "@/lib/progress";
import { Arrow, Check, Logo } from "./Icons";
type PackSummary = {
  id: string;
  title: string;
  colour: string;
  termIds: string[];
};
export function ProgressDashboard({
  packs,
  terms,
}: {
  packs: PackSummary[];
  terms: { id: string; name: string }[];
}) {
  const {
    progress,
    user,
    ready,
    sync,
    hasGuest,
    importGuest,
    refresh,
    authEnabled,
  } = useProgress();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const review = activeMarks(progress.mistakes);
  const completedPacks = packs.filter((p) =>
    p.termIds.every((id) => progress.learned.includes(id)),
  );
  const resume = progress.lastLesson || "llm-basics/1";
  async function toggleLeaderboard() {
    if (!user || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optIn: !user.optIn }),
      });
      if (!response.ok) throw new Error();
      await refresh();
      setMessage(
        user.optIn
          ? "You are no longer shown on the leaderboard."
          : "You are now on the leaderboard.",
      );
    } catch {
      setMessage("That change could not be saved. Please try again.");
    }
    setSaving(false);
  }
  return (
    <>
      <div className="progress-heading">
        <div className="page-heading" data-enter>
          <span className="section-label">
            {user
              ? `HELLO, ${user.username.toUpperCase()}`
              : "YOUR OWN PACE. YOUR OWN PATH."}
          </span>
          <h1>
            A little more
            <br />
            makes sense.
          </h1>
          <p>{ready ? sync : "Finding your progress…"}</p>
          {sync.includes("retry") && (
            <button className="text-link" onClick={() => void refresh()}>
              Retry cloud saving <Arrow />
            </button>
          )}
        </div>
        <Link href={`/learn/${resume}`} className="button primary">
          {progress.lastLesson
            ? "Pick up where you left off"
            : "Start your first lesson"}
          <Arrow />
        </Link>
      </div>
      {hasGuest && (
        <div className="notice">
          <div>
            <strong>You learned a few things before signing in.</strong>
            <p>
              Bring this device’s guest progress into your account. It will not
              add leaderboard points.
            </p>
          </div>
          <button className="button" onClick={importGuest}>
            Import guest progress <Arrow />
          </button>
        </div>
      )}
      <div className="progress-stats">
        <div>
          <strong>
            {progress.learned.length}
            <small>/200</small>
          </strong>
          <span>terms understood</span>
        </div>
        <div>
          <strong>
            {progress.completed.length}
            <small>/50</small>
          </strong>
          <span>lessons complete</span>
        </div>
        <div>
          <strong>
            {completedPacks.length}
            <small>/10</small>
          </strong>
          <span>packs collected</span>
        </div>
      </div>
      {!user && (
        <div className="save-banner">
          <Logo />
          <div>
            <h2>
              {authEnabled
                ? "Keep the things you’ve learned."
                : "Your learning stays right here."}
            </h2>
            <p>
              {authEnabled
                ? "GitHub sign-in saves your progress across devices. You can keep learning here without it."
                : "This browser keeps your place. Return whenever you like, and pick up the next lesson."}
            </p>
          </div>
          <Link
            href={authEnabled ? "/sign-in" : "/wordbook"}
            className="button"
            prefetch={false}
          >
            {authEnabled ? "Save your place" : "Open my wordbook"} <Arrow />
          </Link>
        </div>
      )}
      <div className="dashboard-columns">
        <section>
          <div className="path-heading">
            <h2>Your pack collection</h2>
            <span>{completedPacks.length} complete</span>
          </div>
          <div className="progress-pack-list">
            {packs.map((pack) => {
              const count = pack.termIds.filter((id) =>
                progress.learned.includes(id),
              ).length;
              return (
                <Link href={`/packs/${pack.id}`} key={pack.id}>
                  <span className={`pack-colour-dot pack-${pack.colour}`}>
                    {count === 20 ? (
                      <Check />
                    ) : (
                      <span aria-hidden="true">✳</span>
                    )}
                  </span>
                  <div>
                    <h3>{pack.title}</h3>
                    <div className="progress-track">
                      <span style={{ width: `${count * 5}%` }} />
                    </div>
                  </div>
                  <span>{count}/20</span>
                  <Arrow />
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="review-panel">
          <span className="section-label">ANOTHER LOOK</span>
          <h2>
            Let’s make
            <br />
            these stick.
          </h2>
          {review.length ? (
            <>
              <p>
                These terms came up in questions you missed. Revisit a lesson to
                practise them again.
              </p>
              <div className="review-list">
                {terms
                  .filter((t) => review.includes(t.id))
                  .map((term) => (
                    <Link href={`/terms/${term.id}`} key={term.id}>
                      {term.name}
                      <Arrow diagonal />
                    </Link>
                  ))}
              </div>
            </>
          ) : (
            <p>
              No terms waiting for review. When a question trips you up, the
              term will appear here.
            </p>
          )}
          <Link className="text-link" href="/wordbook">
            Open your wordbook <Arrow />
          </Link>
        </aside>
      </div>
      {user && (
        <section className="leaderboard-preference">
          <div>
            <h2>A little friendly company?</h2>
            <p>
              Show your GitHub username and earned points on the public
              leaderboard. Participation is optional.
            </p>
          </div>
          <button
            className="button"
            disabled={saving}
            aria-pressed={user.optIn}
            onClick={() => void toggleLeaderboard()}
          >
            {saving
              ? "Saving…"
              : user.optIn
                ? "Leave leaderboard"
                : "Join leaderboard"}
          </button>
          <p role="status">{message}</p>
        </section>
      )}
    </>
  );
}
