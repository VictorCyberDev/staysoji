import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/store";
import { calculateAge } from "@/lib/auth/age";

export const runtime = "nodejs";

const COLUMNS = ["email", "age", "dateOfBirth", "createdAt", "source", "utmSource", "utmMedium", "utmCampaign", "referrer"] as const;

function csvCell(value: string | number | null): string {
  const str = value === null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET() {
  const authed = await getAdminSession();
  if (!authed) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const users = await listUsers();
  const rows = users.map((u) =>
    [u.email, calculateAge(u.dateOfBirth), u.dateOfBirth, u.createdAt, u.source, u.utmSource, u.utmMedium, u.utmCampaign, u.referrer]
      .map(csvCell)
      .join(","),
  );
  const csv = [COLUMNS.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="staysoji-signups-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
