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

## The Iris Ring

The product's signature interaction, tied to the mark's third-eye motif: a thin gold ring breathes at idle, contracts aperture-style through each real check as it runs (the labels only advance once that step's real work has resolved), then locks solid to a risk color. No particles, no glow, no gradient bloom.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind v4 with a fully custom dark-mode-first design system (see `app/globals.css`) pulled from the mark's own palette: deep teal, olive, gold, warm grey
- No animation library — the ring and all motion are plain CSS/SVG to keep the bundle light on mobile data
- Installable PWA: `public/manifest.json` + a hand-written service worker (`public/sw.js`) caching the static shell for offline use
- `@phosphor-icons/react` for icons; `sharp` (dev-only) to derive the icon set from the source mark

## Running locally

```bash
npm install
npm run dev
```

Optional: set `ANTHROPIC_API_KEY` to enable LLM-enhanced clause explanations in the terms scanner. The scanner is fully functional without it.

## What's next (not in this build)

Two things were explicitly scoped out because they aren't honestly buildable as a same-day browser PWA, and a faked version would be worse than not having them: a native device/permission scan (there's no web API to enumerate other installed apps — that's sandboxed by design) and live scraping of Play Store reviews or social media. A B2B "SojiGuard" API for lenders and platforms to screen listings before they go live is the natural next step once this MVP validates.
