import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const output = ".jury/supplemental";
await mkdir(output, { recursive: true });
await mkdir("docs/screenshots", { recursive: true });
let browser;
try {
  browser = await chromium.launch();
} catch {
  browser = await chromium.launch({ channel: "msedge" });
}
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const evidence = [];
try {
  for (const target of [
    { path: "/", selector: ".hero-deck button", name: "translation" },
    { path: "/", selector: ".hero-copy .button", name: "start" },
    { path: "/packs", selector: ".pack-card", name: "pack" },
    { path: "/wordbook", selector: ".word-row", name: "term" },
    { path: "/learn/llm-basics/1", selector: ".save-word", name: "save-term" },
  ]) {
    await page.goto("http://127.0.0.1:4400" + target.path);
    await page.waitForTimeout(2000);
    const element = page.locator(target.selector).first();
    if (!(await element.count())) {
      evidence.push({ ...target, missing: true });
      continue;
    }
    await page.addStyleTag({
      content: "html { scroll-behavior: auto !important; }",
    });
    await element.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await page.mouse.move(4, 4);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${output}/${target.name}-rest.png` });
    await element.hover({ force: true });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${output}/${target.name}-hover.png` });
    evidence.push({ ...target, box: await element.boundingBox() });
  }
  await page.goto("http://127.0.0.1:4400");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "docs/screenshots/home.png" });
  for (const [from, to] of [
    ["lesson-study", "lesson"],
    ["progress", "progress"],
  ]) {
    await sharp(`${process.env.TEST_OUTPUT || ".jury/flows"}/${from}.png`)
      .resize({ width: 1440 })
      .toFile(`docs/screenshots/${to}.png`);
  }
  await writeFile(`${output}/evidence.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence));
} finally {
  await browser.close();
}
