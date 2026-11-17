"use client";
import { useProgress } from "./ProgressProvider";
export function SaveTerm({ id }: { id: string }) {
  const { progress, update } = useProgress();
  const saved = Boolean(progress.bookmarks[id]?.value);
  return (
    <button
      className="button"
      aria-pressed={saved}
      onClick={() =>
        update((p) => ({
          ...p,
          bookmarks: {
            ...p.bookmarks,
            [id]: { value: !saved, at: Date.now() },
          },
        }))
      }
    >
      {saved ? "✓ Saved to your wordbook" : "+ Save to your wordbook"}
    </button>
  );
}
