import dataset from "@/data/loan-apps.json";

export type BlacklistedApp = {
  name: string;
  score: number;
  reason: string;
  action_date: string;
};

export type ApprovedAlternative = {
  name: string;
  note: string;
};

export type LookupMatch = {
  matched: true;
  app: BlacklistedApp;
  tone: "amber" | "high";
  sources: string[];
  methodology: string;
};

export type LookupNoMatch = {
  matched: false;
  query: string;
  sources: string[];
};

export type LookupResult = LookupMatch | LookupNoMatch;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

/** Small edit-distance check so "camel loan" still finds "Camelloan". */
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function scoreToTone(score: number): "amber" | "high" {
  return score >= 9 ? "high" : "amber";
}

export function searchLoanApp(query: string): LookupResult {
  const apps = dataset.blacklisted_apps as BlacklistedApp[];
  const q = normalize(query);

  if (!q) {
    return { matched: false, query, sources: dataset.sources };
  }

  const qCompact = q.replace(/\s+/g, "");

  let best: { app: BlacklistedApp; distance: number } | null = null;

  for (const app of apps) {
    const name = normalize(app.name);
    const nameCompact = name.replace(/\s+/g, "");

    if (name === q || nameCompact === qCompact) {
      best = { app, distance: 0 };
      break;
    }

    if (name.includes(q) || q.includes(name) || nameCompact.includes(qCompact) || qCompact.includes(nameCompact)) {
      const distance = Math.abs(name.length - q.length);
      if (!best || distance < best.distance) best = { app, distance };
      continue;
    }

    const distance = levenshtein(qCompact, nameCompact);
    const threshold = Math.max(2, Math.floor(nameCompact.length * 0.28));
    if (distance <= threshold) {
      if (!best || distance < best.distance) best = { app, distance };
    }
  }

  if (best) {
    return {
      matched: true,
      app: best.app,
      tone: scoreToTone(best.app.score),
      sources: dataset.sources,
      methodology: dataset.methodology,
    };
  }

  return { matched: false, query, sources: dataset.sources };
}

export function getAlternatives(count = 3): ApprovedAlternative[] {
  const all = dataset.approved_alternatives as ApprovedAlternative[];
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function allApprovedAlternatives(): ApprovedAlternative[] {
  return dataset.approved_alternatives as ApprovedAlternative[];
}
