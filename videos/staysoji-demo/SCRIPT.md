---
voice: Kokoro TTS, voice "am_michael", speed 1.06
audio_pipeline: local, offline (no HeyGen sign-in available in this environment)
---

## Why this exists

This is the "qualified demo" — a premium explainer built specifically to send to
the StacStart Borderless Bytes judges, as distinct from `../staysoji-promo/`
(a social teaser). It walks through all three tools end to end: real input,
real output, for the calculator, the FCCPC lookup, and the terms scanner —
not just result screenshots. Two new real captures were taken for this project
(not present in the promo): the lookup search box mid-type with live
suggestions, and the scanner's paste box with real T&C text pasted in.

## Timeline (actual, post-`transitions.mjs inject`)

| Frame | Global start | Global end (incl. crossfade tail) |
|---|---|---|
| 01-hook | 0 | 4.5 |
| 02-overview | 4.0 | 11.0 |
| 03-calculator | 10.5 | 22.5 |
| 04-lookup | 22.0 | 31.0 |
| 05-scan | 30.5 | 39.5 |
| 06-close | 39.0 | 45.5 |

## Voiceover script

| # | Start (s) | Line |
|---|-----------|------|
| l01 | 0.9 | "StaySoji catches predatory loan terms before you borrow." |
| l02 | 4.5 | "Three checks: the real cost of a loan, an FCCPC blacklist check, and a fine-print scan." |
| l03 | 10.9 | "Enter the amount, the fee, the duration." |
| l04 | 14.6 | "The true cost: a hundred eighty four percent A P R — a confirmed bait and switch." |
| l05 | 22.6 | "Search any app by name." |
| l06 | 24.3 | "Checked against FCCPC's blacklist and approval records." |
| l07 | 28.4 | "Sources cited inline." |
| l08 | 31.0 | "Paste the actual terms." |
| l09 | 32.8 | "StaySoji flags late fees, rollover traps, contact-list harassment." |
| l11 | 39.4 | "Free, and built to keep you safe before you borrow. StaySoji." |

Deliberately sparse: narration explains what each tool does and names the
headline number once, then gets out of the way — the on-screen highlight boxes
and the real UI carry the specifics (exact APR, exact quoted clause, exact
source URLs). No line crosses more than ~0.3-0.5s into the next scene's
crossfade, matching the tolerance validated in the promo's v2 audio pass.

Line numbering has a gap (no l10) — an earlier "quoting the exact sentence"
line was cut during timing iteration because it collided with l09; the
remaining scan-scene narration (l09) already covers that beat.

## Sound design (synthesized, same approach as the promo's v2 audio)

- **Ambient pad** — two low sines (55Hz/82.5Hz), low-passed, very quiet, fades
  in/out across the full 45.5s.
- **Whoosh** at each of the 5 scene-to-scene crossfades (3.8s, 10.3s, 21.8s,
  30.3s, 38.8s) — band-passed pink noise, fast attack, short decay.
- **Reveal chime** (soft ascending two-tone, A4→D5) at each tool's own
  input-state → result-state crossfade (13.6s calculator, 25.2s lookup, 33.3s
  scanner) — a confirm/reveal tone, deliberately different from the promo's
  descending alert sting: this video is instructional, not alarmist.
- **Closing chime** at 42.4s (warm C5/E5) as the CTA pill lands.

## Pipeline (for reproducing locally)

Reuses the Kokoro model files already downloaded for the promo project
(`../staysoji-promo/.kokoro/kokoro-v1.0.onnx` + `voices-v1.0.bin`) rather than
re-downloading ~350MB. This project's own `.kokoro/` (gitignored) holds only
the generated voice clips, synthesized SFX, and the mixed `master.wav`:

```bash
python3 .kokoro/gen_vo.py   # writes l01..l11.wav + manifest.json
python3 .kokoro/mix.py      # places every VO line + SFX element, mixes, normalizes to -16 LUFS
ffmpeg -i renders/<silent>.mp4 -i .kokoro/master.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest \
  renders/staysoji-demo-explainer_2026-09-30.mp4
```
