import type { Metadata } from "next";
import { PackCatalogue } from "@/components/PackCatalogue";
import { packs } from "@/data/packs";
export const metadata: Metadata = {
  title: "Learning packs",
  description:
    "Explore ten packs of useful tech terms, from LLMs and AI agents to Python, databases and AWS.",
};
export default function Packs() {
  return (
    <div className="page-wrap">
      <div className="page-heading" data-enter>
        <span className="section-label">A SUBJECT AT A TIME</span>
        <h1>
          Good things
          <br />
          come in packs.
        </h1>
        <p>
          Choose a subject. Learn four terms. Put them to use.
          <br />
          Every pack is open to you. Start anywhere.
        </p>
      </div>
      <PackCatalogue
        packs={packs.map(
          ({ id, title, shortTitle, description, colour, symbol, level }) => ({
            id,
            title,
            shortTitle,
            description,
            colour,
            symbol,
            level,
          }),
        )}
      />
      <p className="catalogue-note">
        Five lessons per pack. Four terms per lesson. No lives to lose, and no
        daily targets.
      </p>
    </div>
  );
}
