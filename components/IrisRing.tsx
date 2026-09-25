"use client";

import { Check, Warning, X } from "@phosphor-icons/react/dist/ssr";

export type IrisTone = "low" | "amber" | "high";
export type IrisStatus = "idle" | "checking" | "result" | "error";

const TONE_VAR: Record<IrisTone, string> = {
  low: "var(--risk-low)",
  amber: "var(--risk-amber)",
  high: "var(--risk-high)",
};

const TONE_ICON: Record<IrisTone, React.ReactNode> = {
  low: <Check weight="bold" />,
  amber: <Warning weight="bold" />,
  high: <X weight="bold" />,
};

export function IrisRing({
  status,
  activeLabel,
  activeIndex = 0,
  stepCount = 3,
  tone,
  size = 220,
}: {
  status: IrisStatus;
  activeLabel?: string | null;
  activeIndex?: number;
  stepCount?: number;
  tone?: IrisTone;
  size?: number;
}) {
  const progress = status === "checking" ? (activeIndex + 1) / Math.max(stepCount, 1) : status === "result" || status === "error" ? 1 : 0;

  const baseRadius = 40;
  const minRadius = 26;
  const radius = status === "idle" ? baseRadius : baseRadius - progress * (baseRadius - minRadius);
  const rotation = progress * 30;
  const circumference = 2 * Math.PI * radius;
  const isLocked = status === "result";
  const isError = status === "error";

  const strokeColor = isLocked && tone ? TONE_VAR[tone] : isError ? "var(--risk-amber)" : "var(--gold-500)";
  const strokeWidth = isLocked || isError ? 3.5 : 1.6;
  const dashArray = isLocked || isError ? undefined : `${circumference / 34} ${circumference / 58}`;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        status === "idle"
          ? "StaySoji, at rest"
          : status === "checking"
            ? `Checking: ${activeLabel ?? ""}`
            : status === "result" && tone
              ? `Result: ${tone === "low" ? "low risk" : tone === "amber" ? "caution" : "high risk"}`
              : "Something went wrong"
      }
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={status === "idle" ? "animate-[iris-breathe_4.5s_ease-in-out_infinite]" : ""}
        style={{ ["--result-color" as string]: strokeColor }}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          transform={`rotate(${rotation} 50 50)`}
          style={{
            transition:
              "r 700ms cubic-bezier(0.16, 1, 0.3, 1), stroke 500ms ease, stroke-width 500ms ease, transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {isLocked && tone ? (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[15px]"
            style={{ color: strokeColor }}
          >
            {TONE_ICON[tone]}
          </span>
        ) : isError ? (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[15px]"
            style={{ color: strokeColor }}
          >
            <Warning weight="bold" />
          </span>
        ) : null}
      </div>

      <div className="absolute -bottom-9 left-1/2 h-5 w-full max-w-[220px] -translate-x-1/2 text-center">
        {status === "checking" && activeLabel ? (
          <p
            key={activeLabel}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-dim"
            style={{ animation: "iris-label-in 380ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
            aria-live="polite"
          >
            {activeLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
