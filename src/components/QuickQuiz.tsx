"use client";
import Link from "next/link";
import { useState } from "react";
import { Arrow, Check } from "./Icons";
export function QuickQuiz() {
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <section className="quick-section">
      <div className="quick-intro" data-enter>
        <span className="section-label">SMALL LESSON. REAL UNDERSTANDING.</span>
        <h2>
          Knowing the word
          <br />
          is only the start.
        </h2>
        <p>
          Put it in context. Pick an answer. Get an explanation that actually
          explains.
        </p>
        <span className="hand-note">
          Give this one a go <Arrow />
        </span>
      </div>
      <div className="quick-quiz">
        <div className="quiz-meta">
          <span>THE 30-SECOND TRYOUT</span>
          <span>System design</span>
        </div>
        <h3>
          You press “save” twice.
          <br />
          Only one copy appears.
          <br />
          What is the operation?
        </h3>
        <div className="demo-options">
          {["Asynchronous", "Idempotent", "Recursive"].map((option, i) => (
            <button
              key={option}
              onClick={() => setAnswer(i)}
              aria-pressed={answer === i}
              className={
                answer === i ? (i === 1 ? "correct" : "incorrect") : ""
              }
            >
              <span className="option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {answer === i && i === 1 && <Check />}
            </button>
          ))}
        </div>
        <div className="demo-feedback" aria-live="polite">
          {answer === null ? (
            <p>No timer. No pressure. Just try it.</p>
          ) : (
            <>
              <strong>
                {answer === 1
                  ? "You’ve got it."
                  : "Not quite. The answer is idempotent."}
              </strong>
              <p>
                Repeating an idempotent operation has the same effect as doing
                it once.
              </p>
              <Link href="/packs/system-design">
                Explore system design <Arrow />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
