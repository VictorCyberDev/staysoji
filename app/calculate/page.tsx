"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { IrisRing } from "@/components/IrisRing";
import { ResultPanel } from "@/components/ResultPanel";
import { Field, TextInput } from "@/components/Field";
import { Button } from "@/components/Button";
import { useIrisSequence } from "@/lib/useIrisSequence";
import {
  type AprInput,
  type AprResult,
  validateAprInput,
  computeCoreFigures,
  detectBaitFlag,
  classifyApr,
  NAIRA,
  PERCENT,
} from "@/lib/apr";

export default function CalculatePage() {
  const [principal, setPrincipal] = useState("50000");
  const [duration, setDuration] = useState("91");
  const [fee, setFee] = useState("10");
  const [actualRepayment, setActualRepayment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const steps = useMemo(
    () => [
      {
        label: "checking fee structure",
        run: (): AprInput => {
          const input: AprInput = {
            principal: Number(principal),
            statedDurationDays: Number(duration),
            feePercent: Number(fee),
            actualRepaymentDays: actualRepayment ? Number(actualRepayment) : undefined,
          };
          return validateAprInput(input);
        },
      },
      {
        label: "computing true apr",
        run: (prev: unknown) => {
          const input = prev as AprInput;
          return { input, core: computeCoreFigures(input) };
        },
      },
      {
        label: "checking duration pattern",
        run: (prev: unknown) => {
          const { input, core } = prev as { input: AprInput; core: ReturnType<typeof computeCoreFigures> };
          const baitFlag = detectBaitFlag(core, input);
          return { ...core, baitFlag } as AprResult;
        },
      },
    ],
    [principal, duration, fee, actualRepayment],
  );

  const sequence = useIrisSequence(steps, (results) => results[results.length - 1] as AprResult);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    sequence.reset();
    sequence.run();
  }

  const result = sequence.status === "result" ? (sequence.result as AprResult) : null;
  const tone = result ? (result.baitFlag?.level === "confirmed" ? "high" : classifyApr(result.trueApr)) : "amber";

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-14 sm:px-8">
      <TopBar title="True cost calculator" />

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
            <Field label="Principal requested" suffix="₦">
              <TextInput
                type="number"
                inputMode="decimal"
                min={1000}
                step={1000}
                required
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stated duration" helper="days">
                <TextInput
                  type="number"
                  inputMode="numeric"
                  min={1}
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Field>
              <Field label="Processing fee" helper="% of principal" suffix="%">
                <TextInput
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={99}
                  step={0.5}
                  required
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Actual repayment demand (optional)"
              helper="If the T&Cs demand repayment sooner than the stated duration, enter that day count here"
              suffix="days"
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 7"
                value={actualRepayment}
                onChange={(e) => setActualRepayment(e.target.value)}
              />
            </Field>

            {formError ? <p className="text-[13px] text-risk-high">{formError}</p> : null}
            {sequence.status === "error" && sequence.error ? (
              <p className="text-[13px] text-risk-high">{sequence.error}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={sequence.status === "checking"}>
              {sequence.status === "checking" ? "Checking…" : "Check the true cost"}
            </Button>
          </form>
        ) : null}

        {result ? (
          <div className="w-full space-y-5">
            <ResultPanel
              tone={tone}
              eyebrow={`On ₦${Number(principal).toLocaleString("en-NG")} over ${result.statedDurationDays} stated days`}
              title={`True APR: ${result.trueApr.toLocaleString("en-NG", { maximumFractionDigits: 0 })}%`}
            >
              <div className="space-y-1.5 font-mono text-[13px]">
                <Row label="You'd receive" value={NAIRA.format(result.amountReceived)} />
                <Row label="You'd repay" value={NAIRA.format(result.amountRepaid)} />
                <Row label="Real cost of credit" value={NAIRA.format(result.costOfCredit)} />
                <Row label="Cost as a share of what you received" value={PERCENT.format(result.periodRate)} />
              </div>
              <p className="pt-1 text-[13px] leading-relaxed">
                A {fee}% &ldquo;processing fee&rdquo; sounds small, but because it is charged on the full principal and
                deducted before you receive anything, the real annualised cost is{" "}
                <strong className="text-foreground">{result.trueApr.toLocaleString("en-NG", { maximumFractionDigits: 0 })}%</strong>.
              </p>
              {result.baitFlag ? (
                <div className="rounded-[var(--radius-input)] border border-risk-amber/40 bg-risk-amber-dim/20 px-3.5 py-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-risk-amber">
                    {result.baitFlag.level === "confirmed" ? "Bait-and-switch confirmed" : "Duration pattern"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed">{result.baitFlag.message}</p>
                </div>
              ) : null}
            </ResultPanel>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                sequence.reset();
              }}
            >
              Run another check
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-foreground-faint">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
