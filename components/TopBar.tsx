import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export function TopBar({ title, backHref = "/" }: { title: string; backHref?: string }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-[calc(env(safe-area-inset-top)+18px)] pb-2 sm:px-8">
      <Link
        href={backHref}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground-dim transition-colors hover:border-gold-500/60 hover:text-foreground"
        aria-label="Back to home"
      >
        <ArrowLeft size={16} weight="bold" />
      </Link>
      <h1 className="font-mono text-[12px] uppercase tracking-[0.16em] text-foreground-dim">{title}</h1>
    </header>
  );
}
