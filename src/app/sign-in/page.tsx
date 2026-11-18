import type { Metadata } from "next";
import Link from "next/link";
import { authConfigured, auth, signIn, signOut } from "@/auth";
import { GitHubIcon, Arrow, Logo } from "@/components/Icons";
import { GuestAccount } from "@/components/GuestAccount";
export const metadata: Metadata = {
  title: authConfigured ? "Save your place" : "Guest progress",
  description: authConfigured
    ? "Sign in with GitHub to save your GeekSpeak learning progress across devices."
    : "Learn every GeekSpeak pack as a guest. This browser keeps your learned terms, saved words and completed lessons.",
  robots: { index: false, follow: true },
};
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!authConfigured) return <GuestAccount />;
  const params = await searchParams;
  const session = authConfigured ? await auth() : null;
  return (
    <div className="sign-in-page">
      <div className="sign-in-art" aria-hidden="true">
        <Logo />
        <span>
          A LITTLE MORE
          <br />
          UNDERSTANDING.
          <br />
          {authConfigured ? "WHEREVER YOU GO." : "RIGHT HERE."}
        </span>
      </div>
      <div className="sign-in-copy">
        <span className="section-label">
          {authConfigured ? "YOUR PLACE IS SAVED" : "LEARN AS A GUEST"}
        </span>
        <h1>
          {session
            ? "Welcome back."
            : authConfigured
              ? "Learn here.\nPick up anywhere."
              : "Your progress.\nRight here."}
        </h1>
        <p>
          {session
            ? `You are signed in as ${session.user?.name}.`
            : authConfigured
              ? "Use your GitHub account to keep your progress, saved terms and completed packs across devices."
              : "Every pack is ready to explore. This version keeps your learned terms, saved words and completed lessons in this browser."}
        </p>
        {params.error && (
          <p className="form-error" role="alert">
            GitHub sign-in did not complete. Try again, or continue learning as
            a guest.
          </p>
        )}
        {session ? (
          <>
            <Link href="/progress" className="button primary">
              Go to my progress <Arrow />
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="text-link">Sign out</button>
            </form>
          </>
        ) : authConfigured ? (
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/progress" });
            }}
          >
            <button className="button primary">
              <GitHubIcon />
              Continue with GitHub <Arrow />
            </button>
          </form>
        ) : (
          <div className="notice compact-notice">
            <strong>Account saving is not connected yet.</strong>
            <p>
              You can learn every pack now. Your progress stays on this device.
            </p>
          </div>
        )}
        <Link href="/packs" className="text-link">
          {session ? "Explore the packs" : "Keep learning as a guest"} <Arrow />
        </Link>
        <p className="small muted">
          {authConfigured
            ? "We use your GitHub profile to recognise you. We do not request access to your code or repositories. The leaderboard is optional."
            : "Clearing this site’s browser data removes guest progress. GitHub sign-in and cross-device saving will be available once account services are connected."}
        </p>
        <Link href="/privacy" className="source-link">
          How your data is used
        </Link>
      </div>
    </div>
  );
}
