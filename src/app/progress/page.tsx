import type { Metadata } from "next";
import { packs, terms } from "@/data/packs";
import { ProgressDashboard } from "@/components/ProgressDashboard";
export const metadata: Metadata = {
  title: "My progress",
  description:
    "See the terms you understand, the lessons you have completed and the ideas worth another look.",
  robots: { index: false, follow: true },
};
export default function ProgressPage() {
  return (
    <div className="page-wrap">
      <ProgressDashboard
        packs={packs.map(({ id, title, colour, terms }) => ({
          id,
          title,
          colour,
          termIds: terms.map((t) => t.id),
        }))}
        terms={terms.map(({ id, name }) => ({ id, name }))}
      />
    </div>
  );
}
