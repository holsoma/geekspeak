// Build a clearly labelled guest preview without changing the full application.
import { cp, mkdir, writeFile, rm, realpath } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root = process.cwd();
const stage = path.resolve(".jury/guest-build");
const preview = path.resolve(".sites-preview");
const origin = new URL(process.argv[2] || "http://localhost:4402").origin;
await mkdir(stage, { recursive: true });
await mkdir(preview, { recursive: true });
async function removeGenerated(target, boundary) {
  const resolved = await realpath(target).catch(() => path.resolve(target));
  const parent = await realpath(boundary);
  if (!resolved.startsWith(parent + path.sep) || resolved === parent)
    throw new Error(
      "Refusing to remove a path outside the generated workspace.",
    );
  await rm(target, { recursive: true, force: true });
}
for (const name of ["src", "public"])
  await removeGenerated(path.join(stage, name), stage);
for (const name of [
  "src",
  "public",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
])
  await cp(path.join(root, name), path.join(stage, name), { recursive: true });
await removeGenerated(path.join(stage, "src/app/api"), stage);
// Server Actions cannot be part of a static export, even behind a disabled branch.
await writeFile(
  path.join(stage, "src/app/sign-in/page.tsx"),
  `import { GuestAccount } from '@/components/GuestAccount';\nexport const metadata = {title: 'Guest progress', description: 'Learn every Geekspeak pack as a guest. This browser keeps your progress.'};\nexport default GuestAccount;\n`,
);
await writeFile(
  path.join(stage, "next.config.ts"),
  `export default ${JSON.stringify({ output: "export", trailingSlash: true, images: { unoptimized: true }, turbopack: { root } })};\n`,
);
const env = {
  ...process.env,
  NEXT_PUBLIC_GUEST_ONLY: "true",
  NEXT_PUBLIC_SITE_URL: origin,
};
for (const name of [
  "AUTH_SECRET",
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
  "AUTH_URL",
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
])
  delete env[name];
const result = spawnSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build"],
  { cwd: stage, env, stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status || 1);
const output = path.join(preview, "dist");
await removeGenerated(output, preview);
await cp(path.join(stage, "out"), output, { recursive: true });
await writeFile(
  path.join(preview, "README.md"),
  "# Geekspeak guest preview\n\nGenerated from the full application at https://github.com/holsoma/geekspeak.\n\nThis preview stores progress on the device. GitHub sign-in, cloud saving and public scores require the full server application and configured services.\n",
);
console.log(
  `Guest preview built for ${origin}. Account services are intentionally unavailable.`,
);
