"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProgress } from "./ProgressProvider";
import { Arrow, Logo } from "./Icons";
type Entry = { username: string; terms: number; xp: number };
export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [state, setState] = useState("loading");
  const { user, authEnabled } = useProgress();
  async function load() {
    setState("loading");
    try {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setEntries(data.entries);
      setState(data.available ? "ready" : "unavailable");
    } catch {
      setState("error");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <>
      <div className="leaderboard-intro">
        <p>
          Ten points for each new term answered correctly while signed in.
          <br />
          No weekly resets, no speed bonuses, no points for repeating the easy
          bits.
        </p>
        {state === "ready" && authEnabled && (
          <Link
            className="button primary"
            href={user ? "/progress" : "/sign-in"}
            prefetch={false}
          >
            {user ? "Manage participation" : "Sign in to join"}
            <Arrow />
          </Link>
        )}
      </div>
      {state === "loading" ? (
        <p className="loading-message" role="status">
          Finding fellow learners…
        </p>
      ) : entries.length ? (
        <div className="leaderboard-table">
          <div className="leaderboard-row table-heading">
            <span>Place</span>
            <span>Learner</span>
            <span>Terms</span>
            <span>Points</span>
          </div>
          {entries.map((entry, i) => (
            <div
              key={entry.username}
              className={`leaderboard-row ${entry.username === user?.username ? "you" : ""}`}
            >
              <strong>{String(i + 1).padStart(2, "0")}</strong>
              <span>
                @{entry.username}
                {entry.username === user?.username && <small> You</small>}
              </span>
              <span>{entry.terms}</span>
              <strong>{entry.xp}</strong>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state leaderboard-empty">
          <Logo />
          <h2>
            {state === "error"
              ? "The leaderboard is taking a break."
              : state === "unavailable"
                ? "A little company, coming soon."
                : "There’s room at the top."}
          </h2>
          <p>
            {state === "error"
              ? "We could not load the scores. Your learning can continue."
              : state === "unavailable"
                ? "Account saving and the leaderboard are not connected yet. Every pack is ready to explore."
                : "No one has joined the leaderboard yet. Complete a lesson while signed in, then opt in from My progress."}
          </p>
          {state === "error" ? (
            <button className="button" onClick={() => void load()}>
              Try again <Arrow />
            </button>
          ) : (
            <Link href="/packs" className="button">
              Find a pack <Arrow />
            </Link>
          )}
        </div>
      )}
      <p className="leaderboard-footnote">
        Only learners who choose to participate appear here. Imported guest
        progress counts towards your learning, but not public points.
      </p>
    </>
  );
}
