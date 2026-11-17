"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo, GitHubIcon, Arrow } from "./Icons";
import { useProgress } from "./ProgressProvider";
export function Header() {
  const path = usePathname();
  const { authEnabled } = useProgress();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab" && matchMedia("(max-width: 680px)").matches) {
        const first = menuButton.current;
        const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a");
        const last = links?.[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const links = [
    ["/packs", "Packs"],
    ["/wordbook", "Wordbook"],
    ["/progress", "My progress"],
  ];
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Geekspeak home">
        <Logo />
        <span>
          geekspeak<span className="brand-dot">.</span>
        </span>
      </Link>
      <button
        className="menu-toggle"
        ref={menuButton}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        ref={nav}
        id="main-nav"
        className={open ? "main-nav is-open" : "main-nav"}
        aria-label="Main navigation"
      >
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={path.startsWith(href) ? "page" : undefined}
          >
            <span>{label}</span>
          </Link>
        ))}
        <Link
          className="sign-in-link"
          href={authEnabled ? "/sign-in" : "/packs"}
          prefetch={false}
          onClick={() => setOpen(false)}
        >
          {authEnabled ? <GitHubIcon /> : <Arrow />}
          <span>{authEnabled ? "Save your place" : "Start learning"}</span>
        </Link>
      </nav>
    </header>
  );
}
