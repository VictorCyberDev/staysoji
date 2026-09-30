---
workflow: product-launch-video
flow: automation
storyboard: no
message: "How StaySoji actually works: three real checks, walked through end to end"
destination: general
aspect: 1080x1920
language: en
audience: "Hackathon judges/reviewers evaluating StaySoji (StacStart Borderless Bytes)"
length: 44s
angle: explainer-walkthrough
narration: yes
---

## Intent

A premium, Apple-keynote-style **product demo/explainer** for StaySoji, meant to be
sent directly to hackathon judges — not a social teaser. Where the earlier promo
video (`../staysoji-promo/`) led with a hook and only showed input/output snapshots
of the calculator, this one actually walks a reviewer through how each of the three
tools works end to end: what you type in, and what StaySoji gives back, for all
three tools (calculator, FCCPC lookup, T&Cs scanner) — using the app's own real,
captured UI at every step (including two new input-state captures: the lookup
search box mid-type with live suggestions, and the scanner's paste box with real
T&C text pasted in). Voiceover carries clear, confident explanation — informative
first, alert-PSA tone second (the opposite emphasis from the promo). Tone: precise,
credible, product-demo — the kind of video a judge can watch once and understand
exactly what was built and why it's real (cites FCCPC sources, quotes exact matched
sentences, computes real APR math) rather than a mockup.

## Assets

- `../staysoji-promo/assets/` — reused real captures: landing page (3-tool overview),
  calculator filled + result, lookup result, scanner result, fonts, GSAP vendor libs.
- `capture/screens/out2/` (this project) — two new real captures: lookup search box
  mid-type with live suggestions, scanner paste box with real pasted T&C text.

## Customizations

- Show input -> output for all three tools (not just the calculator), so a judge can
  see the actual interaction model, not just a result screenshot.
- Open by naming the product and the problem in one breath (judges shouldn't have to
  wait for a hook/reveal the way a social promo can afford to).
- Close with a "built for StacStart Borderless Bytes" credit line, since this is
  being sent directly to that hackathon's judges.

## Notes

- Real screenshots/screens over invented mockups wherever the site can be captured.
- No stock-photo or generic fintech-ad aesthetics; reuse the app's own teal/olive/gold
  palette established in `../staysoji-promo/frame.md`.
- Voiceover: Kokoro TTS (local), same voice/pipeline as the promo's v2 audio, for
  consistency across deliverables. See `SCRIPT.md` once written.
