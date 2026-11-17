import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyProgress,
  mergeProgress,
  readProgress,
  activeMarks,
} from "../src/lib/progress";
test("merging device progress keeps completed learning and does not duplicate it", () => {
  const a = {
    ...emptyProgress(),
    learned: ["token"],
    completed: ["llm-basics/1"],
  };
  const b = {
    ...emptyProgress(),
    learned: ["token", "context-window"],
    completed: ["llm-basics/1", "llm-basics/2"],
  };
  const merged = mergeProgress(a, b);
  assert.deepEqual(merged.learned, ["token", "context-window"]);
  assert.equal(merged.completed.length, 2);
  assert.deepEqual(a.learned, ["token"]);
});
test("newer removal wins over an older saved bookmark during sync", () => {
  const a = {
    ...emptyProgress(),
    bookmarks: { token: { value: true, at: 20 } },
  };
  const b = {
    ...emptyProgress(),
    bookmarks: { token: { value: false, at: 30 } },
  };
  assert.deepEqual(activeMarks(mergeProgress(a, b).bookmarks), []);
  assert.deepEqual(activeMarks(mergeProgress(b, a).bookmarks), []);
});
test("review marks can be cleared after a successful retry", () => {
  const a = {
    ...emptyProgress(),
    mistakes: { token: { value: true, at: 20 } },
  };
  const b = {
    ...emptyProgress(),
    mistakes: { token: { value: false, at: 30 } },
  };
  assert.deepEqual(activeMarks(mergeProgress(a, b).mistakes), []);
});
test("damaged storage is handled and future timestamps cannot dominate forever", () => {
  assert.deepEqual(readProgress(null), emptyProgress());
  const value = readProgress({
    learned: ["a", "a", null, 3],
    completed: "broken",
    bookmarks: {
      a: { value: true, at: Date.now() + 1e12 },
      b: { value: "bad", at: 3 },
    },
  });
  assert.deepEqual(value.learned, ["a"]);
  assert.deepEqual(value.completed, []);
  assert.ok(value.bookmarks.a.at <= Date.now());
  assert.equal(value.bookmarks.b, undefined);
});
