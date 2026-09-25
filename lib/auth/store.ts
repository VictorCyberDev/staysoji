import { createHash } from "node:crypto";
import { put, get, list } from "@vercel/blob";
import { hashPassword } from "./crypto";

export type StoredUser = {
  email: string;
  passwordHash: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  createdAt: string; // ISO timestamp
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

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

export async function createUser(email: string, password: string, dateOfBirth: string): Promise<PublicUser> {
  const key = userKey(email);
  const existing = await findUserByEmail(email);
  if (existing) throw new UserExistsError();

  const user: StoredUser = {
    email: normalizeEmail(email),
    passwordHash: await hashPassword(password),
    dateOfBirth,
    createdAt: new Date().toISOString(),
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
      const { passwordHash: _passwordHash, ...rest } = user;
      void _passwordHash;
      return rest;
    }),
  );
  return users.filter((u): u is PublicUser => u !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
