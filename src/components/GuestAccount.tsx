import Link from "next/link";
import { Arrow, Logo } from "./Icons";
export function GuestAccount() {
  return (
    <div className="sign-in-page">
      <div className="sign-in-art" aria-hidden="true">
        <Logo />
        <span>
          A LITTLE MORE
          <br />
          UNDERSTANDING.
          <br />
          RIGHT HERE.
        </span>
      </div>
      <div className="sign-in-copy">
        <span className="section-label">LEARN AS A GUEST</span>
        <h1>
          Your progress.
          <br />
          Right here.
        </h1>
        <p>
          Every pack is ready to explore. This version keeps your learned terms,
          saved words and completed lessons in this browser.
        </p>
        <div className="notice compact-notice">
          <strong>GitHub sign-in is not available in this preview.</strong>
          <p>
            You can learn every pack now. Your progress stays on this device.
          </p>
        </div>
        <Link href="/packs" className="button primary">
          Keep learning <Arrow />
        </Link>
        <p className="small muted">
          Clearing this site’s browser data removes guest progress. Cross-device
          saving and the leaderboard need connected account services.
        </p>
        <Link href="/privacy" className="source-link">
          How your data is used
        </Link>
      </div>
    </div>
  );
}
