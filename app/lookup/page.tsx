"use client";

import { useMemo, useState } from "react";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";
import { IrisRing } from "@/components/IrisRing";
import { ResultPanel } from "@/components/ResultPanel";
import { TextInput } from "@/components/Field";
import { Button } from "@/components/Button";
import { useIrisSequence } from "@/lib/useIrisSequence";
import { searchLoanApp, getAlternatives, type LookupResult } from "@/lib/riskLookup";

export default function LookupPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const steps = useMemo(
    () => [
      {
        label: "normalising query",
        run: () => query.trim(),
      },
      {
        label: "checking registry",
        run: (q: unknown) => searchLoanApp(q as string),
      },
      {
        label: "compiling citation",
        run: (r: unknown) => r as LookupResult,
      },
    ],
    [query],
  );

  const sequence = useIrisSequence(steps, (results) => results[results.length - 1] as LookupResult);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    sequence.reset();
    sequence.run();
  }

  const result = sequence.status === "result" ? sequence.result : null;
  const tone = result?.matched ? result.tone : "amber";
  // reshuffles only when a new search is submitted, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const alternatives = useMemo(() => getAlternatives(3), [submittedQuery]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-14 sm:px-8">
      <TopBar title="Loan app lookup" />

      <div className="flex flex-col items-center gap-8 pt-6 pb-10">
        <IrisRing
          status={sequence.status === "error" ? "error" : sequence.status}
          activeLabel={sequence.activeLabel}
          activeIndex={sequence.activeIndex}
          stepCount={sequence.stepCount}
          tone={tone}
          size={168}
        />

        {sequence.status !== "result" ? (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-foreground-dim">App name</span>
              <TextInput
                type="text"
                placeholder="e.g. Camelloan, EaseCash, FairMoney"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </label>
            <p className="text-[12.5px] leading-relaxed text-foreground-faint">
              Matched against FCCPC delisting and Google Play removal records, not a scan of apps on your phone.
            </p>
            <Button type="submit" className="w-full" disabled={sequence.status === "checking"}>
              {sequence.status === "checking" ? "Checking…" : "Check this app"}
            </Button>
          </form>
        ) : null}

        {result ? (
          <div className="w-full space-y-5">
            {result.matched ? (
              <>
                <ResultPanel
                  tone={result.tone}
                  eyebrow={result.app.action_date ? `Action recorded ${result.app.action_date}` : undefined}
                  title={result.app.name}
                  sources={result.sources}
                  showDisclaimer
                >
                  <p>{result.app.reason}</p>
                  <p className="text-[12.5px] text-foreground-faint">{result.methodology}</p>
                </ResultPanel>

                <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-5">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                    <ShieldCheck size={16} className="text-risk-low" weight="fill" />
                    Try one of these instead
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {alternatives.map((alt) => (
                      <li key={alt.name} className="flex items-baseline justify-between gap-3 text-[13.5px]">
                        <span className="text-foreground">{alt.name}</span>
                        <span className="text-right text-foreground-faint">{alt.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <NoMatchPanel query={result.query} sources={result.sources} />
            )}
            <Button variant="ghost" className="w-full" onClick={() => sequence.reset()}>
              Look up another app
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NoMatchPanel({ query, sources }: { query: string; sources: string[] }) {
  return (
    <section className="w-full max-w-md space-y-4">
      <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface px-6 py-6">
        <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-border-hairline px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-faint">
          Not in our verified records
        </span>
        <h2 className="mt-4 text-xl leading-snug font-medium text-foreground">&ldquo;{query}&rdquo; isn&rsquo;t in this dataset yet</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground-dim">
          That doesn&rsquo;t mean it&rsquo;s safe. Our list covers roughly 40 apps with a documented FCCPC or Google
          Play action, a small fraction of what&rsquo;s in circulation. Run these three checks yourself before you
          borrow.
        </p>
      </div>

      <div className="space-y-3">
        <ChecklistCard
          title="1. Compute the true APR"
          body="Take the stated processing fee and the loan term into the calculator. A fee that looks small over a short term almost always annualises into triple digits."
          href="/calculate"
          cta="Open the calculator"
        />
        <ChecklistCard
          title="2. Check what it asks permission for"
          body="Be suspicious of any loan app requesting your contacts, SMS, photos, or call log. Legitimate FCCPC-approved lenders don&rsquo;t need to read your address book to underwrite a loan."
        />
        <ChecklistCard
          title="3. Read for these three T&C traps"
          body="Late fees that compound daily, a clause granting the lender rights to contact people in your phone, and automatic rollover into a new loan if you&rsquo;re a day late."
          href="/scan"
          cta="Scan the terms"
        />
      </div>

      <p className="text-[11.5px] leading-relaxed text-foreground-faint">
        Records last compiled from FCCPC/Google Play delisting reporting. Based on official records, not editorial
        opinion.{" "}
        {sources[0] ? (
          <a href={sources[0]} target="_blank" rel="noreferrer" className="underline decoration-border-hairline underline-offset-2">
            View source
          </a>
        ) : null}
      </p>
    </section>
  );
}

function ChecklistCard({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-[var(--radius-input)] border border-border-hairline bg-surface/60 px-4 py-4">
      <p className="text-[13.5px] font-medium text-foreground">{title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-dim">{body}</p>
      {href && cta ? (
        <a href={href} className="mt-2 inline-block text-[12.5px] font-medium text-gold-400 underline underline-offset-2">
          {cta}
        </a>
      ) : null}
    </div>
  );
}
