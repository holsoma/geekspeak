import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import logo from "../src/data/logo.json" with { type: "json" };
const mark = `<path fill="#173548" d="${logo.head}"/><path d="${logo.waves}" fill="none" stroke="#173548" stroke-width="5" stroke-linecap="round"/>`;
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="-10 -18 128 128"><rect x="-10" y="-18" width="128" height="128" rx="28" fill="#ee855b"/>${mark}</svg>\n`);
const githubSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="-10 -18 128 128" role="img" aria-labelledby="title"><title id="title">GeekSpeak application icon</title>${mark}</svg>\n`;
await mkdir("public/brand", { recursive: true });
await writeFile("src/app/icon.svg", svg);
await writeFile("public/brand/geekspeak-github-icon.svg", githubSvg);
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
await sharp(Buffer.from(githubSvg))
  .resize(512, 512)
  .png()
  .toFile("public/brand/geekspeak-github-icon.png");
console.log("Generated centred icons from the shared logo geometry.");
