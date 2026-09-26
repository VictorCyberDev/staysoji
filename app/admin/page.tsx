import type { Metadata } from "next";
import { SignOut, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { BarList } from "@/components/BarList";
import { getAdminSession } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/store";
import { calculateAge } from "@/lib/auth/age";
import { signupsByDay, ageDistribution, sourceBreakdown } from "@/lib/auth/analytics";
import { adminSignOutAction } from "@/lib/auth/actions";
import { listFeatureRequests } from "@/lib/featureRequests";
import type { PublicUser } from "@/lib/auth/store";

export const metadata: Metadata = {
  title: "Admin — StaySoji",
  robots: { index: false, follow: false },
};

function computeStats(users: PublicUser[]) {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const signupsLast7d = users.filter((u) => new Date(u.createdAt).getTime() >= sevenDaysAgo).length;
  const signupsLast30d = users.filter((u) => new Date(u.createdAt).getTime() >= thirtyDaysAgo).length;
  const ages = users.map((u) => calculateAge(u.dateOfBirth)).filter((a) => a >= 0);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;
  return { signupsLast7d, signupsLast30d, avgAge };
}

export default async function AdminPage() {
  const authed = await getAdminSession();

  if (!authed) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Admin" backHref="/" />
        <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 pt-8 sm:px-8">
          <h1 className="text-xl font-medium text-foreground">Admin sign in</h1>
          <p className="mt-2 mb-6 text-[14px] leading-relaxed text-foreground-dim">
            Restricted to the StaySoji team.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  const users = await listUsers();
  const { signupsLast7d, signupsLast30d, avgAge } = computeStats(users);
  const dailySignups = signupsByDay(users, 14);
  const ages = ageDistribution(users);
  const sources = sourceBreakdown(users);
  const featureRequests = await listFeatureRequests();

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Admin" backHref="/" />
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-foreground">Signups</h1>
          <form action={adminSignOutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[12.5px] text-foreground-faint transition-colors hover:text-foreground-dim"
            >
              <SignOut size={14} /> Sign out
            </button>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total accounts" value={users.length} />
          <StatTile label="New, last 7 days" value={signupsLast7d} />
          <StatTile label="New, last 30 days" value={signupsLast30d} />
          <StatTile label="Average age" value={avgAge ?? "—"} />
        </div>

        <a
          href="/api/admin/export"
          className="mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-border-hairline px-4 py-2.5 text-[13px] font-medium text-foreground-dim transition-colors hover:border-gold-500/60 hover:text-foreground"
        >
          <DownloadSimple size={15} />
          Export all signups as CSV
        </a>

        {users.length > 0 ? (
          <div className="mt-8 space-y-8">
            <Section title="Signups, last 14 days">
              <BarList data={dailySignups} labelWidth="w-12" />
            </Section>

            <Section title="Where signups come from" subtitle="From utm_source, or the referring site otherwise.">
              <BarList data={sources} labelWidth="w-24" />
            </Section>

            <Section title="Age distribution">
              <BarList data={ages} labelWidth="w-12" />
            </Section>
          </div>
        ) : null}

        <div className="mt-8">
          {users.length === 0 ? (
            <p className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-8 text-center text-[13.5px] text-foreground-faint">
              No accounts yet.
            </p>
          ) : (
            <div className="divide-y divide-border-hairline border-t border-b border-border-hairline">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-1 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground-faint">
                <span>Email</span>
                <span>Age</span>
                <span>Source</span>
                <span>Joined</span>
              </div>
              {users.map((u) => (
                <div key={u.email} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-1 py-3">
                  <span className="truncate text-[13.5px] text-foreground">{u.email}</span>
                  <span className="font-mono text-[13px] text-foreground-dim">{calculateAge(u.dateOfBirth)}</span>
                  <span className="truncate text-[12px] text-foreground-faint">{u.source}</span>
                  <span className="whitespace-nowrap font-mono text-[12px] text-foreground-faint">
                    {new Date(u.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="flex items-baseline gap-2 text-[15px] font-medium text-foreground">
            Feature requests
            <span className="font-mono text-[12px] font-normal text-foreground-faint">{featureRequests.length}</span>
          </h2>
          {featureRequests.length === 0 ? (
            <p className="mt-3 rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-8 text-center text-[13.5px] text-foreground-faint">
              No feature requests yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {featureRequests.map((r) => (
                <li key={r.id} className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-4">
                  <p className="text-[13.5px] leading-relaxed text-foreground">{r.message}</p>
                  <p className="mt-2 font-mono text-[11px] text-foreground-faint">
                    {r.email} &middot;{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--radius-input)] border border-border-hairline bg-surface/60 px-3.5 py-3.5">
      <p className="font-mono text-[20px] leading-none text-foreground">{value}</p>
      <p className="mt-1.5 text-[11px] leading-snug text-foreground-faint">{label}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-5">
      <p className="text-[13px] font-medium text-foreground">{title}</p>
      {subtitle ? <p className="mt-0.5 text-[11.5px] text-foreground-faint">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}
