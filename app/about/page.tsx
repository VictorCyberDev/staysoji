import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "About — StaySoji",
  description: "What StaySoji is, why it exists, and how its three checks work.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="About" backHref="/" />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 sm:px-8">
        <div className="space-y-6 pt-6 text-[14.5px] leading-relaxed text-foreground-dim">
          <section>
            <h1 className="text-xl font-medium text-foreground">Vigilance, before you borrow.</h1>
            <p className="mt-3">
              StaySoji is a free tool that checks a Nigerian digital loan app before you borrow from it. The name
              comes from the Yoruba root <em className="not-italic text-foreground">j&iacute;</em>, to wake or become
              alert. That&rsquo;s the whole idea: catch a predatory loan before it catches you, not after.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Why this exists</h2>
            <p className="mt-2">
              Nigeria&rsquo;s digital lending market has a well-documented predatory tier: apps that advertise a
              small &ldquo;processing fee&rdquo; that annualises into triple-digit interest, apps that market a
              90-day loan while structurally demanding repayment in a week, and apps the FCCPC has already delisted
              for harvesting contact lists to harass borrowers into paying. None of that is hidden information, but
              it&rsquo;s scattered across regulator PDFs, news coverage, and app-store removal notices that a
              borrower comparing five loan apps at 11pm will never read. StaySoji puts three checks against that
              same public record in one place.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">The three checks</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <strong className="text-foreground">Calculate</strong> &mdash; turns a stated principal, duration,
                and processing fee into the real annualised cost of credit, and flags the specific bait-and-switch
                duration pattern FCCPC has documented.
              </li>
              <li>
                <strong className="text-foreground">Look up</strong> &mdash; matches an app name against a curated
                dataset of apps with a documented FCCPC or Google Play delisting action, citing the source for every
                match.
              </li>
              <li>
                <strong className="text-foreground">Scan</strong> &mdash; reads pasted terms or a linked terms page
                for late-fee, third-party-contact, and rollover clauses, directly against the text you give it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">What StaySoji is not</h2>
            <p className="mt-2">
              It does not scan the apps installed on your phone or their permissions &mdash; there is no browser API
              that allows that, and a tool that pretended to would be lying to you. It does not scrape live Play
              Store reviews or social media. It is not financial or legal advice, and a low-risk result is not a
              guarantee. Read the full <a className="underline decoration-border-hairline underline-offset-2" href="/terms">terms</a> for the details.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Where the data comes from</h2>
            <p className="mt-2">
              Every score in the lookup tool traces back to an FCCPC delisting action or a Google Play removal,
              cited inline. We do not editorialise a score beyond what the regulator recorded. See the
              methodology note on any lookup result for the exact scoring rule.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
