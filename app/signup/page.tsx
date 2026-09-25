"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type FormState } from "@/lib/auth/actions";
import { Field, TextInput } from "@/components/Field";
import { Button } from "@/components/Button";

const initialState: FormState = { error: null };

function maxDobForMinAge(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-16 sm:px-8 opacity-0 [animation:fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="pt-6 pb-8">
        <h1 className="text-xl font-medium text-foreground">Create your account</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-foreground-dim">
          Optional today, but it&rsquo;s how your check history gets saved once that ships. You must be 18 or older.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <Field label="Email">
          <TextInput type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Password" helper="At least 8 characters.">
          <TextInput type="password" name="password" autoComplete="new-password" required minLength={8} />
        </Field>
        <Field label="Date of birth">
          <TextInput type="date" name="dob" required max={maxDobForMinAge(18)} min="1930-01-01" />
        </Field>

        {state.error ? <p className="text-[13px] text-risk-high">{state.error}</p> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-foreground-faint">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-400 underline underline-offset-2">
          Sign in
        </Link>
      </p>

      <p className="mt-8 text-[11.5px] leading-relaxed text-foreground-faint">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="underline decoration-border-hairline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline decoration-border-hairline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
