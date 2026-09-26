"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShieldCheck, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { IrisRing } from "@/components/IrisRing";
import { ResultPanel } from "@/components/ResultPanel";
import { TextInput } from "@/components/Field";
import { Button } from "@/components/Button";
import { useIrisSequence } from "@/lib/useIrisSequence";
import { searchLoanApp, getAlternatives, suggestNames, type LookupResult, type Suggestion } from "@/lib/riskLookup";

export default function LookupPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputWrapRef = useRef<HTMLDivElement>(null);

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

  const liveSuggestions = useMemo(() => (showSuggestions ? suggestNames(query, 6) : []), [query, showSuggestions]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function runSearch(name: string) {
    setQuery(name);
    setSubmittedQuery(name);
    setShowSuggestions(false);
    sequence.reset();
    // give React a tick to commit the query state before the sequence reads it
    requestAnimationFrame(() => sequence.run());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setShowSuggestions(false);
    sequence.reset();
    sequence.run();
  }

  const result = sequence.status === "result" ? sequence.result : null;
  const tone = result?.matched ? result.tone : "amber";
  // reshuffles only when a new search is submitted, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const alternatives = useMemo(() => getAlternatives(3), [submittedQuery]);

  useEffect(() => {
    if (!result) return;
    const summary = result.matched
      ? result.kind === "blacklisted"
        ? `${result.app.name} — flagged in registry`
        : `${result.app.name} — approved alternative`
      : `"${result.query}" — no match found`;
    fetch("/api/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "lookup", summary, tone }),
      keepalive: true,
    }).catch(() => {});
  }, [result, tone]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-14 sm:px-8">
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
            <div ref={inputWrapRef} className="relative flex flex-col gap-2">
              <span className="text-[13px] font-medium text-foreground-dim">App name</span>
              <TextInput
                type="text"
                placeholder="e.g. Camelloan, EaseCash, FairMoney"
                value={query}
                autoComplete="off"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // deferred so a suggestion's onMouseDown fires first, and so a
                  // click landing on the submit button below is never blocked by
                  // this dropdown sitting on top of it
                  window.setTimeout(() => setShowSuggestions(false), 120);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
                required
              />
              {showSuggestions && liveSuggestions.length > 0 ? (
                <ul className="absolute top-full z-10 mt-1.5 max-h-56 w-full overflow-auto rounded-[var(--radius-input)] border border-border-hairline bg-surface-raised shadow-[var(--shadow-ambient)]">
                  {liveSuggestions.map((s) => (
                    <li key={s.name}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          runSearch(s.name);
                        }}
                        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13.5px] text-foreground transition-colors hover:bg-surface"
                      >
                        <span>{s.name}</span>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                            s.kind === "approved" ? "text-risk-low" : "text-foreground-faint"
                          }`}
                        >
                          {s.kind === "approved" ? "approved" : "registry"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <p className="text-[12.5px] leading-relaxed text-foreground-faint">
              Matched against FCCPC delisting and Google Play removal records, not a scan of apps on your phone.
              Close spellings will still surface as suggestions.
            </p>
            <Button type="submit" className="w-full" disabled={sequence.status === "checking"}>
              {sequence.status === "checking" ? "Checking…" : "Check this app"}
            </Button>
          </form>
        ) : null}

        {result ? (
          <div className="w-full space-y-5">
            {result.matched && result.kind === "blacklisted" ? (
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
            ) : null}

            {result.matched && result.kind === "approved" ? (
              <ResultPanel tone="low" title={result.app.name} sources={result.sources} showDisclaimer>
                <p className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-risk-low" weight="fill" />
                  {result.app.note}
                </p>
                <p className="text-[12.5px] text-foreground-faint">
                  This name matches our list of FCCPC-approved lenders, not the delisted-app registry. Still run the
                  true-cost calculator on any offer before you accept it.
                </p>
              </ResultPanel>
            ) : null}

            {!result.matched ? (
              <NoMatchPanel
                query={result.query}
                sources={result.sources}
                coverageNote={result.coverageNote}
                suggestions={result.suggestions}
                onSuggestion={runSearch}
              />
            ) : null}

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setQuery("");
                sequence.reset();
              }}
            >
              Look up another app
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NoMatchPanel({
  query,
  sources,
  coverageNote,
  suggestions,
  onSuggestion,
}: {
  query: string;
  sources: string[];
  coverageNote: string;
  suggestions: Suggestion[];
  onSuggestion: (name: string) => void;
}) {
  return (
    <section className="w-full max-w-md space-y-4">
      <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface px-6 py-6">
        <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-border-hairline px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-faint">
          Not in our verified records
        </span>
        <h2 className="mt-4 text-xl leading-snug font-medium text-foreground">
          &ldquo;{query}&rdquo; isn&rsquo;t in this dataset yet
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground-dim">{coverageNote}</p>
      </div>

      {suggestions.length > 0 ? (
        <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-5">
          <p className="text-[13px] font-medium text-foreground">Did you mean one of these?</p>
          <ul className="mt-3 space-y-1">
            {suggestions.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => onSuggestion(s.name)}
                  className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-input)] px-2 py-2 text-left text-[13.5px] text-foreground transition-colors hover:bg-surface"
                >
                  <span>{s.name}</span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                      s.kind === "approved" ? "text-risk-low" : "text-foreground-faint"
                    }`}
                  >
                    {s.kind === "approved" ? "approved" : "registry"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
