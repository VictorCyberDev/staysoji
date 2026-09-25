"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";

export function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-[var(--radius-input)] border border-border-hairline bg-surface-raised px-4 py-3 pr-11 text-[15px] text-foreground placeholder:text-foreground-faint focus:border-gold-500/70 focus:outline-none ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-foreground-faint transition-colors hover:text-foreground-dim"
      >
        {visible ? <EyeSlash size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
