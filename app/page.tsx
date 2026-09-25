import Link from "next/link";
import { Calculator, MagnifyingGlass, FileMagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { IrisRing } from "@/components/IrisRing";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";

const FEATURES = [
  {
    icon: Calculator,
    title: "The true cost of a loan",
    description: "Turn a stated processing fee into the real annualised APR, and catch short-tenure traps.",
  },
  {
    icon: MagnifyingGlass,
    title: "Whether an app's been delisted",
    description: "Check a name against FCCPC delisting and Google Play removal records, cited inline.",
  },
  {
    icon: FileMagnifyingGlass,
    title: "What's hiding in the terms",
    description: "Paste the terms or a link and flag late fees, contact-list clauses, rollover traps.",
  },
] as const;

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 sm:px-8">
        <div className="flex flex-col items-center gap-8 pt-2 pb-10 text-center opacity-0 [animation:fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_0.05s_forwards]">
          <IrisRing status="idle" size={172} />
          <div className="max-w-[28ch]">
            <h1 className="text-[26px] leading-[1.15] font-medium text-foreground">
              Stay alert before you borrow.
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-foreground-dim">
              Three real checks against real Nigerian regulatory records, not a device scan and not a guess.
              Create a free account to run them.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="flex-1">
              <Button className="w-full">Create free account</Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button variant="ghost" className="w-full">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="divide-y divide-border-hairline border-t border-b border-border-hairline">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              style={{ animationDelay: `${0.18 + i * 0.08}s` }}
              className="flex items-start gap-4 py-5 opacity-0 [animation:fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            >
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-hairline text-gold-500">
                <Icon size={19} weight="light" />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium text-foreground">{title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-foreground-faint">{description}</span>
              </span>
            </div>
          ))}
        </div>

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
