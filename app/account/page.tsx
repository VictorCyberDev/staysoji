import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserCircle, ClockCounterClockwise, Lightbulb } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import { getSessionUser } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/store";
import { signOutAction } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Your account — StaySoji",
};

export default async function AccountPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const user = await findUserByEmail(session.email);
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Your account" backHref="/dashboard" menu />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 sm:px-8">
        <div className="flex flex-col items-center gap-3 pt-8 pb-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-hairline text-gold-400">
            <UserCircle size={28} />
          </span>
          <p className="text-[15px] font-medium text-foreground">{user.email}</p>
          <p className="text-[12.5px] text-foreground-faint">
            Member since {new Date(user.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <Link href="/dashboard" className="block">
          <Button className="w-full">Go to dashboard</Button>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/history"
            className="flex flex-col items-center gap-1.5 rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-4 py-4 text-center transition-colors hover:border-gold-500/60"
          >
            <ClockCounterClockwise size={18} className="text-gold-400" />
            <span className="text-[12.5px] font-medium text-foreground">History</span>
          </Link>
          <Link
            href="/request-feature"
            className="flex flex-col items-center gap-1.5 rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-4 py-4 text-center transition-colors hover:border-gold-500/60"
          >
            <Lightbulb size={18} className="text-gold-400" />
            <span className="text-[12.5px] font-medium text-foreground">Request a feature</span>
          </Link>
        </div>

        <form action={signOutAction} className="mt-4">
          <Button type="submit" variant="ghost" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
