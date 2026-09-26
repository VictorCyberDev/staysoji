import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Calculator, MagnifyingGlass, FileMagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";
import { getSessionUser } from "@/lib/auth/session";
import { getHistory, type CheckType, type CheckTone } from "@/lib/history";

export const metadata: Metadata = {
  title: "History — StaySoji",
  robots: { index: false, follow: false },
};

const TYPE_ICON: Record<CheckType, typeof Calculator> = {
  calculate: Calculator,
  lookup: MagnifyingGlass,
  scan: FileMagnifyingGlass,
};

const TYPE_LABEL: Record<CheckType, string> = {
  calculate: "True cost",
  lookup: "Loan app lookup",
  scan: "Terms scan",
};

const TONE_CLASS: Record<CheckTone, string> = {
  low: "text-risk-low",
  amber: "text-risk-amber",
  high: "text-risk-high",
};

export default async function HistoryPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const entries = await getHistory(session.email);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="History" backHref="/dashboard" menu />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 pt-6 sm:px-8">
        {entries.length > 0 ? (
          <p className="mb-6 text-[14px] leading-relaxed text-foreground-dim">
            The last {entries.length} check{entries.length === 1 ? "" : "s"} you&rsquo;ve run, most recent first.
          </p>
        ) : null}

        {entries.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-8 text-center text-[13.5px] text-foreground-faint">
            No checks yet. Run a check from the dashboard and it&rsquo;ll show up here.
          </p>
        ) : (
          <ul className="divide-y divide-border-hairline border-t border-b border-border-hairline">
            {entries.map((entry) => {
              const Icon = TYPE_ICON[entry.type];
              return (
                <li key={entry.id} className="flex items-start gap-3 py-4">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-hairline ${TONE_CLASS[entry.tone]}`}
                  >
                    <Icon size={15} weight="light" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-foreground-faint">
                      {TYPE_LABEL[entry.type]}
                    </span>
                    <span className="mt-0.5 block truncate text-[13.5px] leading-snug text-foreground">
                      {entry.summary}
                    </span>
                    <span className="mt-1 block text-[11.5px] text-foreground-faint">
                      {new Date(entry.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
