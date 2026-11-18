import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page could not be found. Return to GeekSpeak learning packs.",
  robots: { index: false, follow: true },
};
import { Logo, Arrow } from "@/components/Icons";
export default function NotFound() {
  return (
    <div className="not-found">
      <Logo />
      <span className="section-label">404 · A TERM WE DO KNOW</span>
      <h1>
        Lost in
        <br />
        translation.
      </h1>
      <p>
        This page could not be found.
        <br />
        There are plenty of things to discover back at the packs.
      </p>
      <Link href="/packs" className="button primary">
        Find your way back <Arrow />
      </Link>
    </div>
  );
}
