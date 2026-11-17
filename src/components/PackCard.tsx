import Link from "next/link";
import { ViewTransition } from "react";
import type { PackPreview } from "@/data/types";
import { PackArt, Arrow } from "./Icons";
export function PackCard({
  pack,
  compact = false,
}: {
  pack: PackPreview;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/packs/${pack.id}`}
      className={`pack-card pack-${pack.colour} ${compact ? "compact" : ""}`}
    >
      <ViewTransition name={`pack-${pack.id}`} share="pack-open" default="none">
        <div className="pack-cover">
          <div className="pack-card-meta">
            <span>{pack.level}</span>
            <span>20 terms</span>
          </div>
          <PackArt symbol={pack.symbol} />
          <h3>{pack.shortTitle}</h3>
          <div className="pack-cover-foot">
            <span>5 short lessons</span>
            <span className="circle-arrow">
              <Arrow diagonal />
            </span>
          </div>
        </div>
      </ViewTransition>
      <div className="pack-card-description">
        <span>{pack.description}</span>
      </div>
    </Link>
  );
}
