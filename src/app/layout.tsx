import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { ProgressProvider } from "@/components/ProgressProvider";
import { siteUrl, description } from "@/lib/site";
import "./globals.css";
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Geekspeak. Get the tech talk.",
    template: "%s | Geekspeak",
  },
  description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "Geekspeak",
    title: "Geekspeak. Get the tech talk.",
    description,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geekspeak. Get the tech talk.",
    description,
    images: ["/opengraph-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ProgressProvider>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ProgressProvider>
        <Motion />
      </body>
    </html>
  );
}
