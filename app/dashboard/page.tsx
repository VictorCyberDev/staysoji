import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calculator, MagnifyingGlass, FileMagnifyingGlass, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { IrisRing } from "@/components/IrisRing";
import { TopBar } from "@/components/TopBar";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard — StaySoji",
  robots: { index: false, follow: false },
};

const ENTRIES = [
  {
    href: "/calculate",
    icon: Calculator,
    title: "Calculate the true cost",
    description: "Turn a stated fee into the real APR, and catch short-tenure traps.",
  },
  {
    href: "/lookup",
    icon: MagnifyingGlass,
    title: "Look up a loan app",
    description: "Check a name against FCCPC delisting and blacklist records.",
  },
  {
    href: "/scan",
    icon: FileMagnifyingGlass,
    title: "Scan the terms",
    description: "Paste text or a link and flag late fees, contact-list clauses, rollovers.",
  },
] as const;

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <TopBar menu />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 opacity-0 [animation:fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.05s_forwards]">
          <IrisRing status="idle" size={196} />
          <div className="max-w-[26ch] text-center">
            <h1 className="text-[26px] leading-[1.15] font-medium text-foreground">
              Stay alert before you borrow.
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-foreground-dim">
              Three real checks against real records. No guesswork, no device scanning.
            </p>
          </div>
        </div>

        <nav aria-label="Available checks" className="divide-y divide-border-hairline border-t border-b border-border-hairline">
          {ENTRIES.map(({ href, icon: Icon, title, description }, i) => (
            <Link
              key={href}
              href={href}
              style={{ animationDelay: `${0.18 + i * 0.08}s` }}
              className="group flex items-center gap-4 py-5 opacity-0 [animation:fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] transition-colors hover:bg-surface/60 -mx-1 px-1 rounded-[var(--radius-input)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-hairline text-gold-400 transition-colors group-hover:border-gold-500/60">
                <Icon size={19} weight="light" />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium text-foreground">{title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-foreground-faint">{description}</span>
              </span>
              <CaretRight size={16} className="shrink-0 text-foreground-faint transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-center text-[11.5px] leading-relaxed text-foreground-faint">
          Built for FCCPC-documented records, not device permissions. Next: an API for lenders and platforms to
          screen listings before they go live.
        </p>

        <nav aria-label="Site" className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11.5px] text-foreground-faint underline decoration-border-hairline underline-offset-2 transition-colors hover:text-foreground-dim"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
