import { list } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { blobToken, readJsonBlob, writeJsonBlob } from "./blobStore";

export type FeatureRequest = {
  id: string;
  email: string;
  message: string;
  createdAt: string;
};

function requestKey(id: string): string {
  return `feature-requests/${id}.json`;
}

export async function submitFeatureRequest(email: string, message: string): Promise<void> {
  const id = randomUUID();
  const entry: FeatureRequest = { id, email, message, createdAt: new Date().toISOString() };
  await writeJsonBlob(requestKey(id), entry);
}

export async function listFeatureRequests(): Promise<FeatureRequest[]> {
  const { blobs } = await list({ prefix: "feature-requests/", token: blobToken() });
  const requests = await Promise.all(blobs.map((b) => readJsonBlob<FeatureRequest>(b.pathname)));
  return requests
    .filter((r): r is FeatureRequest => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
