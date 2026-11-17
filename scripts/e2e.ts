import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { packs } from "../src/data/packs";
const url = process.env.TEST_URL || "http://127.0.0.1:4400";
const guestOnly = process.env.TEST_GUEST_ONLY === "1";
async function run() {
  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    browser = await chromium.launch({ channel: "msedge" });
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const out = process.env.TEST_OUTPUT || ".jury/flows";
  await mkdir(out, { recursive: true });
  const shot = async (name: string) => {
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  };
  const visible = async (text: string) => {
    await page
      .getByText(text, { exact: false })
      .first()
      .waitFor({ state: "visible" });
  };
  try {
    await page.goto(url);
    await page.getByRole("button", { name: "What does that mean?" }).click();
    await visible("Same request. Same effect.");
    await shot("desktop-home");
    await page.getByRole("button", { name: "Show another term" }).click();
    await visible("We’re running out of tokens.");
    await page.goto(`${url}/wordbook`);
    await page.getByRole("searchbox").fill("coroutine");
    await visible("1 term for");
    assert.equal(await page.locator(".word-row").count(), 1);
    await page.locator(".word-row").click();
    await page.getByRole("button", { name: "+ Save to your wordbook" }).click();
    await visible("Saved to your wordbook");
    await shot("term-detail");
    await page.goto(`${url}/terms/idempotency`);
    for (let press = 0; press < 3; press++) {
      await page.getByRole("button", { name: "Set to 5", exact: true }).click();
      await page.getByRole("button", { name: "Add 5", exact: true }).click();
    }
    await page.waitForFunction(
      () =>
        document.querySelector('output[aria-label="Add counter value"]')
          ?.textContent === "15",
    );
    assert.equal(
      await page.getByLabel("Set counter value", { exact: true }).textContent(),
      "5",
    );
    assert.equal(
      await page.getByLabel("Add counter value", { exact: true }).textContent(),
      "15",
    );
    await shot("idempotency-example");
    await page.goto(`${url}/wordbook`);
    await page
      .getByRole("button", { name: "Saved terms", exact: true })
      .click();
    assert.equal(await page.locator(".word-row").count(), 1);
    await page.getByRole("searchbox").fill("no-such-term-zz");
    await visible("Your collection starts here.");
    await page.getByRole("button", { name: "Show all terms" }).click();
    assert.equal(await page.locator(".word-row").count(), 24);
    await visible("200 terms");
    await page.getByRole("button", { name: "Next page", exact: true }).click();
    await visible("Page 2 of 9");
    await page.goto(`${url}/packs`);
    await page
      .getByRole("button", { name: "AI & machine learning", exact: true })
      .click();
    assert.equal(await page.locator(".pack-card").count(), 6);
    await shot("packs");
    const pack = packs[0];
    const lessonTerms = pack.terms.slice(0, 4);
    await page.goto(`${url}/learn/${pack.id}/2`);
    await visible("One step at a time.");
    await page.goto(`${url}/learn/${pack.id}/1`);
    await visible(lessonTerms[0].name);
    await shot("lesson-study");
    for (let i = 0; i < 4; i++)
      await page
        .getByRole("button", {
          name: i < 3 ? "Got it. Next word" : "Let’s try them out",
          exact: true,
        })
        .click();
    await shot("lesson-question");
    // Make a mistake and check that the term is presented again before completion.
    await page
      .locator(".answer-options button")
      .nth((lessonTerms[0].question.answer + 1) % 4)
      .click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await visible("Not quite. Here’s why.");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    for (let i = 1; i < 4; i++) {
      await page
        .locator(".answer-options button")
        .nth(lessonTerms[i].question.answer)
        .click();
      await page
        .getByRole("button", { name: "Check answer", exact: true })
        .click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await page
      .locator(".answer-options button")
      .nth(lessonTerms[0].question.answer)
      .click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Finish lesson", exact: true })
      .click();
    await visible("That’s four more things you get.");
    await shot("lesson-complete");
    await page.reload();
    await page.goto(`${url}/progress`);
    await visible("Saved on this device");
    const storage = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("geekspeak:guest:v1") || "{}"),
    );
    assert.equal(storage.learned.length, 4);
    assert.ok(storage.completed.includes(`${pack.id}/1`));
    assert.equal(
      Object.values(storage.mistakes).filter((m: any) => m.value).length,
      0,
    );
    await shot("progress");
    // A failed test-out must not unlock or complete the lesson.
    await page.goto(`${url}/learn/${pack.id}/3?mode=test`);
    for (const term of pack.terms.slice(8, 12)) {
      await page
        .locator(".answer-options button")
        .nth((term.question.answer + 1) % 4)
        .click();
      await page
        .getByRole("button", { name: "Check answer", exact: true })
        .click();
      await page
        .getByRole("button", { name: /Continue|Finish lesson/, exact: true })
        .click();
    }
    await visible("A few things to come back to.");
    const afterFail = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("geekspeak:guest:v1") || "{}"),
    );
    assert.ok(!afterFail.completed.includes(`${pack.id}/3`));
    // A successful test-out works even when the previous lesson is unfinished.
    await page.goto(`${url}/learn/${pack.id}/3?mode=test`);
    for (const term of pack.terms.slice(8, 12)) {
      await page
        .locator(".answer-options button")
        .nth(term.question.answer)
        .click();
      await page
        .getByRole("button", { name: "Check answer", exact: true })
        .click();
      await page
        .getByRole("button", { name: /Continue|Finish lesson/, exact: true })
        .click();
    }
    await visible("That’s four more things you get.");
    await page.goto(`${url}/leaderboard`);
    await page
      .getByRole("heading", { name: /A little company|There’s room/ })
      .waitFor();
    await shot("leaderboard");
    if (!guestOnly) {
      const unauthorised = await context.request.post(`${url}/api/progress`, {
        headers: { Origin: url },
        data: {},
      });
      assert.equal(unauthorised.status(), 401);
      const foreign = await context.request.post(`${url}/api/answer`, {
        headers: { Origin: "https://example.org" },
        data: { termId: "token", option: 0 },
      });
      assert.equal(foreign.status(), 403);
    }
    const missing = await page.goto(`${url}/not-a-real-page`);
    assert.equal(missing?.status(), 404);
    await shot("404");
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const phone = await mobile.newPage();
    await phone.goto(url);
    await phone.getByRole("button", { name: "Menu", exact: true }).click();
    await phone.getByRole("link", { name: "Packs", exact: true }).click();
    await phone
      .getByRole("heading", { name: "Good things come in packs." })
      .waitFor();
    const metadataEvidence = [];
    for (const path of [
      "/",
      "/packs",
      "/packs/llm-basics",
      "/wordbook",
      "/terms/idempotency",
      "/learn/llm-basics/1",
      "/progress",
      "/leaderboard",
      "/sign-in",
    ]) {
      await phone.goto(`${url}${path}`);
      await phone.locator("h1").waitFor();
      const overflow = await phone.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `Mobile overflow at ${path}`);
      await phone.screenshot({
        path: `${out}/mobile-${path === "/" ? "home" : path.replaceAll("/", "-").slice(1)}.png`,
        fullPage: true,
      });
      const metadata = await phone.evaluate(() => ({
        title: document.title,
        lang: document.documentElement.lang,
        description: document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content"),
        canonical: document
          .querySelector('link[rel="canonical"]')
          ?.getAttribute("href"),
        ogImage: document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content"),
      }));
      assert.ok(
        metadata.title &&
          metadata.description &&
          metadata.canonical &&
          metadata.ogImage,
        `Metadata missing at ${path}`,
      );
      const imageUrl = new URL(metadata.ogImage!);
      const og = await mobile.request.get(
        `${url}${imageUrl.pathname}${imageUrl.search}`,
      );
      assert.equal(og.status(), 200);
      assert.equal(
        (await og.body()).subarray(0, 8).toString("hex"),
        "89504e470d0a1a0a",
      );
      metadataEvidence.push({
        path,
        ...metadata,
        ogImageStatus: og.status(),
        ogImageType: og.headers()["content-type"],
      });
    }
    await phone.goto(`${url}/packs/llm-basics`);
    const start = await phone
      .getByRole("link", { name: "Start with lesson one", exact: true })
      .boundingBox();
    assert.ok(
      start && start.y + start.height < 844,
      "The first lesson action should fit in the phone viewport",
    );
    await writeFile(
      `${out}/metadata.json`,
      JSON.stringify(metadataEvidence, null, 2),
    );
    assert.deepEqual(errors, []);
    await writeFile(
      `${out}/results.json`,
      JSON.stringify(
        {
          passed: true,
          edition: guestOnly
            ? "static guest preview"
            : "full Next.js application",
          checks: [
            "hero definition reveal",
            "interactive idempotency example",
            "word search and bookmark",
            "empty search",
            "pack filters",
            "sequential lesson lock",
            "incorrect answer retry",
            "lesson completion",
            "progress survives reload",
            "failed and passed test-out",
            ...(!guestOnly
              ? ["guest API ownership", "cross-origin rejection"]
              : []),
            "real 404",
            "mobile navigation",
            "mobile overflow",
            "metadata and Open Graph images",
            "first lesson action in phone viewport",
          ],
          errors,
        },
        null,
        2,
      ),
    );
    console.log("All guest learning and responsive checks passed.");
  } finally {
    await browser.close();
  }
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
