"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  List,
  X,
  SquaresFour,
  ClockCounterClockwise,
  Lightbulb,
  UserCircle,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { signOutAction } from "@/lib/auth/actions";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: SquaresFour },
  { href: "/history", label: "History", icon: ClockCounterClockwise },
  { href: "/request-feature", label: "Request a feature", icon: Lightbulb },
  { href: "/account", label: "Account", icon: UserCircle },
] as const;

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground-dim transition-colors hover:border-gold-500/60 hover:text-foreground"
      >
        {open ? <X size={16} /> : <List size={16} />}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-[var(--radius-card)] border border-border-hairline bg-surface-raised shadow-[var(--shadow-ambient)]">
          <nav className="py-1.5">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-foreground transition-colors hover:bg-surface"
              >
                <Icon size={16} className="text-foreground-faint" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border-hairline py-1.5">
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] text-risk-high transition-colors hover:bg-surface"
              >
                <SignOut size={16} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
