import type { MetadataRoute } from "next";
import { packs, terms } from "@/data/packs";
import { siteUrl } from "@/lib/site";
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/packs",
    "/wordbook",
    "/about",
    "/leaderboard",
    "/privacy",
    ...packs.map((p) => `/packs/${p.id}`),
    ...terms.map((t) => `/terms/${t.id}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
