"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeatureRequestAction, type FeatureRequestState } from "@/lib/auth/actions";
import { Button } from "@/components/Button";

const initialState: FeatureRequestState = { error: null, success: false };

export function RequestFeatureForm() {
  const [state, formAction, pending] = useActionState(submitFeatureRequestAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <label className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-foreground-dim">What would make StaySoji better for you?</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={2000}
          placeholder="e.g. Add support for checking group or cooperative loan apps…"
          className="w-full resize-none rounded-[var(--radius-input)] border border-border-hairline bg-surface-raised px-4 py-3 text-[14px] leading-relaxed text-foreground placeholder:text-foreground-faint focus:border-gold-500/70 focus:outline-none"
        />
      </label>

      {state.error ? <p className="text-[13px] text-risk-high">{state.error}</p> : null}
      {state.success ? <p className="text-[13px] text-risk-low">Thanks — we read every one of these.</p> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send feature request"}
      </Button>
    </form>
  );
}
