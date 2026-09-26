import { createHash, randomUUID } from "node:crypto";
import { readJsonBlob, writeJsonBlob } from "./blobStore";

export type CheckType = "calculate" | "lookup" | "scan";
export type CheckTone = "low" | "amber" | "high";

export type HistoryEntry = {
  id: string;
  type: CheckType;
  summary: string;
  tone: CheckTone;
  createdAt: string;
};

const MAX_ENTRIES = 50;

function historyKey(email: string): string {
  const hash = createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  return `history/${hash}.json`;
}

export async function getHistory(email: string): Promise<HistoryEntry[]> {
  return (await readJsonBlob<HistoryEntry[]>(historyKey(email))) ?? [];
}

export async function appendHistoryEntry(
  email: string,
  entry: { type: CheckType; summary: string; tone: CheckTone },
): Promise<void> {
  const existing = await getHistory(email);
  const next: HistoryEntry[] = [
    { ...entry, id: randomUUID(), createdAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_ENTRIES);
  await writeJsonBlob(historyKey(email), next, { allowOverwrite: true });
}
