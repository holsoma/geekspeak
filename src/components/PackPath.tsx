"use client";
import Link from "next/link";
import type { Pack } from "@/data/types";
import { useProgress } from "./ProgressProvider";
import { Arrow, Check } from "./Icons";
export function PackPath({ pack }: { pack: Pack }) {
  const { progress, ready } = useProgress();
  const done = pack.lessons.filter((_, i) =>
    progress.completed.includes(`${pack.id}/${i + 1}`),
  ).length;
  return (
    <div className="pack-path">
      <div className="path-heading">
        <h2>Your path through the pack</h2>
        <span>{ready ? done : 0} / 5 complete</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${pack.title} progress`}
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <span style={{ width: `${done * 20}%` }} />
      </div>
      <ol className="lesson-path">
        {pack.lessons.map((title, i) => {
          const id = `${pack.id}/${i + 1}`;
          const complete = progress.completed.includes(id);
          const locked =
            i > 0 && !progress.completed.includes(`${pack.id}/${i}`);
          return (
            <li
              key={id}
              className={
                complete ? "complete" : locked ? "locked" : "available"
              }
            >
              <span className="lesson-number">
                {complete ? <Check /> : String(i + 1).padStart(2, "0")}
              </span>
              <div className="lesson-info">
                <h3>{title}</h3>
                <p>
                  {pack.terms
                    .slice(i * 4, i * 4 + 4)
                    .map((t) => t.name)
                    .join(" · ")}
                </p>
              </div>
              <div className="lesson-actions">
                {locked ? (
                  <>
                    <span className="muted small">
                      Complete lesson {i} first
                    </span>
                    <Link
                      href={`/learn/${id}?mode=test`}
                      className="text-link"
                      aria-label={`Know this already? Test out of lesson ${i + 1}: ${title}`}
                    >
                      Know this already? <Arrow />
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/learn/${id}`}
                    className="button small-button"
                    aria-label={`${complete ? "Revisit" : "Start"} lesson ${i + 1}: ${title}`}
                  >
                    {complete ? "Revisit" : "Start lesson"}
                    <Arrow />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="path-note">
        Already know the material? Test out of any lesson by getting all four
        questions right. A missed answer shows you what to learn next.
      </p>
    </div>
  );
}
