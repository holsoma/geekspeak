export type Mark = { value: boolean; at: number };
export type Progress = {
  version: 1;
  learned: string[];
  completed: string[];
  bookmarks: Record<string, Mark>;
  mistakes: Record<string, Mark>;
  lastLesson: string | null;
};
export const emptyProgress = (): Progress => ({
  version: 1,
  learned: [],
  completed: [],
  bookmarks: {},
  mistakes: {},
  lastLesson: null,
});
export function mergeProgress(a: Progress, b: Progress): Progress {
  const marks = (x: Record<string, Mark>, y: Record<string, Mark>) => {
    const merged = { ...x };
    for (const [id, mark] of Object.entries(y))
      if (!merged[id] || mark.at >= merged[id].at) merged[id] = mark;
    return merged;
  };
  return {
    version: 1,
    learned: [...new Set([...a.learned, ...b.learned])],
    completed: [...new Set([...a.completed, ...b.completed])],
    bookmarks: marks(a.bookmarks, b.bookmarks),
    mistakes: marks(a.mistakes, b.mistakes),
    lastLesson: b.lastLesson || a.lastLesson,
  };
}
export const activeMarks = (marks: Record<string, Mark>) =>
  Object.entries(marks)
    .filter(([, m]) => m.value)
    .map(([id]) => id);
export function readProgress(value: unknown): Progress {
  if (!value || typeof value !== "object") return emptyProgress();
  const p = value as Partial<Progress>;
  const strings = (v: unknown) =>
    Array.isArray(v)
      ? [
          ...new Set(
            v.filter(
              (x): x is string => typeof x === "string" && x.length < 100,
            ),
          ),
        ].slice(0, 1000)
      : [];
  const marks = (v: unknown) => {
    const out: Record<string, Mark> = {};
    if (v && typeof v === "object")
      for (const [k, m] of Object.entries(v).slice(0, 1000)) {
        if (
          k === "__proto__" ||
          k === "constructor" ||
          k === "prototype" ||
          k.length > 100
        )
          continue;
        if (
          m &&
          typeof m === "object" &&
          typeof m.value === "boolean" &&
          Number.isFinite(m.at)
        )
          out[k] = { value: m.value, at: Math.min(m.at, Date.now()) };
      }
    return out;
  };
  return {
    version: 1,
    learned: strings(p.learned),
    completed: strings(p.completed),
    bookmarks: marks(p.bookmarks),
    mistakes: marks(p.mistakes),
    lastLesson:
      typeof p.lastLesson === "string" ? p.lastLesson.slice(0, 200) : null,
  };
}
