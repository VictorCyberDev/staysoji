import type { BarDatum } from "@/lib/auth/analytics";

/** A single-series horizontal meter list — one accent hue, track shows scale, value direct-labeled at the tip. */
export function BarList({ data, labelWidth = "w-16" }: { data: BarDatum[]; labelWidth?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <span className={`${labelWidth} shrink-0 truncate font-mono text-[11px] text-foreground-faint`}>{d.label}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-border-hairline/50">
            <div
              className="h-full rounded-full bg-gold-500 transition-[width] duration-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-6 text-right font-mono text-[12px] tabular-nums text-foreground-dim">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
