import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { getPack, packs } from "@/data/packs";
import { PackArt, Arrow } from "@/components/Icons";
import { PackPath } from "@/components/PackPath";
export const dynamicParams = false;
export const generateStaticParams = () => packs.map((p) => ({ slug: p.id }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const pack = getPack((await params).slug);
  return { title: pack?.title, description: pack?.description };
}
export default async function PackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const pack = getPack((await params).slug);
  if (!pack) notFound();
  return (
    <div className="page-wrap">
      <Link href="/packs" className="back-link">
        ← All packs
      </Link>
      <div className="pack-detail-hero" data-enter>
        <ViewTransition
          name={`pack-${pack.id}`}
          share="pack-open"
          default="none"
        >
          <div className={`pack-detail-art pack-${pack.colour}`}>
            <PackArt symbol={pack.symbol} />
            <span>THE GEEKSPEAK COLLECTION</span>
          </div>
        </ViewTransition>
        <div>
          <span className="section-label">
            {pack.level.toUpperCase()} · 20 TERMS
          </span>
          <h1>{pack.title}</h1>
          <p>{pack.description}</p>
          <div className="pack-detail-facts">
            <span>5 lessons</span>
            <span>4 terms at a time</span>
            <span>Learn at your pace</span>
          </div>
          <Link
            href={`/learn/${pack.id}/1`}
            className="button primary pack-start"
          >
            Start with lesson one <Arrow />
          </Link>
        </div>
      </div>
      <PackPath pack={pack} />
      <section className="pack-terms">
        <h2>What’s in this pack?</h2>
        <div>
          {pack.terms.map((term) => (
            <Link key={term.id} href={`/terms/${term.id}`}>
              {term.name}
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
