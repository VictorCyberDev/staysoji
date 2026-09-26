"use client";

import { useEffect, useMemo, useState } from "react";
import { IrisRing } from "@/components/IrisRing";
import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/Field";
import { useIrisSequence } from "@/lib/useIrisSequence";
import { CATEGORY_LABEL, type ClauseCategory } from "@/lib/tcExtract";

type FlaggedClauseDTO = {
  category: ClauseCategory;
  categoryLabel: string;
  sentence: string;
  matchedTerm: string;
  explanation: string | null;
};

type ScanResponse = {
  source: string;
  truncated: boolean;
  charCount: number;
  sentenceCount: number;
  tone: "low" | "amber" | "high";
  method: "rule-based" | "llm-enhanced";
  clauses: FlaggedClauseDTO[];
  error?: string;
};

export default function ScanPage() {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const value = mode === "text" ? text : url;

  const steps = useMemo(
    () => [
      {
        label: mode === "url" ? "fetching source" : "reading pasted text",
        run: async () => {
          const res = await fetch("/api/scan", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ mode, value }),
          });
          const data = (await res.json()) as ScanResponse;
          if (!res.ok) throw new Error(data.error ?? "Could not scan that source.");
          return data;
        },
      },
      {
        label: "parsing clauses",
        run: (r: unknown) => r as ScanResponse,
      },
      {
        label: "scanning terms",
        run: (r: unknown) => r as ScanResponse,
      },
    ],
    [mode, value],
  );

  const sequence = useIrisSequence(steps, (results) => results[results.length - 1] as ScanResponse);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    sequence.reset();
    sequence.run();
  }

  const result = sequence.status === "result" ? sequence.result : null;

  useEffect(() => {
    if (!result) return;
    const count = result.clauses.length;
    const summary = `${result.source} — ${count} flagged clause${count === 1 ? "" : "s"}`;
    fetch("/api/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "scan", summary, tone: result.tone }),
      keepalive: true,
    }).catch(() => {});
  }, [result]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-14 sm:px-8">

      <div className="flex flex-col items-center gap-8 pt-6 pb-10">
        <IrisRing
          status={sequence.status === "error" ? "error" : sequence.status}
          activeLabel={sequence.activeLabel}
          activeIndex={sequence.activeIndex}
          stepCount={sequence.stepCount}
          tone={result?.tone ?? "amber"}
          size={168}
        />

        {sequence.status !== "result" ? (
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="inline-flex w-full rounded-[var(--radius-pill)] border border-border-hairline p-1">
              {(["text", "url"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-[var(--radius-pill)] py-2 text-[13px] font-medium transition-colors ${
                    mode === m ? "bg-gold-500 text-teal-950" : "text-foreground-faint hover:text-foreground-dim"
                  }`}
                  aria-pressed={mode === m}
                >
                  {m === "text" ? "Paste text" : "Enter a link"}
                </button>
              ))}
            </div>

            {mode === "text" ? (
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-foreground-dim">Loan terms</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={7}
                  placeholder="Paste the terms and conditions text here…"
                  className="w-full resize-none rounded-[var(--radius-input)] border border-border-hairline bg-surface-raised px-4 py-3 text-[14px] leading-relaxed text-foreground placeholder:text-foreground-faint focus:border-gold-500/70 focus:outline-none"
                />
              </label>
            ) : (
              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-foreground-dim">Link to the terms page</span>
                <TextInput
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://example.com/terms"
                />
                <span className="text-[12px] text-foreground-faint">
                  Fetched from our server so the page can&rsquo;t block or track your browser directly.
                </span>
              </label>
            )}

            {sequence.status === "error" && sequence.error ? (
              <p className="text-[13px] text-risk-high">{sequence.error}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={sequence.status === "checking"}>
              {sequence.status === "checking" ? "Scanning…" : "Scan the terms"}
            </Button>
          </form>
        ) : null}

        {result ? <ScanResultView result={result} onReset={() => sequence.reset()} /> : null}
      </div>
    </div>
  );
}

function ScanResultView({ result, onReset }: { result: ScanResponse; onReset: () => void }) {
  const grouped = result.clauses.reduce<Record<string, FlaggedClauseDTO[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  const title =
    result.clauses.length === 0
      ? "No red-flag clauses found"
      : `${result.clauses.length} clause${result.clauses.length === 1 ? "" : "s"} worth a second look`;

  return (
    <div className="w-full space-y-5">
      <ResultPanel
        tone={result.tone}
        eyebrow={`${result.source === "Pasted text" ? "Pasted text" : new URL(result.source).hostname} · ${result.sentenceCount} sentences scanned`}
        title={title}
      >
        <p className="text-[12.5px] text-foreground-faint">
          {result.method === "llm-enhanced"
            ? "Clauses matched by pattern, explanations written by an LLM from the matched text only."
            : "Matched directly against the text you supplied using late-fee, third-party-contact, and rollover patterns."}
          {result.truncated ? " Only the first part of this document was scanned." : ""}
        </p>
      </ResultPanel>

      {(Object.keys(grouped) as ClauseCategory[]).map((category) => (
        <div key={category} className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold-400">{CATEGORY_LABEL[category]}</p>
          <ul className="mt-3 space-y-4">
            {grouped[category].map((clause, i) => (
              <li key={i} className="border-l-2 border-border-hairline pl-3.5">
                <p className="text-[13.5px] leading-relaxed text-foreground-dim">&ldquo;{clause.sentence}&rdquo;</p>
                {clause.explanation ? (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">{clause.explanation}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Button variant="ghost" className="w-full" onClick={onReset}>
        Scan something else
      </Button>
    </div>
  );
}
