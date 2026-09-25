"use client";

import { useActionState } from "react";
import { adminSignInAction, type FormState } from "@/lib/auth/actions";
import { Field, TextInput } from "@/components/Field";
import { Button } from "@/components/Button";

const initialState: FormState = { error: null };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminSignInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Username">
        <TextInput type="text" name="username" autoComplete="username" required />
      </Field>
      <Field label="Password">
        <TextInput type="password" name="password" autoComplete="current-password" required />
      </Field>
      {state.error ? <p className="text-[13px] text-risk-high">{state.error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
