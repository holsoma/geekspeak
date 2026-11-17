"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Term } from "@/data/types";
import { useProgress } from "./ProgressProvider";
import { Arrow, Check, Logo } from "./Icons";
type Props = {
  packId: string;
  packTitle: string;
  lesson: number;
  title: string;
  terms: Term[];
};
export function Lesson(props: Props) {
  const test = useSearchParams().get("mode") === "test";
  return <LessonBody key={test ? "test" : "study"} {...props} test={test} />;
}
function LessonBody({
  packId,
  packTitle,
  lesson,
  title,
  terms,
  test,
}: Props & { test: boolean }) {
  const { progress, update, ready, user, authEnabled, sync } = useProgress();
  const id = `${packId}/${lesson}`;
  const [stage, setStage] = useState<"study" | "quiz" | "done">(
    test ? "quiz" : "study",
  );
  const [position, setPosition] = useState(0);
  const [queue, setQueue] = useState(terms.map((_, i) => i));
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const term = terms[stage === "study" ? position : (queue[position] ?? 0)];
  const correct = choice === term?.question.answer;
  const locked =
    lesson > 1 &&
    !progress.completed.includes(`${packId}/${lesson - 1}`) &&
    !progress.completed.includes(id) &&
    !test;
  useEffect(() => {
    if (ready && !locked) update((p) => ({ ...p, lastLesson: id }));
  }, [id, ready, locked, update]);
  useEffect(() => {
    if (position || stage !== "study") heading.current?.focus();
  }, [position, stage]);
  function markAnswer(success: boolean) {
    update((p) => ({
      ...p,
      learned: success ? [...new Set([...p.learned, term.id])] : p.learned,
      mistakes: {
        ...p.mistakes,
        [term.id]: { value: !success, at: Date.now() },
      },
    }));
  }
  async function check() {
    if (choice === null || checked || busy) return;
    setBusy(true);
    const success = choice === term.question.answer;
    setChecked(true);
    markAnswer(success);
    if (!success) {
      setMissed((previous) => [...new Set([...previous, term.id])]);
      if (!test) setQueue((previous) => [...previous, queue[position]]);
    }
    if (user) {
      try {
        const response = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ termId: term.id, option: choice }),
        });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (result.awarded) setNotice("+10 leaderboard points");
        else setNotice("");
      } catch {
        setNotice(
          "Personal progress saved. Leaderboard points could not be recorded. Revisit this question when connected.",
        );
      }
    }
    setBusy(false);
  }
  function next() {
    setChoice(null);
    setChecked(false);
    setNotice("");
    if (stage === "study") {
      if (position < terms.length - 1) setPosition(position + 1);
      else {
        setStage("quiz");
        setPosition(0);
      }
    } else if (position < queue.length - 1) setPosition(position + 1);
    else {
      if (!test || missed.length === 0)
        update((p) => ({
          ...p,
          completed: [...new Set([...p.completed, id])],
        }));
      setStage("done");
    }
  }
  if (!ready)
    return (
      <div className="lesson-shell lesson-loading">
        <p role="status">Finding your place…</p>
      </div>
    );
  if (locked)
    return (
      <div className="lesson-shell">
        <div className="empty-state">
          <Logo />
          <h1>One step at a time.</h1>
          <p>
            Complete lesson {lesson - 1} first, or test your knowledge to skip
            ahead.
          </p>
          <div className="button-row">
            <Link className="button primary" href={`/packs/${packId}`}>
              See your lesson path <Arrow />
            </Link>
            <Link className="button" href={`/learn/${id}?mode=test`}>
              Test out of this lesson
            </Link>
          </div>
        </div>
      </div>
    );
  if (stage === "done") {
    const passed = !test || missed.length === 0;
    return (
      <div className="lesson-shell">
        <section className="lesson-result">
          <div className={`result-symbol ${passed ? "" : "retry"}`}>
            {passed ? <Check /> : <Logo />}
          </div>
          <span className="section-label">
            {test ? "KNOWLEDGE CHECK" : "LESSON COMPLETE"}
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {passed
              ? "That’s four more things you get."
              : "A few things to come back to."}
          </h1>
          <p>
            {passed
              ? `${title}: complete. You’re building a vocabulary you can actually use.`
              : `You got ${terms.length - missed.length} of ${terms.length} right. Get all four right to test out. Your other progress is safe.`}
          </p>
          {missed.length > 0 && (
            <div className="result-review">
              <h2>{passed ? "Worth another look" : "Revisit these terms"}</h2>
              {terms
                .filter((t) => missed.includes(t.id))
                .map((t) => (
                  <Link key={t.id} href={`/terms/${t.id}`}>
                    {t.name} ↗
                  </Link>
                ))}
            </div>
          )}
          <div className="button-row">
            {passed && lesson < 5 ? (
              <Link
                href={`/learn/${packId}/${lesson + 1}`}
                className="button primary"
              >
                Next lesson <Arrow />
              </Link>
            ) : (
              <Link href={`/packs/${packId}`} className="button primary">
                Back to your pack <Arrow />
              </Link>
            )}
            <Link href="/progress" className="button">
              See my progress
            </Link>
          </div>
          <p className="small muted">
            {authEnabled && !user
              ? `${sync}. Sign in with GitHub to keep it across devices.`
              : sync}
          </p>
        </section>
      </div>
    );
  }
  const total = terms.length + (test ? 0 : terms.length);
  const step =
    (stage === "quiz" && !test ? terms.length : 0) +
    Math.min(position + 1, terms.length);
  return (
    <div className="lesson-shell">
      <div className="lesson-top">
        <Link href={`/packs/${packId}`} className="back-link">
          ← {packTitle}
        </Link>
        <span>
          Lesson {lesson} of 5{test ? " · Test out" : ""}
        </span>
      </div>
      <div className="lesson-progress">
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={step}
        >
          <span style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span>
          {stage === "study" ? "Discover" : "Put it to use"} ·{" "}
          {Math.min(position + 1, terms.length)} / {terms.length}
          {position >= terms.length ? " · Another try" : ""}
        </span>
      </div>
      <section
        className={`lesson-card ${stage === "study" ? "study-card" : "question-card"}`}
      >
        <div className="lesson-card-top">
          <span>{title}</span>
          <button
            className="save-word"
            onClick={() =>
              update((p) => ({
                ...p,
                bookmarks: {
                  ...p.bookmarks,
                  [term.id]: {
                    value: !p.bookmarks[term.id]?.value,
                    at: Date.now(),
                  },
                },
              }))
            }
            aria-pressed={Boolean(progress.bookmarks[term.id]?.value)}
          >
            {progress.bookmarks[term.id]?.value ? "✓ Saved" : "+ Save term"}
          </button>
        </div>
        {stage === "study" ? (
          <>
            <span className="section-label">MEET THE WORD</span>
            <h1 ref={heading} tabIndex={-1}>
              {term.name}
            </h1>
            <p className="term-summary">{term.summary}</p>
            <p>{term.explanation}</p>
            <div className="example-block">
              <span>IN PRACTICE</span>
              <p>{term.example}</p>
            </div>
            <details className="misconception">
              <summary>A common mix-up</summary>
              <p>{term.misconception}</p>
            </details>
            <div className="lesson-bottom">
              <a
                href={term.source}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                Read the source ↗
              </a>
              <button className="button primary" onClick={next}>
                {position < terms.length - 1
                  ? "Got it. Next word"
                  : "Let’s try them out"}
                <Arrow />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="section-label">{term.name.toUpperCase()}</span>
            <h1 className="question-title" ref={heading} tabIndex={-1}>
              {term.question.prompt}
            </h1>
            <div
              className="answer-options"
              role="group"
              aria-label="Choose your answer"
            >
              {term.question.options.map((option, i) => (
                <button
                  key={option}
                  disabled={checked}
                  aria-pressed={choice === i}
                  onClick={() => setChoice(i)}
                  className={`${choice === i ? "chosen " : ""}${checked && i === term.question.answer ? "correct " : ""}${checked && choice === i && !correct ? "incorrect" : ""}`}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                  {checked && i === term.question.answer && <Check />}
                </button>
              ))}
            </div>
            <div className="answer-feedback" aria-live="polite">
              {checked && (
                <>
                  <strong>
                    {correct ? "You’ve got it." : "Not quite. Here’s why."}
                  </strong>
                  <p>{term.question.explanation}</p>
                  {!correct && !test && (
                    <p className="small">
                      We’ll bring this one back for another try.
                    </p>
                  )}
                  {notice && <p className="small">{notice}</p>}
                </>
              )}
            </div>
            <div className="lesson-bottom">
              <span className="small muted">
                {checked ? "Understanding beats guessing." : "Take your time."}
              </span>
              {checked ? (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={next}
                >
                  {busy
                    ? "Saving…"
                    : position === queue.length - 1
                      ? "Finish lesson"
                      : "Continue"}
                  <Arrow />
                </button>
              ) : (
                <button
                  className="button primary"
                  disabled={choice === null}
                  onClick={() => void check()}
                >
                  Check answer <Arrow />
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
