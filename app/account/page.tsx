import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
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
      <TopBar title="Your account" backHref="/" />
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

        <div className="rounded-[var(--radius-card)] border border-border-hairline bg-surface/60 px-5 py-5 text-[13.5px] leading-relaxed text-foreground-dim">
          Check history isn&rsquo;t saved to your account yet in this build &mdash; the three checks stay
          anonymous and client-side for now. That&rsquo;s next on the roadmap.
        </div>

        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="ghost" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
