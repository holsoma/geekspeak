"use client";
import { useState } from "react";
import type { PackPreview } from "@/data/types";
import { PackCard } from "./PackCard";
export function PackCatalogue({ packs }: { packs: PackPreview[] }) {
  const [filter, setFilter] = useState("All packs");
  const filtered = packs.filter(
    (p) =>
      filter === "All packs" ||
      (filter === "AI & machine learning"
        ? [
            "llm-basics",
            "retrieval",
            "agents",
            "machine-learning",
            "vision",
            "ai-in-production",
          ].includes(p.id)
        : ["python", "data", "system-design", "cloud"].includes(p.id)),
  );
  return (
    <>
      <div className="filter-bar" aria-label="Filter packs">
        {["All packs", "AI & machine learning", "Software & cloud"].map(
          (item) => (
            <button
              key={item}
              className={filter === item ? "selected" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ),
        )}
        <span>{filtered.length} packs</span>
      </div>
      <h2 className="sr-only">Choose a learning pack</h2>
      <div className="catalogue-grid">
        {filtered.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </>
  );
}
