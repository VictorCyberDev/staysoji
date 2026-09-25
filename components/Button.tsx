import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] px-6 py-3 text-[14.5px] font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const styles =
    variant === "primary"
      ? "bg-gold-500 text-teal-950 hover:bg-gold-400"
      : "border border-border-hairline text-foreground-dim hover:border-gold-500/50 hover:text-foreground";

  return <button {...props} className={`${base} ${styles} ${className}`} />;
}
