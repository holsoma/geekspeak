import type { Metadata } from "next";
import { terms, packs } from "@/data/packs";
import { Wordbook } from "@/components/Wordbook";
export const metadata: Metadata = {
  title: "Wordbook",
  description:
    "Look up 200 useful terms from AI, programming, databases, system design and cloud computing. Plain explanations and real examples.",
};
export default function WordbookPage() {
  return (
    <div className="page-wrap">
      <div className="page-heading" data-enter>
        <span className="section-label">A DICTIONARY WITH A FILTER</span>
        <h1>
          Heard it.
          <br />
          Now understand it.
        </h1>
        <p>
          The useful stuff, explained simply.
          <br />
          Find a term, see it in context and keep it for later.
        </p>
      </div>
      <Wordbook
        terms={terms.map(
          ({ id, name, aliases, summary, packId, packTitle }) => ({
            id,
            name,
            aliases,
            summary,
            packId,
            packTitle,
          }),
        )}
        packs={packs.map(({ id, title }) => ({ id, title }))}
      />
    </div>
  );
}
