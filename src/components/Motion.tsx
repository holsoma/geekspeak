"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    let stop: undefined | (() => void);
    let cancelled = false;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const context = gsap.context(() => {
        gsap.from("[data-enter]", {
          y: 22,
          opacity: 0,
          duration: 0.55,
          stagger: 0.055,
          ease: "power3.out",
          clearProps: "all",
        });
      });
      stop = () => context.revert();
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [pathname]);
  return null;
}
