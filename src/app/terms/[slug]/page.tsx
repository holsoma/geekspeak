import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { terms, getTerm, getPack } from "@/data/packs";
import { SaveTerm } from "@/components/SaveTerm";
import { IdempotencyDemo } from "@/components/IdempotencyDemo";
import { Arrow } from "@/components/Icons";
import { siteUrl } from "@/lib/site";
export const dynamicParams = false;
export const generateStaticParams = () => terms.map((t) => ({ slug: t.id }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const term = getTerm((await params).slug);
  return {
    title: `${term?.name || "Term"}, explained`,
    description: term?.summary,
  };
}
export default async function TermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const term = getTerm((await params).slug);
  if (!term) notFound();
  const pack = getPack(term.packId)!;
  const index = pack.terms.findIndex((t) => t.id === term.id);
  const related = pack.terms
    .filter((t) => t.id !== term.id)
    .slice(
      Math.max(0, Math.floor(index / 4) * 4 - 1),
      Math.max(0, Math.floor(index / 4) * 4 - 1) + 3,
    );
  return (
    <article className="term-page">
      <Link href="/wordbook" className="back-link">
        ← Wordbook
      </Link>
      <div className="term-heading" data-enter>
        <Link href={`/packs/${pack.id}`} className="section-label">
          {pack.title.toUpperCase()} ↗
        </Link>
        <h1>{term.name}</h1>
        <p className="term-summary">{term.summary}</p>
        <SaveTerm id={term.id} />
      </div>
      <div className="term-body">
        <div>
          <h2>In plain English</h2>
          <p>{term.explanation}</p>
        </div>
        <div className="example-block">
          <span>IN PRACTICE</span>
          <p>{term.example}</p>
        </div>
        <div>
          <h2>A common mix-up</h2>
          <p>{term.misconception}</p>
        </div>
        {term.aliases.length > 0 && (
          <p className="small muted">
            Also known as: {term.aliases.join(", ")}
          </p>
        )}
        <a
          href={term.source}
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to the original documentation <Arrow diagonal />
        </a>
      </div>
      {term.id === "idempotency" && <IdempotencyDemo />}
      <aside className="term-next">
        <h2>Make it stick.</h2>
        <p>Learn this term alongside related ideas in {pack.title}.</p>
        <Link className="button primary" href={`/packs/${pack.id}`}>
          Explore the pack <Arrow />
        </Link>
      </aside>
      <section className="related-terms">
        <h2>Keep connecting the dots</h2>
        {related.map((t) => (
          <Link href={`/terms/${t.id}`} key={t.id}>
            {t.name}
            <Arrow diagonal />
          </Link>
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.name,
            description: term.summary,
            url: `${siteUrl}/terms/${term.id}`,
            inDefinedTermSet: `${siteUrl}/wordbook`,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
