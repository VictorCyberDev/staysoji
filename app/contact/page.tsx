import type { Metadata } from "next";
import { GithubLogo, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Contact — StaySoji",
  description: "Report a bug, dispute a listing, or get in touch.",
};

const REPO_URL = "https://github.com/VictorCyberDev/staysoji";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Contact" backHref="/" />
      <div className="mx-auto w-full max-w-md flex-1 px-6 pb-16 sm:px-8">
        <div className="space-y-6 pt-6 text-[14.5px] leading-relaxed text-foreground-dim">
          <section>
            <h1 className="text-xl font-medium text-foreground">Get in touch</h1>
            <p className="mt-3">
              StaySoji is an open, in-progress project. The fastest way to reach us is on GitHub, whether
              that&rsquo;s a bug, a data correction, or a company disputing a listing.
            </p>
          </section>

          <a
            href={`${REPO_URL}/issues/new`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border-hairline bg-surface px-5 py-5 transition-colors hover:border-gold-500/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-hairline text-gold-400">
              <GithubLogo size={19} weight="light" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium text-foreground">Open an issue</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-foreground-faint">
                Bug reports, data corrections, and listing disputes go here.
              </span>
            </span>
            <ArrowUpRight size={16} className="shrink-0 text-foreground-faint" />
          </a>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Disputing a listing</h2>
            <p className="mt-2">
              Every score in the lookup tool cites a specific FCCPC or Google Play regulatory action, with a source
              link on the result. If you believe a listing is inaccurate or out of date, open an issue with the
              app name and what changed &mdash; we review these directly against the cited source.
            </p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-foreground">Data deletion requests</h2>
            <p className="mt-2">
              If you have a StaySoji account and want your data deleted, open an issue titled &ldquo;data
              deletion&rdquo; from the email address on your account, or ask from within the app once signed in.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
