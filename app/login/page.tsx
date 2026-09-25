"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type FormState } from "@/lib/auth/actions";
import { Field, TextInput } from "@/components/Field";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/Button";

const initialState: FormState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-16 sm:px-8 opacity-0 [animation:fade-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="pt-6 pb-8">
        <h1 className="text-xl font-medium text-foreground">Welcome back</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-foreground-dim">Sign in to your StaySoji account.</p>
      </div>

      <form action={formAction} className="space-y-5">
        <Field label="Email">
          <TextInput type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <PasswordInput name="password" autoComplete="current-password" required />
        </Field>

        {state.error ? <p className="text-[13px] text-risk-high">{state.error}</p> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-foreground-faint">
        New to StaySoji?{" "}
        <Link href="/signup" className="text-gold-400 underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}
