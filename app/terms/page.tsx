import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Terms of Service — StaySoji",
  description: "The terms for using StaySoji.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Terms of Service" backHref="/" />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 sm:px-8">
        <div className="space-y-6 pt-6 text-[14.5px] leading-relaxed text-foreground-dim">
          <p className="text-[12px] text-foreground-faint">Last updated 25 September 2026.</p>

          <section>
            <h1 className="text-xl font-medium text-foreground">Terms of Service</h1>
            <p className="mt-3">By using StaySoji, you agree to the following.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Not financial or legal advice</h2>
            <p className="mt-2">
              StaySoji is an informational tool. Its APR calculation, risk scores, and clause flags are decision
              support, not a recommendation to borrow or not borrow from any specific lender, and not a substitute
              for professional financial or legal advice.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Data accuracy</h2>
            <p className="mt-2">
              The loan-app lookup reflects a curated dataset of publicly documented FCCPC and Google Play delisting
              actions, current as of when it was compiled. It is not exhaustive &mdash; most loan apps in
              circulation are not in it &mdash; and an app not appearing in a search is not a certification of
              safety. A risk score reflects the regulatory action cited with it, not our editorial opinion of the
              company.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Minimum age</h2>
            <p className="mt-2">
              You must be at least 18 years old to create a StaySoji account, consistent with the minimum age to
              enter a consumer credit agreement in Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Acceptable use</h2>
            <p className="mt-2">
              Don&rsquo;t use the terms scanner to fetch pages you don&rsquo;t have the right to access, attempt to
              overload or scrape the service, or use any part of StaySoji to build a competing product without
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Liability</h2>
            <p className="mt-2">
              StaySoji is provided as-is, without warranty of any kind. To the fullest extent permitted by law, we
              are not liable for any decision you make based on a result shown here, including a loan agreement you
              enter into or decline.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Changes</h2>
            <p className="mt-2">
              We may update these terms as the product changes. Material changes will be reflected by updating the
              date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about these terms go to the{" "}
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
