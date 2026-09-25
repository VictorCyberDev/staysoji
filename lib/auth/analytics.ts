import type { PublicUser } from "./store";
import { calculateAge } from "./age";

export type BarDatum = { label: string; value: number };

/** Daily signup counts for the trailing `days` days, oldest first, zero-filled. */
export function signupsByDay(users: PublicUser[], days: number, now = new Date()): BarDatum[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of users) {
    const day = u.createdAt.slice(0, 10);
    if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([iso, value]) => ({
    label: new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
    value,
  }));
}

const AGE_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "18-24", min: 18, max: 24 },
  { label: "25-34", min: 25, max: 34 },
  { label: "35-44", min: 35, max: 44 },
  { label: "45-54", min: 45, max: 54 },
  { label: "55+", min: 55, max: Infinity },
];

export function ageDistribution(users: PublicUser[]): BarDatum[] {
  const counts = AGE_BUCKETS.map((b) => ({ label: b.label, value: 0 }));
  for (const u of users) {
    const age = calculateAge(u.dateOfBirth);
    const idx = AGE_BUCKETS.findIndex((b) => age >= b.min && age <= b.max);
    if (idx >= 0) counts[idx].value += 1;
  }
  return counts;
}

/** Acquisition source breakdown, largest first; long tails fold into "Other". */
export function sourceBreakdown(users: PublicUser[], limit = 6): BarDatum[] {
  const counts = new Map<string, number>();
  for (const u of users) {
    counts.set(u.source, (counts.get(u.source) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  if (sorted.length <= limit) return sorted;
  const top = sorted.slice(0, limit - 1);
  const otherCount = sorted.slice(limit - 1).reduce((sum, s) => sum + s.value, 0);
  return [...top, { label: "Other", value: otherCount }];
}
