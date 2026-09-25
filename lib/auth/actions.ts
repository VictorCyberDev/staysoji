"use server";

import { redirect } from "next/navigation";
import { createUser, findUserByEmail, UserExistsError } from "./store";
import { verifyPassword } from "./crypto";
import { setSessionCookie, clearSessionCookie } from "./session";

export type FormState = { error: string | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 18;

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const dateOfBirth = String(formData.get("dob") || "");

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!dateOfBirth) return { error: "Enter your date of birth." };

  const age = calculateAge(dateOfBirth);
  if (age < 0) return { error: "That date of birth doesn't look right." };
  if (age < MIN_AGE) return { error: `You must be at least ${MIN_AGE} to create a StaySoji account.` };

  try {
    await createUser(email, password, dateOfBirth);
  } catch (err) {
    if (err instanceof UserExistsError) return { error: err.message };
    return { error: "Something went wrong creating your account. Try again." };
  }

  await setSessionCookie(email);
  redirect("/account");
}

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Enter your email and password." };

  const user = await findUserByEmail(email);
  if (!user) return { error: "No account matches that email and password." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "No account matches that email and password." };

  await setSessionCookie(email);
  redirect("/account");
}

export async function signOutAction() {
  await clearSessionCookie();
  redirect("/");
}
