import Link from "next/link";
import { HeroDeck } from "@/components/HeroDeck";
import { PackCard } from "@/components/PackCard";
import { QuickQuiz } from "@/components/QuickQuiz";
import { Arrow, Logo, Check } from "@/components/Icons";
import { packs } from "@/data/packs";
import { siteUrl, description } from "@/lib/site";
export default function Home() {
  const featured = ["llm-basics", "agents", "system-design", "cloud"].map(
    (id) => packs.find((p) => p.id === id)!,
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow" data-enter>
            <span className="little-star" aria-hidden="true">
              ✳
            </span>{" "}
            FOR CURIOUS MINDS, NOT WALKING DICTIONARIES.
          </div>
          <h1 data-enter>
            TECH TALK.
            <br />
            NOW YOU
            <br />
            <span className="headline-last">
              GET IT<span className="coral-dot">.</span>
              <svg
                className="headline-waves"
                viewBox="0 0 65 80"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 25c9 9 9 21 0 30M25 13c17 17 17 37 0 54M42 3c22 22 22 52 0 74"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="hero-description" data-enter>
            From “what’s a token?” to “that makes sense.”
            <br />
            Learn the tech terms that come up in real life.
            <br />
            One small pack at a time.
          </p>
          <div className="hero-actions" data-enter>
            <Link href="/packs" className="button primary">
              Find your first pack <Arrow />
            </Link>
            <span>
              No account needed. <br />
              Your curiosity is enough.
            </span>
          </div>
        </div>
        <HeroDeck />
      </section>
      <div className="fact-strip">
        <span>
          <strong>200</strong> useful terms
        </span>
        <span>
          <strong>10</strong> subject packs
        </span>
        <span>
          <strong>0</strong> streaks to keep
        </span>
        <span className="fact-end">
          <Logo /> A little knowledge goes a long way.
        </span>
      </div>
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">YOUR NEXT “AHA” STARTS HERE</span>
            <h2>
              Pick a pack.
              <br />
              Make it click.
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              Big subjects, broken into small discoveries. <br />
              Start with what you’re curious about.
            </p>
            <Link href="/packs" className="text-link">
              Explore all 10 packs <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="featured-grid">
          {featured.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
        <div className="pack-shelf-note">
          <span>Also on the shelf</span>
          <p>
            Machine learning · Python · Data & databases · RAG & search · Deep
            learning & vision · AI in production
          </p>
        </div>
      </section>
      <QuickQuiz />
      <section className="progress-promise">
        <div className="progress-illustration" aria-hidden="true">
          <div className="progress-paper">
            <span>YOUR UNDERSTANDING</span>
            <div className="illustration-row">
              token <Check />
            </div>
            <div className="illustration-row">
              embedding <Check />
            </div>
            <div className="illustration-row">
              context window <Check />
            </div>
            <div className="illustration-row next-word">
              what’s next? <Arrow />
            </div>
          </div>
          <div className="promise-stamp">
            AT YOUR
            <br />
            OWN PACE
          </div>
        </div>
        <div className="promise-copy">
          <span className="section-label">PROGRESS WITHOUT THE PRESSURE</span>
          <h2>
            Come back curious.
            <br />
            Not guilty.
          </h2>
          <p>
            Collect understanding, not consecutive days. Your progress stays
            put, whether you return tomorrow or next month.
          </p>
          <ul>
            <li>
              <Check />
              Short lessons with real-world examples
            </li>
            <li>
              <Check />
              Review the terms that need another look
            </li>
            <li>
              <Check />
              Optional GitHub login to keep your place
            </li>
          </ul>
          <Link href="/packs" className="button primary">
            Let’s learn something <Arrow />
          </Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Geekspeak",
            url: siteUrl,
            description,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
