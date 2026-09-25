export type ClauseCategory = "late_fee" | "third_party_contact" | "rollover";

export type FlaggedClause = {
  category: ClauseCategory;
  sentence: string;
  matchedTerm: string;
};

export type ExtractionResult = {
  clauses: FlaggedClause[];
  charCount: number;
  sentenceCount: number;
  tone: "low" | "amber" | "high";
};

const CATEGORY_LABEL: Record<ClauseCategory, string> = {
  late_fee: "Late fee / penalty",
  third_party_contact: "Third-party contact rights",
  rollover: "Rollover / renewal trap",
};

export { CATEGORY_LABEL };

type Pattern = { category: ClauseCategory; regex: RegExp };

// Each pattern targets language that is common in Nigerian loan-app T&Cs.
// Matching is deliberately literal against the pasted/fetched text, not a
// canned response: whatever the user supplies is what gets scanned.
const PATTERNS: Pattern[] = [
  { category: "late_fee", regex: /late\s+(fee|payment|charge|penalt\w*)/i },
  { category: "late_fee", regex: /(penalt\w*|surcharge)\s+(of|shall|will|is|are)/i },
  { category: "late_fee", regex: /daily\s+(interest|penalty|charge)/i },
  { category: "late_fee", regex: /compound(ed|ing)?\s+(daily|interest)/i },
  { category: "late_fee", regex: /overdue\s+(amount|balance|payment)/i },
  { category: "late_fee", regex: /\bper\s+day\s+(late|overdue|penalty)/i },

  { category: "third_party_contact", regex: /(contact|phone)\s?(list|book)/i },
  { category: "third_party_contact", regex: /address\s?book/i },
  { category: "third_party_contact", regex: /(emergency\s+contact|next\s+of\s+kin)/i },
  { category: "third_party_contact", regex: /(notify|inform|reach\s+out\s+to|contact)\s+(your\s+)?(contacts|references|family|employer|guarantor)/i },
  { category: "third_party_contact", regex: /share\s+your\s+(contacts|information|data)\s+with/i },
  { category: "third_party_contact", regex: /access\s+to\s+your\s+(contacts|phonebook|call\s+log|sms)/i },

  { category: "rollover", regex: /roll(ed|ing)?[\s-]?over/i },
  { category: "rollover", regex: /auto(matic(ally)?)?[\s-]?renew/i },
  { category: "rollover", regex: /extend(ed|s)?\s+(the|your)\s+loan/i },
  { category: "rollover", regex: /renewal\s+fee/i },
  { category: "rollover", regex: /re-?loan(ed|ing)?/i },
  { category: "rollover", regex: /new\s+loan\s+(is\s+)?(automatically\s+)?(issued|created|opened)/i },
];

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
}

export function extractClauses(rawText: string): ExtractionResult {
  const text = rawText.slice(0, 20000);
  const sentences = splitSentences(text);
  const clauses: FlaggedClause[] = [];
  const seen = new Set<string>();

  for (const sentence of sentences) {
    for (const { category, regex } of PATTERNS) {
      const match = sentence.match(regex);
      if (match) {
        const key = `${category}:${sentence.slice(0, 60)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        clauses.push({ category, sentence: sentence.slice(0, 320), matchedTerm: match[0] });
        break;
      }
    }
  }

  const categories = new Set(clauses.map((c) => c.category));
  const tone: ExtractionResult["tone"] =
    categories.size >= 2 ? "high" : categories.size === 1 ? "amber" : "low";

  return { clauses, charCount: text.length, sentenceCount: sentences.length, tone };
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
