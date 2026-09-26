import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { RequestFeatureForm } from "@/components/RequestFeatureForm";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Request a feature — StaySoji",
  robots: { index: false, follow: false },
};

export default async function RequestFeaturePage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Request a feature" backHref="/dashboard" menu />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 pt-6 sm:px-8">
        <p className="mb-6 text-[14px] leading-relaxed text-foreground-dim">
          Tell us what&rsquo;s missing or what would help you avoid a bad loan. The team reads every request.
        </p>
        <RequestFeatureForm />
      </div>
    </div>
  );
}
