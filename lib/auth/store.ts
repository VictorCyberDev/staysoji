import { createHash } from "node:crypto";
import { put, get, list } from "@vercel/blob";
import { hashPassword } from "./crypto";

export type StoredUser = {
  email: string;
  passwordHash: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  createdAt: string; // ISO timestamp
  /** Where this signup came from, for marketing attribution. */
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

export type NewUserInput = {
  email: string;
  password: string;
  dateOfBirth: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function userKey(email: string): string {
  const hash = createHash("sha256").update(normalizeEmail(email)).digest("hex");
  return `users/${hash}.json`;
}

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function clean(value: string | null | undefined, maxLength = 120): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

/** utm_source wins; otherwise the referrer's hostname; otherwise "Direct". */
function deriveSource(utmSource: string | null, referrer: string | null): string {
  if (utmSource) return utmSource;
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (host) return host;
    } catch {
      // not a parseable URL; fall through to Direct
    }
  }
  return "Direct";
}

async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: "private", token: blobToken() });
  if (!result || !result.stream) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  return readJsonBlob<StoredUser>(userKey(email));
}

export class UserExistsError extends Error {
  constructor() {
    super("An account with this email already exists.");
  }
}

export async function createUser(input: NewUserInput): Promise<PublicUser> {
  const key = userKey(input.email);
  const existing = await findUserByEmail(input.email);
  if (existing) throw new UserExistsError();

  const utmSource = clean(input.utmSource);
  const referrer = clean(input.referrer, 300);

  const user: StoredUser = {
    email: normalizeEmail(input.email),
    passwordHash: await hashPassword(input.password),
    dateOfBirth: input.dateOfBirth,
    createdAt: new Date().toISOString(),
    source: deriveSource(utmSource, referrer),
    utmSource,
    utmMedium: clean(input.utmMedium),
    utmCampaign: clean(input.utmCampaign),
    referrer,
  };

  await put(key, JSON.stringify(user), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    token: blobToken(),
  });

  const { passwordHash: _passwordHash, ...publicUser } = user;
  void _passwordHash;
  return publicUser;
}

export async function listUsers(): Promise<PublicUser[]> {
  const { blobs } = await list({ prefix: "users/", token: blobToken() });
  const users = await Promise.all(
    blobs.map(async (b) => {
      const user = await readJsonBlob<StoredUser>(b.pathname);
      if (!user) return null;
      const { passwordHash: _passwordHash, source, utmSource, utmMedium, utmCampaign, referrer, ...base } = user;
      void _passwordHash;
      // older records predate acquisition tracking; backfill so callers never
      // have to null-check a field that used to not exist
      return {
        ...base,
        source: source ?? "Direct",
        utmSource: utmSource ?? null,
        utmMedium: utmMedium ?? null,
        utmCampaign: utmCampaign ?? null,
        referrer: referrer ?? null,
      } satisfies PublicUser;
    }),
  );
  return users.filter((u): u is PublicUser => u !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
