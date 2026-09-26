---
format: 1080x1920
duration: 32s
message: "That '10% fee' is really a 180%+ APR — StaySoji catches it before you borrow"
arc: Hook -> Setup -> Reveal (hero) -> Proof x2 -> Brand close
audience: Nigerian mobile borrowers considering a quick loan app
mode: autonomous
music: none
---

## Video direction

- **Palette system** (from `frame.md`, remixed from the real app): canvas/paper `#F3EFE6`,
  ink `#0A0C0B`, deep teal `#0A1618`/`#0D1E21` as the dark surface for full-bleed title
  cards, gold `#C9A24B`/`#DAB868` as the sole warm accent (badges, the count-up number,
  the brand ring), risk-red `#BD5B47` reserved exclusively for the "HIGH RISK" state —
  never used decoratively. Olive `#63753C`/`#4A5A45` appears only inside the real
  screenshots (bait-and-switch panel), not invented into new UI.
- **Type**: Geist (the real app's own font, captured from the live build) for every
  invented title/caption; weights capped to 400/500 per the brand remix. Mono tracking
  (`letter-spacing: 0.12em`, uppercase) for eyebrow/index labels, mirroring the app's own
  "HIGH RISK" / "TRUE COST CALCULATOR" chrome — an invented label should look like it
  belongs next to the real UI, not like a separate ad layer.
- **Motion grammar + reveal model**: long-tail `power3` eases throughout, no bounce. No
  voiceover exists, so reveals are paced to a **reading rhythm** instead of spoken cues:
  each on-screen line/number/badge gets its own beat, nothing dumps at t=0, and every
  frame ends on a held read long enough to finish reading on a phone at arm's length
  (motion-language.md's VO-paced-reveal discipline, adapted to silent/caption-first
  pacing). Only a subtle idle breathing/jitter during holds — no drift, no lazy pan.
- **Rhythm / held-frame allocation**: Frame 1 (hook) and Frame 6 (close) are the two
  deliberate held/breather beats; Frame 3 (the APR reveal) is the climax and gets the
  most beats and the longest duration. Frames 4–5 are quick, punchy proof hits — energy
  stays up between the climax and the close, never a second slow climb.
- **Negative list**: no stock-photo or generic fintech-ad imagery, no invented mockups
  of the app's UI (every screen shown is the real captured screenshot), no purple-blue
  "AI" gradient, no bokeh, no drop shadows beyond the app's own soft ambient shadow, no
  slideshow (front-load-then-freeze) and no screensaver (independently drifting
  elements) — every moving piece answers to the reading rhythm above.
- **Sound**: silent by design (`music: none`, no `SCRIPT.md`) — no HeyGen sign-in and no
  local voice/music engine available in this environment; also the more honest choice
  for a vertical feed video, since most Reels/TikTok viewers watch muted and every beat
  here is built to land from on-screen type and the app's own real numbers alone.

## Frame 1 — Hook

- scene: The real landing screen; the tagline types itself in over the Iris Ring holding the brand mark
- duration: 4.5s
- transition_in: cut
- status: animated
- type: hook
- blueprint: typewriter-reveal (Adapt)
- focal: assets/landing.png
- roles: landing.png = background (full-bleed, dimmed ~25%)
- asset_candidates: assets/landing.png — the real marketing index page, Iris Ring holding the app-icon mark, headline "Stay alert before you borrow.", light theme
- src: compositions/frames/01-hook.html

Adapt: keep the typewriter signature on the headline; the "collapse" beat becomes the
real landing screenshot crossfading up underneath the finished line, instead of a
separate logo card, so the brand mark that pays it off is the app's own real UI.

Scene 1 (0.0–0.6s): solid dark-teal (#0A1618) field, nothing else — a breath before type starts. Centered, full frame.
Scene 2 (0.6–2.6s): a live caret types "Stay alert" then "before you borrow." on two lines, large centered serif-free display type in paper (#F3EFE6) on the dark field — Centered, ~50% of frame, single depth layer.
Scene 3 (2.6–3.3s): the finished headline holds one beat, then the whole field crossfades to the real `landing.png` screenshot, timed so the app's own on-screen headline lands in the same position the typed line just held — a direct visual rhyme, not a hard cut.
Scene 4 (3.3–4.5s): held read on the real screenshot; the Iris Ring's dashed gold circle gets one slow rotation (~15°) as the only motion. Full-bleed, foreground UI ~70% of frame.

## Frame 2 — Setup

- scene: The real filled calculator form; the three numbers that sound small get called out one by one
- duration: 4s
- transition_in: crossfade
- status: animated
- type: product_intro
- blueprint: compose
- focal: assets/calc-filled.png
- roles: calc-filled.png = cutout (foreground subject)
- asset_candidates: assets/calc-filled.png — the real True Cost Calculator form filled with principal 50,000, stated duration 22 days, processing fee 10%, actual repayment demand 7 days, pre-submit
- src: compositions/frames/02-setup.html

Compose: no blueprint fits "read three real form fields aloud via callouts" cleanly; built from the motion vocabulary directly — this is a deliberately quiet, unhurried beat before the climax.

Scene 1 (0.0–1.0s): the real filled-form screenshot slides up into frame from the bottom, settling centered — Centered, ~60% of frame, one depth layer, soft ambient shadow (the app's own).
Scene 2 (1.0–2.0s): a gold hairline box draws itself around the "22 stated days" and "10%" fields together; a small mono-tracked callout label pops in beside them: "sounds small enough" — upper-third emphasis, size+color hierarchy.
Scene 3 (2.0–3.2s): a second gold hairline box draws around the "Actual repayment demand: 7" field; callout label: "but read the fine print" — same treatment, lower on the card, sequential not simultaneous with Scene 2's box (which fades to a thin resting outline).
Scene 4 (3.2–4.0s): both boxes pulse once together (a single synced glow, ~0.3s) as the frame holds, priming the cut to the reveal — no further new content enters.

## Frame 3 — Reveal (hero)

- scene: The true APR count-up from 10% to 184%, HIGH RISK flips in, the bait-and-switch confirmed panel lands
- duration: 8.5s
- transition_in: cut
- status: animated
- type: key_feature
- blueprint: dataviz-countup (Adapt)
- focal: assets/calc-result.png
- roles: calc-result.png = cutout (foreground subject, the real result panel)
- asset_candidates: assets/calc-result.png — the real True Cost Calculator result: red HIGH RISK badge, "True APR: 184%" headline, the receive/repay/cost breakdown, the 10%-fee explainer sentence, and the amber "BAIT-AND-SWITCH CONFIRMED" panel citing the 22-day-advertised / 7-day-actual gap
- src: compositions/frames/03-reveal.html

Adapt: keep the count-up-to-hero-metric signature move; the "camera pushes through" is replaced with the real result screenshot resolving underneath the counting number, since the number IS the UI's own number, not an invented stat card — the count-up sells the number that the real screenshot then proves.

Scene 1 (0.0–0.5s): hard cut to a bare dark-teal (#0A1618) field; one line in paper type, small, upper-third: "advertised: 10% fee, 22 days".
Scene 2 (0.5–3.0s): a single oversized number owns the center and counts up on a decelerating ease — 10% → 45% → 90% → 184% — accelerating early, slowing hard into the final value; color shifts gold → risk-red as it crosses 60. Centered, ~55% of frame, single element, no competing content.
Scene 3 (3.0–3.6s): the counted "184%" freezes; "True APR" caption fades in beneath it, small, mono-tracked.
Scene 4 (3.6–5.0s): the whole field crossfades into the real `calc-result.png`, landing so the screenshot's own "True APR: 184%" sits exactly where the counted number just was — the invented count-up and the app's real number are the same number in the same spot. Full-bleed, foreground ~75% of frame.
Scene 5 (5.0–6.0s): the red "HIGH RISK" badge on the real screenshot gets one emphasis pulse (scale 1 → 1.06 → 1, ~0.4s) with a soft red glow bloom behind it, drawing the eye to it specifically.
Scene 6 (6.0–7.4s): the amber "BAIT-AND-SWITCH CONFIRMED" panel lower on the real screenshot gets a gold hairline frame that draws itself around it, then a slow 2-3px vertical nudge scrolls just enough of the panel into full view if it's cut off, holding on "actually demands repayment in 7 days."
Scene 7 (7.4–8.5s): full held read, real screenshot only, no further motion but a single slow idle breathe on the badge glow (opacity 0.9 ↔ 1).

## Frame 4 — Proof: the blacklist

- scene: The real lookup result for a named, blacklisted loan app
- duration: 5s
- transition_in: crossfade
- status: animated
- type: social_proof
- blueprint: titlecard-reveal (Adapt)
- focal: assets/lookup-result.png
- roles: lookup-result.png = cutout (foreground subject)
- asset_candidates: assets/lookup-result.png — the real Loan App Lookup result for "WeCredit": red HIGH RISK badge, "Blacklisted January 2026 for non-compliance with the DEON digital-lending framework... harassment and invasion of borrower privacy," with cited sources
- src: compositions/frames/04-lookup.html

Adapt: keep the one-clean-card, one-restrained-move signature; the move is a slide-up-crossfade of the real screenshot rather than an invented card, and the one added beat is a highlight sweep over the blacklist sentence, timed to a reading pace.

Scene 1 (0.0–0.3s): brief dark-teal flash field, a small upper-third eyebrow label types in: "checked against the real registry" — sets up what's coming without naming the app yet.
Scene 2 (0.3–1.3s): the real `lookup-result.png` slides up and crossfades in beneath the eyebrow line, centered, ~65% of frame — the app name "WeCredit" and its red badge are the first thing legible.
Scene 3 (1.3–3.6s): a soft gold highlight bar sweeps once, left to right, under the "Blacklisted January 2026... harassment and invasion of borrower privacy" sentence at reading speed (not instant) — the sweep IS the reveal, nothing else moves.
Scene 4 (3.6–5.0s): held read, no further motion; the red badge keeps the same subtle idle breathe established in Frame 3 for continuity.

## Frame 5 — Proof: the fine print

- scene: The real scanner result flagging a late-fee and rollover clause
- duration: 5s
- transition_in: crossfade
- status: animated
- type: social_proof
- blueprint: titlecard-reveal (Adapt)
- focal: assets/scan-result.png
- roles: scan-result.png = cutout (foreground subject)
- asset_candidates: assets/scan-result.png — the real Terms Scanner result: red HIGH RISK badge, "2 clauses worth a second look", two flagged-clause cards quoting the exact matched sentences (a 5%/day late fee with contact-harvesting language, and an automatic rollover clause)
- src: compositions/frames/05-scan.html

Adapt: same restrained titlecard move as Frame 4 for a matched rhythm across the two proof beats, with the highlight sweep now stepping across two clause cards in sequence instead of one sentence.

Scene 1 (0.0–0.3s): eyebrow label types in, upper-third: "reads the fine print, too".
Scene 2 (0.3–1.2s): the real `scan-result.png` slides up and crossfades in, centered, ~65% of frame — "2 clauses worth a second look" is legible immediately.
Scene 3 (1.2–2.7s): gold highlight bar sweeps once under the late-fee/contact-harvesting quote card.
Scene 4 (2.7–4.2s): gold highlight bar sweeps once under the rollover-clause quote card — a clear one-two, not simultaneous.
Scene 5 (4.2–5.0s): held read on both flagged cards visible, no further motion.

## Frame 6 — Brand close

- scene: The real app icon resolves into a centered lockup with the tagline and the URL
- duration: 5s
- transition_in: crossfade
- status: animated
- type: branding
- blueprint: logo-assemble-lockup (Adapt)
- focal: assets/app-icon-512.png
- roles: app-icon-512.png = cutout (foreground subject)
- asset_candidates: assets/app-icon-512.png — the real 512x512 StaySoji brand mark (watchman face, gold third-eye mark, horse motif, teal circular badge) exported from the product's own PWA icon
- src: compositions/frames/06-close.html

Adapt: keep the resolve-into-centered-lockup signature; the "build from parts" phase becomes the same dashed gold Iris Ring from Frame 1 drawing itself around the already-whole icon (a callback, not a rebuild-from-fragments), extended into the URL/CTA end card the blueprint supports natively.

Scene 1 (0.0–0.5s): cut to the dark-teal (#0A1618) field from Frames 1 and 3 — a deliberate callback surface, tying the close to the hook.
Scene 2 (0.5–1.6s): the real app icon fades and scales in at center from 0.85 → 1 on a soft spring-free power3 ease; simultaneously a dashed gold ring (the Iris Ring motif) draws itself on (stroke-dashoffset animation) around it, completing just as the icon settles. Centered, ~35% of frame.
Scene 3 (1.6–2.6s): "STAYSOJI" wordmark fades up directly beneath the icon, mono-tracked, uppercase, paper-colored.
Scene 4 (2.6–3.6s): the tagline "Stay alert before you borrow." fades in beneath the wordmark, smaller, completing the lockup — the exact words that opened Frame 1, closing the loop.
Scene 5 (3.6–5.0s): the URL "staysoji.vercel.app" fades in last, in a gold pill chip beneath the tagline (echoing the app's real pill-button chrome), and everything holds fully static — no further motion, a full stop for the CTA to be read and remembered.
