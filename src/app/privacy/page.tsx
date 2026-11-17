import type { Metadata } from "next";
import { githubUrl } from "@/lib/site";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Geekspeak stores when you learn as a guest, sign in with GitHub or choose to join the leaderboard.",
};
export default function Privacy() {
  return (
    <article className="prose-page">
      <span className="section-label">YOUR DATA, EXPLAINED</span>
      <h1>Privacy without the small print.</h1>
      <p className="lead">
        Geekspeak stores the information needed to remember what you have
        learned. It has no advertising or behavioural analytics.
      </p>
      <h2>Learning as a guest</h2>
      <p>
        Your learned terms, completed lessons, saved words and review list are
        stored in this browser. Clearing this site’s browser data removes them.
        Guest progress is not published on the leaderboard.
      </p>
      <h2>Signing in with GitHub</h2>
      <p>
        If account saving is enabled, we use GitHub sign-in to identify you by
        your GitHub ID and username. We request profile access, not repository
        access. A secure session cookie keeps you signed in. Your progress is
        stored in the project’s database and cached on your device so it can
        retry failed saves.
      </p>
      <p>
        Guest progress is imported only when you choose Import guest progress.
        Each signed-in account has its own device cache. Signing out does not
        erase that account’s saved data from this browser. On a shared device,
        clear site data after signing out.
      </p>
      <h2>The leaderboard</h2>
      <p>
        You appear only if you choose to join. Your GitHub username, the number
        of distinct terms answered correctly while signed in and the resulting
        points are public. You can leave from My progress. Leaving hides your
        entry without deleting your learning progress.
      </p>
      <h2>Hosting and external links</h2>
      <p>
        The hosting and database providers process network requests needed to
        operate the service. Their operational logs may include connection
        information. Links to source documentation and GitHub take you to sites
        with their own privacy policies.
      </p>
      <h2>Questions or removal requests</h2>
      <p>
        Contact the maintainer through the{" "}
        <a href={githubUrl}>GitHub project</a>. Do not include private
        information or credentials in a public issue. You can remove guest data
        at any time by clearing this site’s browser storage.
      </p>
    </article>
  );
}
