import Link from "next/link";
import { Logo, Arrow } from "./Icons";
import { githubUrl } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p>
          A little less jargon.
          <br />A lot more understanding.
        </p>
        <Link href="/packs" className="footer-cta">
          Pick your next pack <Arrow diagonal />
        </Link>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        GeekSpeak<span>.</span>
      </div>
      <div className="footer-bottom">
        <span>
          <Logo /> Made for curious minds.
        </span>
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <a href={githubUrl}>GitHub</a>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <span>Free. Open source. Yours to learn.</span>
      </div>
    </footer>
  );
}
