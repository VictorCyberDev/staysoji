import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { appendHistoryEntry, type CheckType, type CheckTone } from "@/lib/history";

export const runtime = "nodejs";

const VALID_TYPES: CheckType[] = ["calculate", "lookup", "scan"];
const VALID_TONES: CheckTone[] = ["low", "amber", "high"];

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ saved: false }, { status: 200 });

  const body = await request.json().catch(() => null);
  const type = body?.type;
  const summary = typeof body?.summary === "string" ? body.summary.trim().slice(0, 200) : "";
  const tone = body?.tone;

  if (!VALID_TYPES.includes(type) || !summary || !VALID_TONES.includes(tone)) {
    return NextResponse.json({ error: "Invalid history entry." }, { status: 400 });
  }

  try {
    await appendHistoryEntry(session.email, { type, summary, tone });
  } catch {
    return NextResponse.json({ error: "Could not save this check." }, { status: 500 });
  }
  return NextResponse.json({ saved: true });
}
