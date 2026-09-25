"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";

// Client-side so every other page can stay statically prerendered; this is
// the one piece of the header that genuinely needs to know who's asking.
export function AccountLink() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { loggedIn?: boolean }) => {
        if (!cancelled) setLoggedIn(Boolean(data.loggedIn));
      })
      .catch(() => {
        // stay signed-out in the UI if the check fails; no access is gated on this
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link
      href={loggedIn ? "/account" : "/login"}
      aria-label={loggedIn ? "Your account" : "Sign in"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground-dim transition-colors hover:border-gold-500/60 hover:text-foreground"
    >
      <UserCircle size={18} weight={loggedIn ? "fill" : "regular"} />
    </Link>
  );
}
