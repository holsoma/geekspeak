import type { Metadata } from "next";
import { Leaderboard } from "@/components/Leaderboard";
export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "A little friendly company for your learning. See opt-in learners ranked by the unique terms they have answered correctly.",
};
export default function LeaderboardPage() {
  return (
    <div className="page-wrap">
      <div className="page-heading" data-enter>
        <span className="section-label">A LITTLE FRIENDLY COMPANY</span>
        <h1>
          Curiosity
          <br />
          adds up.
        </h1>
      </div>
      <Leaderboard />
    </div>
  );
}
