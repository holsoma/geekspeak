"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>That didn’t quite work.</h1>
      <p>
        The page could not load. Your saved learning progress is still on this
        device.
      </p>
      <div className="button-row">
        <button className="button primary" onClick={reset}>
          Try again
        </button>
        <Link className="button" href="/packs">
          Back to packs
        </Link>
      </div>
    </div>
  );
}
