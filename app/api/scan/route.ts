import { NextRequest, NextResponse } from "next/server";
import { extractClauses, stripHtml, CATEGORY_LABEL, type FlaggedClause } from "@/lib/tcExtract";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_TEXT_LENGTH = 60_000;
const FETCH_TIMEOUT_MS = 8_000;

const BLOCKED_HOSTS = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|\[::1\]|::1)/i;
function isPrivateHost(hostname: string) {
  if (BLOCKED_HOSTS.test(hostname)) return true;
  const match = hostname.match(/^172\.(\d+)\./);
  if (match) {
    const second = Number(match[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

async function fetchUrlText(rawUrl: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https links are supported.");
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error("That host can't be fetched.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "StaySojiBot/1.0 (+https://staysoji.vercel.app) term-scanner",
        Accept: "text/html,text/plain",
      },
    });
    if (!res.ok) {
      throw new Error(`The page responded with ${res.status}. It may block automated requests.`);
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!/text\/html|text\/plain|application\/xhtml/.test(contentType)) {
      throw new Error("That link doesn't point to a readable page.");
    }
    const body = await res.text();
    return stripHtml(body);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("The page took too long to respond.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function enhanceWithLlm(clauses: FlaggedClause[]): Promise<Map<string, string> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || clauses.length === 0) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system:
          "You explain loan contract clauses to a Nigerian borrower reading them for the first time. For each numbered clause you're given, write exactly one plain, concrete sentence (max 28 words) explaining what it actually means for them if they sign. Do not soften the risk and do not invent details not present in the text. Reply with ONLY a JSON array of strings, same order and length as the input, no prose.",
        messages: [
          {
            role: "user",
            content: clauses.map((c, i) => `${i + 1}. [${CATEGORY_LABEL[c.category]}] "${c.sentence}"`).join("\n"),
          },
        ],
      }),
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (typeof text !== "string") return null;

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return null;

    const map = new Map<string, string>();
    clauses.forEach((c, i) => {
      if (typeof parsed[i] === "string") map.set(`${c.category}:${c.sentence}`, parsed[i]);
    });
    return map;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: { mode?: string; value?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { mode, value } = body;
  if (mode !== "text" && mode !== "url") {
    return NextResponse.json({ error: "mode must be 'text' or 'url'." }, { status: 400 });
  }
  if (!value || typeof value !== "string" || !value.trim()) {
    return NextResponse.json({ error: "Nothing to scan." }, { status: 400 });
  }

  let text: string;
  let source: string;
  try {
    if (mode === "url") {
      text = await fetchUrlText(value.trim());
      source = value.trim();
    } else {
      text = value;
      source = "Pasted text";
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not read that source." }, { status: 422 });
  }

  if (text.length < 40) {
    return NextResponse.json(
      { error: "That source doesn't have enough text to scan. Try pasting the terms directly." },
      { status: 422 },
    );
  }

  const trimmed = text.slice(0, MAX_TEXT_LENGTH);
  const extraction = extractClauses(trimmed);
  const explanations = await enhanceWithLlm(extraction.clauses);

  return NextResponse.json({
    source,
    truncated: text.length > MAX_TEXT_LENGTH,
    charCount: extraction.charCount,
    sentenceCount: extraction.sentenceCount,
    tone: extraction.tone,
    method: explanations ? "llm-enhanced" : "rule-based",
    clauses: extraction.clauses.map((c) => ({
      ...c,
      categoryLabel: CATEGORY_LABEL[c.category],
      explanation: explanations?.get(`${c.category}:${c.sentence}`) ?? null,
    })),
  });
}
