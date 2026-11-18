export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:4400")
).replace(/\/$/, "");
export const description =
  "Understand everyday tech jargon, from AI to coding and cloud computing, through short lessons, clear examples and quizzes. Free, open source and without streaks.";
export const githubUrl = "https://github.com/holsoma/geekspeak";
