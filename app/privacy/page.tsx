import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Privacy Policy — StaySoji",
  description: "What StaySoji collects, why, and how it's used.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Privacy Policy" backHref="/" />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 sm:px-8">
        <div className="space-y-6 pt-6 text-[14.5px] leading-relaxed text-foreground-dim">
          <p className="text-[12px] text-foreground-faint">Last updated 25 September 2026.</p>

          <section>
            <h1 className="text-xl font-medium text-foreground">Privacy Policy</h1>
            <p className="mt-3">
              StaySoji is built to help you check a loan app, not to build a profile on you. This page describes
              plainly what we collect and why.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">The three checks</h2>
            <p className="mt-2">
              The true-cost calculator runs entirely in your browser. The numbers you type never leave your device.
            </p>
            <p className="mt-2">
              The loan-app lookup matches your search against a static dataset shipped with the app. Your search
              term is not logged or stored anywhere.
            </p>
            <p className="mt-2">
              The terms scanner sends the text you paste, or the page at the link you give it, to our server so it
              can be read and pattern-matched. That text is processed in memory to produce your result and is not
              written to a database. If the deployment has an AI provider key configured, the matched clauses (not
              your full document) are sent to that provider to generate a plain-language explanation; if no key is
              configured, everything happens with pattern matching alone and nothing leaves our server at all.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">If you create an account</h2>
            <p className="mt-2">
              Creating an account stores your email address and date of birth (used only to confirm you meet our
              minimum age requirement) with our authentication provider, Supabase. We use this to let you sign in
              and, in future, to save your check history to your own account. We do not sell this data or share it
              with advertisers. Account data is retained until you ask us to delete it &mdash; contact us and we
              will remove it.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Cookies and local storage</h2>
            <p className="mt-2">
              We store your light/dark preference in your browser&rsquo;s local storage, and, if you sign in, a
              session cookie so you stay signed in. Neither is used for tracking or advertising.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Hosting and processors</h2>
            <p className="mt-2">
              StaySoji is hosted on Vercel, which retains standard request logs (IP address, timestamp, path) for
              operating the service. Authentication and account data is processed by Supabase. Neither is used to
              build an advertising profile of you.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Advertising</h2>
            <p className="mt-2">
              StaySoji does not currently run advertising. If that changes, this page will be updated before any ad
              network is enabled, including what data that network collects.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about this policy, or a request to delete your data, go to the{" "}
              <a className="underline decoration-border-hairline underline-offset-2" href="/contact">
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
