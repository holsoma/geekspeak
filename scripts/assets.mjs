import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const svg = await readFile("src/app/icon.svg");
await mkdir("public", { recursive: true });
await sharp(svg).resize(180, 180).png().toFile("src/app/apple-icon.png");
const png = await sharp(svg).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile("src/app/favicon.ico", Buffer.concat([header, png]));
await sharp(await readFile("public/brand/geekspeak-github-icon.svg"))
  .resize(512, 512)
  .png()
  .toFile("public/brand/geekspeak-github-icon.png");
console.log("Generated the favicon, Apple icon and GitHub application icon from SVG sources.");
