import type { ReactNode } from "react";
import { Link as LinkIcon } from "@phosphor-icons/react/dist/ssr";
import type { IrisTone } from "./IrisRing";

const TONE_LABEL: Record<IrisTone, string> = {
  low: "Low risk",
  amber: "Caution",
  high: "High risk",
};

const TONE_CLASS: Record<IrisTone, string> = {
  low: "text-risk-low border-risk-low/40",
  amber: "text-risk-amber border-risk-amber/40",
  high: "text-risk-high border-risk-high/40",
};

export function ResultPanel({
  tone,
  eyebrow,
  title,
  children,
  sources,
  showDisclaimer = false,
}: {
  tone: IrisTone;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  sources?: string[];
  showDisclaimer?: boolean;
}) {
  return (
    <section className="w-full max-w-md">
      <div className={`rounded-[var(--radius-card)] border bg-surface px-6 py-6 ${TONE_CLASS[tone]}`}>
        <span className={`inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] ${TONE_CLASS[tone]}`}>
          {TONE_LABEL[tone]}
        </span>
        {eyebrow ? <p className="mt-4 text-[13px] text-foreground-faint">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl leading-snug font-medium text-foreground">{title}</h2>
        {children ? <div className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-foreground-dim">{children}</div> : null}
      </div>

      {sources && sources.length > 0 ? (
        <div className="mt-4 rounded-[var(--radius-input)] border border-border-hairline bg-surface/60 px-4 py-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground-faint">
            <LinkIcon size={12} /> Source
          </p>
          <ul className="mt-1.5 space-y-1">
            {sources.map((src) => (
              <li key={src} className="truncate text-[12px] text-foreground-faint">
                <a href={src} target="_blank" rel="noreferrer" className="underline decoration-border-hairline underline-offset-2 hover:text-foreground-dim">
                  {src.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showDisclaimer ? (
        <p className="mt-3 text-[11.5px] leading-relaxed text-foreground-faint">
          Based on official FCCPC delisting records, not editorial opinion.
        </p>
      ) : null}
    </section>
  );
}
