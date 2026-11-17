"use client";
import { startTransition, useState, ViewTransition } from "react";
import { Arrow } from "./Icons";
export function IdempotencyDemo() {
  const [fixed, setFixed] = useState(0);
  const [added, setAdded] = useState(0);
  const [fixedPresses, setFixedPresses] = useState(0);
  const [addPresses, setAddPresses] = useState(0);
  return (
    <section className="idempotency-demo">
      <span className="section-label">TRY IT, THEN SAY IT</span>
      <h2>
        Same action.
        <br />A different kind of repeat.
      </h2>
      <p>
        Press each button a few times. Watch what happens to the two counters.
      </p>
      <div className="counter-examples">
        <div>
          <span>SET A VALUE</span>
          <ViewTransition update="word-slide" default="none">
            <output aria-live="polite" aria-label="Set counter value">
              {fixed}
            </output>
          </ViewTransition>
          <button
            className="button"
            onClick={() =>
              startTransition(() => {
                setFixed(5);
                setFixedPresses((n) => n + 1);
              })
            }
          >
            Set to 5 <Arrow />
          </button>
          <p>
            {fixedPresses === 0
              ? "Ready when you are."
              : fixedPresses === 1
                ? "One request. The value is 5."
                : `${fixedPresses} requests. Still 5.`}
          </p>
          <strong>Idempotent</strong>
        </div>
        <div>
          <span>ADD TO A VALUE</span>
          <ViewTransition update="word-slide" default="none">
            <output aria-live="polite" aria-label="Add counter value">
              {added}
            </output>
          </ViewTransition>
          <button
            className="button"
            onClick={() =>
              startTransition(() => {
                setAdded((n) => n + 5);
                setAddPresses((n) => n + 1);
              })
            }
          >
            Add 5 <Arrow />
          </button>
          <p>
            {addPresses === 0
              ? "Ready when you are."
              : `${addPresses} ${addPresses === 1 ? "request" : "requests"}. The value is ${added}.`}
          </p>
          <strong>Not idempotent</strong>
        </div>
      </div>
      <div className="demo-conclusion">
        <p>
          Setting a value again has the same effect. Adding to it again changes
          it. That’s the distinction.
        </p>
        <button
          className="text-link"
          onClick={() => {
            setFixed(0);
            setAdded(0);
            setFixedPresses(0);
            setAddPresses(0);
          }}
        >
          Reset counters
        </button>
      </div>
    </section>
  );
}
