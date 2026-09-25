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

export type Suggestion = {
  name: string;
  kind: "blacklisted" | "approved";
};

export type LookupMatch = {
  matched: true;
  kind: "blacklisted";
  app: BlacklistedApp;
  tone: "amber" | "high";
  sources: string[];
  methodology: string;
};

export type LookupApproved = {
  matched: true;
  kind: "approved";
  app: ApprovedAlternative;
  tone: "low";
  sources: string[];
};

export type LookupNoMatch = {
  matched: false;
  query: string;
  sources: string[];
  coverageNote: string;
  suggestions: Suggestion[];
};

export type LookupResult = LookupMatch | LookupApproved | LookupNoMatch;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

/** Classic edit-distance so "camel loan" still finds "Camelloan". */
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

type IndexEntry = {
  name: string;
  normalized: string;
  compact: string;
  kind: "blacklisted" | "approved";
  ref: BlacklistedApp | ApprovedAlternative;
};

function buildIndex(): IndexEntry[] {
  const apps = dataset.blacklisted_apps as BlacklistedApp[];
  const alts = dataset.approved_alternatives as ApprovedAlternative[];
  return [
    ...apps.map((app): IndexEntry => ({
      name: app.name,
      normalized: normalize(app.name),
      compact: normalize(app.name).replace(/\s+/g, ""),
      kind: "blacklisted",
      ref: app,
    })),
    ...alts.map((alt): IndexEntry => ({
      name: alt.name,
      normalized: normalize(alt.name),
      compact: normalize(alt.name).replace(/\s+/g, ""),
      kind: "approved",
      ref: alt,
    })),
  ];
}

const INDEX = buildIndex();

/** 0 = identical, larger = further apart. Substring containment scores best after exact match. */
function similarity(query: string, queryCompact: string, entry: IndexEntry): number {
  if (entry.normalized === query || entry.compact === queryCompact) return 0;
  if (entry.normalized.includes(query) || query.includes(entry.normalized)) {
    return 0.5 + Math.abs(entry.normalized.length - query.length) / Math.max(entry.normalized.length, query.length, 1) / 4;
  }
  const distance = levenshtein(queryCompact, entry.compact);
  return distance / Math.max(entry.compact.length, queryCompact.length, 1);
}

function rankCandidates(query: string, limit: number): { entry: IndexEntry; score: number }[] {
  const q = normalize(query);
  const qCompact = q.replace(/\s+/g, "");
  return INDEX.map((entry) => ({ entry, score: similarity(q, qCompact, entry) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

export function scoreToTone(score: number): "amber" | "high" {
  return score >= 9 ? "high" : "amber";
}

const MATCH_THRESHOLD = 0.34; // confident enough to show as a direct result
const SUGGEST_THRESHOLD = 0.6; // close enough to offer as "did you mean"

export function searchLoanApp(query: string): LookupResult {
  const q = normalize(query);
  if (!q) {
    return {
      matched: false,
      query,
      sources: dataset.sources,
      coverageNote: dataset.coverage_note,
      suggestions: [],
    };
  }

  const ranked = rankCandidates(query, 6);
  const best = ranked[0];

  if (best && best.score <= MATCH_THRESHOLD) {
    if (best.entry.kind === "blacklisted") {
      const app = best.entry.ref as BlacklistedApp;
      return {
        matched: true,
        kind: "blacklisted",
        app,
        tone: scoreToTone(app.score),
        sources: dataset.sources,
        methodology: dataset.methodology,
      };
    }
    return {
      matched: true,
      kind: "approved",
      app: best.entry.ref as ApprovedAlternative,
      tone: "low",
      sources: dataset.sources,
    };
  }

  const suggestions: Suggestion[] = ranked
    .filter((r) => r.score <= SUGGEST_THRESHOLD)
    .slice(0, 4)
    .map((r) => ({ name: r.entry.name, kind: r.entry.kind }));

  return {
    matched: false,
    query,
    sources: dataset.sources,
    coverageNote: dataset.coverage_note,
    suggestions,
  };
}

export function getAlternatives(count = 3): ApprovedAlternative[] {
  const all = dataset.approved_alternatives as ApprovedAlternative[];
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function allApprovedAlternatives(): ApprovedAlternative[] {
  return dataset.approved_alternatives as ApprovedAlternative[];
}

/** Powers the live autocomplete dropdown as the user types. */
export function suggestNames(query: string, limit = 6): Suggestion[] {
  if (!normalize(query)) return [];
  return rankCandidates(query, limit)
    .filter((r) => r.score <= SUGGEST_THRESHOLD)
    .map((r) => ({ name: r.entry.name, kind: r.entry.kind }));
}
