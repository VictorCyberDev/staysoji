---
format: 1080x1920
duration: 43s
message: "How StaySoji actually works: three real checks, walked through end to end"
arc: Hook -> Overview -> Calculator (input->output) -> Lookup (input->output) -> Scanner (input->output) -> Close
audience: "Hackathon judges/reviewers evaluating StaySoji (StacStart Borderless Bytes)"
mode: autonomous
music: synthesized-sfx-bed
---

## Video direction

- **Palette**: reused verbatim from `../staysoji-promo/frame.md` for brand continuity across
  both deliverables — canvas/paper `#F3EFE6`, ink `#0A0C0B`, dark teal `#0A1618` for
  full-bleed cards, gold `#C9A24B`/`#DAB868` as the sole warm accent, risk-red reserved
  for the app's own "HIGH RISK" chip (never used decoratively).
- **Type**: Geist / Geist Mono, the real app's own fonts (self-hosted, captured from the
  live build), same as the promo project.
- **Difference from the promo video**: the promo (`../staysoji-promo/`) is a teaser built
  to work muted, hook-first, showing mostly result screens. This is an **explainer/demo**:
  every tool shows its real input state AND its real output state, in sequence, so a judge
  can see exactly how each check works, not just that it works. Narration is instructional
  first, alert-PSA tone second (the opposite emphasis from the promo).
- **Motion grammar**: same long-tail `power3`/`power2` eases, no bounce, box+callout
  highlight technique reused from the promo's validated composition patterns. Every
  input/output pair uses a crossfade between two full-bleed screenshot layers inside one
  composition (input layer -> result layer), not a hard cut, so the "answer appears"
  beat reads as cause-and-effect.
- **Negative list**: same as the promo — no stock imagery, no invented mockups (every
  screen is a real captured screenshot, including two new captures for this project:
  the lookup search box mid-type, and the scanner's paste box with real pasted text),
  no purple-blue "AI" gradient, no slideshow/screensaver drift.
- **Sound**: voiceover (Kokoro TTS, local) + the same synthesized SFX/ambient bed
  approach validated in the promo's v2 audio pass. See `SCRIPT.md` once written.

## Frame 1 — Hook

- scene: A dark-teal title card naming the product and the problem in one breath — no delayed reveal, this is a demo, not a teaser
- duration: 4s
- transition_in: cut
- status: built
- type: hook
- src: compositions/frames/01-hook.html

Scene 1 (0.0-0.3s): eyebrow label "Staysoji · Walkthrough" fades in.
Scene 2 (0.3-1.6s): headline "Three real checks." types in, centered, paper-on-teal.
Scene 3 (1.7-2.3s): subhead "A free tool that catches predatory loan terms before you borrow." fades up beneath.
Scene 4 (2.3-4.0s): held read.

## Frame 2 — Overview

- scene: The real landing page (the same page a first-time visitor sees), with the three tool rows highlighted one at a time
- duration: 6.5s
- transition_in: crossfade
- status: built
- type: overview
- focal: assets/landing.png
- src: compositions/frames/02-overview.html

Scene 1 (0.0-0.8s): the real landing screenshot slides up into frame.
Scene 2 (0.9-2.1s): row 1 (the calculator) highlights with a numbered pill.
Scene 3 (2.3-3.5s): row 2 (the lookup) highlights.
Scene 4 (3.7-4.9s): row 3 (the scanner) highlights.
Scene 5 (4.9-6.5s): held read, all three rows pulse once together.

## Frame 3 — Calculator

- scene: The real calculator — the filled input form, then a crossfade to the real computed result (True APR, HIGH RISK, bait-and-switch panel)
- duration: 11.5s
- transition_in: crossfade
- status: built
- type: demo
- focal: assets/calc-filled.png, assets/calc-result.png
- src: compositions/frames/03-calculator.html

Scene 1 (0.0-0.3s): eyebrow "1 · True Cost Calculator".
Scene 2 (0.3-1.1s): the filled input form slides into frame (principal, stated duration, fee, optional actual-repayment).
Scene 3 (1.2-2.9s): the three input groups highlight in sequence with a caption naming what each is for.
Scene 4 (3.1-3.7s): crossfade from the input form to the real computed result.
Scene 5 (3.9-4.5s): the HIGH RISK badge highlights.
Scene 6 (4.6-5.6s): the "True APR: 184%" figure highlights.
Scene 7 (5.9-7.4s): the bait-and-switch panel (advertised 22 days vs. actual 7) frames.
Scene 8 (7.4-11.5s): held read, a slow idle breathe on the panel.

## Frame 4 — Lookup

- scene: The real lookup tool — a name typed into the search field with live suggestions, then a crossfade to the real cited result
- duration: 8.5s
- transition_in: crossfade
- status: built
- type: demo
- focal: assets/lookup-typing.png, assets/lookup-result.png
- src: compositions/frames/04-lookup.html

Scene 1 (0.0-0.3s): eyebrow "2 · Loan App Lookup".
Scene 2 (0.3-1.1s): the search field mid-type, with the live suggestion list, slides into frame.
Scene 3 (1.2-3.0s): the search box highlights, then the suggestion list.
Scene 4 (3.2-3.8s): crossfade to the real result screen.
Scene 5 (4.0-4.6s): the HIGH RISK badge highlights.
Scene 6 (4.7-6.0s): the cited reasoning paragraph highlights.
Scene 7 (6.2-7.0s): the cited sources block highlights — proving the record is sourced, not invented.
Scene 8 (7.0-8.5s): held read.

## Frame 5 — Scanner

- scene: The real terms scanner — real pasted T&C text, then a crossfade to the real flagged clauses
- duration: 8.5s
- transition_in: crossfade
- status: built
- type: demo
- focal: assets/scan-pasted.png, assets/scan-result.png
- src: compositions/frames/05-scan.html

Scene 1 (0.0-0.3s): eyebrow "3 · Terms Scanner".
Scene 2 (0.3-1.1s): the paste box with real T&C text slides into frame.
Scene 3 (1.2-2.6s): the pasted-text box highlights.
Scene 4 (2.8-3.4s): crossfade to the real scan result.
Scene 5 (3.6-4.2s): the HIGH RISK badge highlights.
Scene 6 (4.3-5.4s): the late-fee clause card highlights (exact quoted sentence).
Scene 7 (5.6-6.5s): the rollover clause card highlights.
Scene 8 (6.5-8.5s): held read, both cards pulse once together.

## Frame 6 — Close

- scene: The brand mark settling in, same lockup as the promo's close, with a hackathon credit line added
- duration: 6.5s
- transition_in: crossfade
- status: built
- type: close
- focal: assets/app-icon-512.png
- src: compositions/frames/06-close.html

Scene 1 (0.4-1.5s): icon settles in, the dashed ring draws on around it.
Scene 2 (1.5-2.5s): wordmark fades up.
Scene 3 (2.5-3.5s): tagline "Free. No sign-up required to explore." fades in.
Scene 4 (3.5-4.5s): URL pill fades in.
Scene 5 (4.5-5.3s): "Built for StacStart · Borderless Bytes" credit line fades in last.
