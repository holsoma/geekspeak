export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:4400")
).replace(/\/$/, "");
export const description =
  "Get the tech talk. Learn useful AI, coding and cloud terms in short, hands-on packs. Free, open source and without streaks.";
export const githubUrl = "https://github.com/holsoma/geekspeak";
