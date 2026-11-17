"use client";
import {
  useEffect,
  useRef,
  useState,
  ViewTransition,
  startTransition,
} from "react";
import { Arrow, Logo } from "./Icons";
const examples = [
  {
    term: "idempotency",
    line: "“Make sure the endpoint is idempotent.”",
    meaning: "Same request. Same effect.",
    example:
      "Pressing “set volume to 50%” twice still leaves it at 50%. Pressing “turn it up” twice does not.",
    pack: "System design",
  },
  {
    term: "tokens",
    line: "“We’re running out of tokens.”",
    meaning: "The pieces a language model reads.",
    example:
      "A token can be a word, part of a word or punctuation. Models have limits on how many they can handle at once.",
    pack: "LLM basics",
  },
  {
    term: "Terraform",
    line: "“Just put it in Terraform.”",
    meaning: "Describe your infrastructure in files.",
    example:
      "Instead of clicking through a cloud dashboard, write down the servers you need. Terraform plans and applies the changes.",
    pack: "AWS & cloud",
  },
];
export function HeroDeck() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const item = examples[index];
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const tween = gsap.to(".hero-orbit", {
          rotation: 4,
          y: -6,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        let visible = true;
        const pause = () => {
          tween.pause();
        };
        const resume = () => {
          if (
            visible &&
            !root.current?.matches(":hover") &&
            !root.current?.contains(document.activeElement)
          )
            tween.play();
        };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          visible ? resume() : pause();
        });
        const element = root.current;
        if (element) {
          observer.observe(element);
          element.addEventListener("pointerenter", pause);
          element.addEventListener("pointerleave", resume);
          element.addEventListener("focusin", pause);
          element.addEventListener("focusout", resume);
        }
        cleanup = () => {
          if (element) {
            element.removeEventListener("pointerenter", pause);
            element.removeEventListener("pointerleave", resume);
            element.removeEventListener("focusin", pause);
            element.removeEventListener("focusout", resume);
          }
          observer.disconnect();
          ctx.revert();
        };
      }, root);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
  return (
    <div className="hero-deck" ref={root}>
      <div className="deck-disc" aria-hidden="true">
        <Logo />
      </div>
      <div className="deck-shadow-card back-two" aria-hidden="true" />
      <div className="deck-shadow-card back-one" aria-hidden="true" />
      <div className="hero-orbit">
        <div className={`conversation-card ${revealed ? "is-revealed" : ""}`}>
          <div className="card-topline">
            <span>{revealed ? "IN PLAIN ENGLISH" : "SOUND FAMILIAR?"}</span>
            <span>0{index + 1} / 03</span>
          </div>
          <ViewTransition name="translation" update="word-slide" default="none">
            <div className="card-copy" aria-live="polite">
              {revealed ? (
                <>
                  <span className="term-small">{item.term}</span>
                  <h2>{item.meaning}</h2>
                  <p>{item.example}</p>
                </>
              ) : (
                <>
                  <p className="conversation-quote">{item.line}</p>
                  <div className="term-graphic" aria-hidden="true">
                    {index === 0 ? "↻" : index === 1 ? "[to][ken]" : "{ }"}
                  </div>
                  <span className="card-pack">{item.pack}</span>
                </>
              )}
            </div>
          </ViewTransition>
          <button
            className="card-reveal"
            onClick={() => startTransition(() => setRevealed(!revealed))}
          >
            <span>
              {revealed ? "Back to the conversation" : "What does that mean?"}
            </span>
            <Arrow />
          </button>
        </div>
      </div>
      <div className="deck-controls">
        <span>Try a little tech translation.</span>
        <button
          onClick={() => {
            setIndex((index + 1) % examples.length);
            setRevealed(false);
          }}
          aria-label="Show another term"
        >
          <Arrow />
        </button>
      </div>
      <span className="hero-note" aria-hidden="true">
        Oh. Now I get it.
      </span>
    </div>
  );
}
