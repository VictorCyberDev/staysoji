# StaySoji

Stay alert before you borrow. StaySoji is a installable web app (PWA) that helps Nigerian consumers check a digital loan app before they borrow from it, using three real checks against real records — not a mockup, not a device scan.

Built for the **StacStart Borderless Bytes** hackathon, FinTech & Commerce track.

## What it does

**1. True APR & bait-and-switch calculator** (`/calculate`)
Enter a principal, a stated loan duration, and a stated "processing fee" percentage. The calculator treats the transaction as the discount loan it structurally is (fee deducted upfront, full principal owed back) and computes the true annualised cost of credit. It also flags the specific bait-and-switch pattern FCCPC has documented: apps that advertise a long tenure (60+ days) while structurally demanding repayment far sooner. All math runs client-side — see `lib/apr.ts`.

**2. Loan app lookup** (`/lookup`)
Search a loan app by name against a curated, sourced dataset of ~40 apps with a documented FCCPC or Google Play delisting action (`data/loan-apps.json`). Matches show the real cited reason and source link, never an invented one. Apps flagged high risk get a "try these instead" panel of FCCPC-approved alternatives. A search with no match doesn't dead-end — it shows the same three real signals (APR math, permission red flags, T&C traps) so the check is still useful, since most searches won't be in a ~40-app dataset.

**3. Terms & conditions scanner** (`/scan`)
Paste loan terms directly, or give a link (fetched server-side via `/api/scan` to avoid browser CORS limits). The scanner runs real pattern matching against the actual text for three trap categories: late fees/penalties, third-party contact rights (contact list, next of kin, emergency contacts), and rollover/renewal clauses. This works standalone with zero external dependencies; if `ANTHROPIC_API_KEY` is set in the deployment environment, each matched clause additionally gets a one-sentence plain-English explanation from an LLM call, generated only from the matched text (never inventing clauses that aren't there).

The loan-app lookup also does fuzzy matching: a misspelled or partial name still surfaces "did you mean" suggestions and a live autocomplete dropdown, matched against both the delisted-app registry and the FCCPC-approved lender list, so a typo or a legitimate app name never dead-ends into a false "not verified" result.

## The Iris Ring

The product's signature interaction, tied to the mark's third-eye motif: a thin gold ring breathes at idle, contracts aperture-style through each real check as it runs (the labels only advance once that step's real work has resolved), then locks solid to a risk color. No particles, no glow, no gradient bloom.

## Accounts and admin

Signup/login (`/signup`, `/login`) is optional today, not required to use the three checks. Accounts require the signer to be 18 or older, enforced both client- and server-side. There's no external database: passwords are hashed with scrypt and each user record is stored as its own private JSON file in Vercel Blob, keyed by a hash of their email; sessions are a signed, stateless cookie (HMAC over `AUTH_SECRET`) rather than a session store.

`/admin` is a separate, password-gated dashboard (credentials via `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars, never committed) showing total accounts, signups in the last 7 days, average age, and the per-user list.

## Pages

`/about`, `/privacy`, `/terms`, `/contact`, a custom 404, `robots.txt`, and `sitemap.xml` round out the app for indexing and for eventual ad-network review — none of them are placeholder text.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind v4 with a fully custom design system (see `app/globals.css`) pulled from the mark's own palette: deep teal, olive, gold, warm grey. Dark by default, with a light mode toggle (flash-free via a blocking inline script + `useSyncExternalStore`)
- No animation library — the ring and all motion are plain CSS/SVG to keep the bundle light on mobile data
- Installable PWA: `public/manifest.json` + a hand-written service worker (`public/sw.js`) caching the static shell for offline use
- `@phosphor-icons/react` for icons; `sharp` (dev-only) to derive the icon set from the source mark
- `@vercel/blob` for the auth data layer (see "Accounts and admin" above) — chosen over a hosted Postgres/Supabase project because this Vercel team's free-tier project quota was already spoken for by other apps

## Running locally

```bash
npm install
npm run dev
```

Required for auth locally: `BLOB_READ_WRITE_TOKEN` (from a Vercel Blob store linked to the project), `AUTH_SECRET` (any random string), `ADMIN_USERNAME`/`ADMIN_PASSWORD`. Put these in `.env.local` (gitignored). Without them, the three core checks still work — only signup/login/admin need them.

Optional: set `ANTHROPIC_API_KEY` to enable LLM-enhanced clause explanations in the terms scanner. The scanner is fully functional without it.

## What's next (not in this build)

Two things were explicitly scoped out because they aren't honestly buildable as a same-day browser PWA, and a faked version would be worse than not having them: a native device/permission scan (there's no web API to enumerate other installed apps — that's sandboxed by design) and live scraping of Play Store reviews or social media. A B2B "SojiGuard" API for lenders and platforms to screen listings before they go live is the natural next step once this MVP validates.
