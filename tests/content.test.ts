import test from "node:test";
import assert from "node:assert/strict";
import { packs, terms } from "../src/data/packs";
test("all ten packs have five complete lessons with four unique terms", () => {
  assert.equal(packs.length, 10);
  assert.equal(terms.length, 200);
  assert.equal(new Set(terms.map((t) => t.id)).size, 200);
  for (const pack of packs) {
    assert.equal(pack.lessons.length, 5, pack.id);
    assert.equal(pack.terms.length, 20, pack.id);
    for (const term of pack.terms) {
      assert.match(term.id, /^[a-z0-9-]+$/);
      for (const field of [
        "name",
        "summary",
        "explanation",
        "example",
        "misconception",
        "source",
      ] as const)
        assert.ok(term[field].trim(), `${term.id}.${field}`);
      assert.match(term.source, /^https:\/\//);
      assert.equal(term.question.options.length, 4);
      assert.equal(new Set(term.question.options).size, 4, term.id);
      assert.ok(
        Number.isInteger(term.question.answer) &&
          term.question.answer >= 0 &&
          term.question.answer < 4,
        term.id,
      );
      assert.ok(term.question.prompt && term.question.explanation, term.id);
      assert.ok(!JSON.stringify(term).includes("\u2014"), term.id);
    }
  }
});
test("the requested everyday terms are present", () => {
  for (const name of [
    "terraform",
    "apache spark",
    "coroutine",
    "acid",
    "idempotency",
  ])
    assert.ok(
      terms.some(
        (t) =>
          t.name.toLowerCase() === name ||
          t.aliases.some((a) => a.toLowerCase() === name),
      ),
      name,
    );
});
