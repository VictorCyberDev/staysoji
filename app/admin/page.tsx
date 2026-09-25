import type { Metadata } from "next";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/store";
import { calculateAge } from "@/lib/auth/age";
import { adminSignOutAction } from "@/lib/auth/actions";
import type { PublicUser } from "@/lib/auth/store";

export const metadata: Metadata = {
  title: "Admin — StaySoji",
  robots: { index: false, follow: false },
};

function computeStats(users: PublicUser[]) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const signupsLast7d = users.filter((u) => new Date(u.createdAt).getTime() >= sevenDaysAgo).length;
  const ages = users.map((u) => calculateAge(u.dateOfBirth)).filter((a) => a >= 0);
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null;
  return { signupsLast7d, avgAge };
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
  const { signupsLast7d, avgAge } = computeStats(users);

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

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatTile label="Total accounts" value={users.length} />
          <StatTile label="New, last 7 days" value={signupsLast7d} />
          <StatTile label="Average age" value={avgAge ?? "—"} />
        </div>

        <div className="mt-8">
          {users.length === 0 ? (
            <p className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-8 text-center text-[13.5px] text-foreground-faint">
              No accounts yet.
            </p>
          ) : (
            <div className="divide-y divide-border-hairline border-t border-b border-border-hairline">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-1 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground-faint">
                <span>Email</span>
                <span>Age</span>
                <span>Joined</span>
              </div>
              {users.map((u) => (
                <div key={u.email} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-1 py-3">
                  <span className="truncate text-[13.5px] text-foreground">{u.email}</span>
                  <span className="font-mono text-[13px] text-foreground-dim">{calculateAge(u.dateOfBirth)}</span>
                  <span className="whitespace-nowrap font-mono text-[12px] text-foreground-faint">
                    {new Date(u.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
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
