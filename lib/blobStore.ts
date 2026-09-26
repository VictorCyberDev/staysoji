import { get, put } from "@vercel/blob";

export function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: "private", token: blobToken() });
  if (!result || !result.stream) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeJsonBlob(
  pathname: string,
  data: unknown,
  options?: { allowOverwrite?: boolean },
): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: options?.allowOverwrite ?? false,
    token: blobToken(),
  });
}
