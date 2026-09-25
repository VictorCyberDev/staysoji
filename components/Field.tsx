import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  helper,
  error,
  suffix,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  suffix?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-foreground-dim">{label}</span>
      <div className="relative">
        {children}
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-foreground-faint">
            {suffix}
          </span>
        ) : null}
      </div>
      {helper && !error ? <span className="text-[12px] text-foreground-faint">{helper}</span> : null}
      {error ? <span className="text-[12px] text-risk-high">{error}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-[var(--radius-input)] border border-border-hairline bg-surface-raised px-4 py-3 text-[15px] text-foreground placeholder:text-foreground-faint focus:border-gold-500/70 focus:outline-none ${props.className ?? ""}`}
    />
  );
}
