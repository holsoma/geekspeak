"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon, Arrow } from "./Icons";
import { useProgress } from "./ProgressProvider";
type Entry = {
  id: string;
  name: string;
  aliases: string[];
  summary: string;
  packId: string;
  packTitle: string;
};
export function Wordbook({
  terms,
  packs,
}: {
  terms: Entry[];
  packs: { id: string; title: string }[];
}) {
  const [query, setQuery] = useState("");
  const [pack, setPack] = useState("all");
  const [saved, setSaved] = useState(false);
  const [pageNumber,setPageNumber] = useState(1);
  const pageSize=24;
  const { progress } = useProgress();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms
      .filter(
        (t) =>
          (pack === "all" || t.packId === pack) &&
          (!saved || progress.bookmarks[t.id]?.value) &&
          (!q ||
            [t.name, ...t.aliases, t.summary].some((s) =>
              s.toLowerCase().includes(q),
            )),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [terms, query, pack, saved, progress.bookmarks]);
  return (
    <>
      <div className="wordbook-controls">
        <label className="search-field">
          <SearchIcon />
          <span className="sr-only">Search terms</span>
          <input
            value={query}
            onChange={(e) => {setQuery(e.target.value);setPageNumber(1)}}
            placeholder="A word you’ve heard. A thing you half-know."
            type="search"
          />
        </label>
        <label className="select-label">
          <span className="sr-only">Filter by pack</span>
          <select value={pack} onChange={(e) => {setPack(e.target.value);setPageNumber(1)}}>
            <option value="all">All subjects</option>
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <button
          aria-pressed={saved}
          onClick={() => {setSaved(!saved);setPageNumber(1)}}
          className={`saved-filter ${saved ? "selected" : ""}`}
        >
          Saved terms
        </button>
      </div>
      <div className="result-count" aria-live="polite">
        {results.length} {results.length === 1 ? "term" : "terms"}
        {query && ` for “${query}”`}
      </div>
      <div className="word-list">
        {results.length === 0 ? (
          <div className="empty-state">
            <h2>
              {saved
                ? "Your collection starts here."
                : "That one isn’t in our wordbook yet."}
            </h2>
            <p>
              {saved
                ? "Save a term from its page or a lesson to find it here."
                : "Try another spelling or browse a different subject."}
            </p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setPack("all");
                setSaved(false);
                setPageNumber(1);
              }}
            >
              Show all terms <Arrow />
            </button>
          </div>
        ) : (
          results.slice((pageNumber-1)*pageSize,pageNumber*pageSize).map((term) => (
            <Link href={`/terms/${term.id}`} className="word-row" key={term.id}>
              <div>
                <h2>
                  {term.name}
                  {progress.learned.includes(term.id) && (
                    <span className="learned-label">Learned</span>
                  )}
                </h2>
                <span>{term.packTitle}</span>
              </div>
              <p>{term.summary}</p>
              <Arrow diagonal />
            </Link>
          ))
        )}
      </div>
      {results.length>pageSize&&<nav className="wordbook-pagination" aria-label="Wordbook pages"><button className="button small-button" disabled={pageNumber===1} onClick={()=>{setPageNumber(n=>n-1);document.querySelector('.wordbook-controls')?.scrollIntoView({block:'start'})}}>Previous</button><span>Page {pageNumber} of {Math.ceil(results.length/pageSize)}</span><button className="button small-button" disabled={pageNumber*pageSize>=results.length} onClick={()=>{setPageNumber(n=>n+1);document.querySelector('.wordbook-controls')?.scrollIntoView({block:'start'})}}>Next page <Arrow/></button></nav>}
    </>
  );
}
