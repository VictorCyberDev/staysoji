import { cookies } from "next/headers";
import { signToken, verifyToken } from "./crypto";

const SESSION_COOKIE = "staysoji_session";
const ADMIN_COOKIE = "staysoji_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const ADMIN_MAX_AGE = 60 * 60 * 8; // 8 hours

type SessionPayload = { email: string; exp: number };
type AdminPayload = { admin: true; exp: number };

export async function getSessionUser(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = verifyToken<SessionPayload>(token);
  return payload ? { email: payload.email } : null;
}

export async function setSessionCookie(email: string) {
  const store = await cookies();
  const token = signToken({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 } satisfies SessionPayload);
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const payload = verifyToken<AdminPayload>(token);
  return Boolean(payload?.admin);
}

export async function setAdminSessionCookie() {
  const store = await cookies();
  const token = signToken({ admin: true, exp: Date.now() + ADMIN_MAX_AGE * 1000 } satisfies AdminPayload);
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
