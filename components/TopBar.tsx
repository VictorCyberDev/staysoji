import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountLink } from "@/components/AccountLink";

export function TopBar({ title, backHref }: { title?: string; backHref?: string }) {
  return (
    <header className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-6 pt-[calc(env(safe-area-inset-top)+18px)] pb-2 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground-dim transition-colors hover:border-gold-500/60 hover:text-foreground"
            aria-label="Back"
          >
            <ArrowLeft size={16} weight="bold" />
          </Link>
        ) : null}
        {title ? (
          <h1 className="truncate font-mono text-[12px] uppercase tracking-[0.16em] text-foreground-dim">{title}</h1>
        ) : (
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image
              src="/icon.png"
              alt="StaySoji"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full"
              priority
            />
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground-dim">StaySoji</span>
          </Link>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <AccountLink />
        <ThemeToggle />
      </div>
    </header>
  );
}
