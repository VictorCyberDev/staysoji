---
version: launch-v2 (sound + voiceover)
voice: Kokoro TTS, voice "am_michael", speed 1.06
audio_pipeline: local, offline, no HeyGen sign-in available in this environment
---

## Why this exists

The v1 render (`renders/staysoji-promo_2026-09-26_13-45-56.mp4`) shipped silent —
no HeyGen sign-in and no local TTS/BGM deps were available at the time. This file
documents the v2 upgrade: real voiceover + a synthesized sound design bed, built
entirely offline (no MusicGen/torch — too heavy for this sandbox; used lightweight
Kokoro for voice and ffmpeg-synthesized tones/noise for SFX instead, which also
suits the restrained "Apple keynote" sound palette better than a full music bed).

## Voiceover script (timed to the existing 32s visual cut)

| # | Start (s) | Line | Scene beat |
|---|-----------|------|------------|
| 1 | 2.3 | "Stay alert before you borrow." | 01-hook — lands as the typed headline finishes |
| 2 | 4.8 | "Ten percent fee. Twenty two days." | 02-setup — the filled form, advertised terms |
| 3 | 8.75 | "Looks harmless." | 03-reveal — advertised line shown, count-up just starting |
| 4 | 11.6 | "That's a hundred and eighty four percent A P R. High risk." | 03-reveal — right as the counter lands on 184% |
| 5 | 17.6 | "StaySoji checks it against the real registry." | 04-lookup — sweep under the blacklist line |
| 6 | 22.6 | "It reads the fine print, too." | 05-scan — echoes the on-screen eyebrow line |
| 7 | 28.7 | "Stay alert before you borrow. StaySoji." | 06-close — wordmark → tagline → CTA pill |

No line crosses a scene's crossfade boundary; each has >=1s of silence before the
next cut, so the quiet counting/reveal beats (9.0-11.5s) and the held-read beats
stay uncluttered — narration only speaks where it adds information the visual
alone doesn't carry.

## Sound design (synthesized, no stock/generated music)

- **Ambient pad** — two low sines (55Hz/82.5Hz), heavily low-passed, very low
  volume, slow fade in/out across the full 32s. Just enough low-end presence to
  keep the silence from feeling dead; never competes with the voice.
- **Whoosh** at each hard scene change (4.2s, 8.3s, 16.8s, 26.8s) — band-passed
  pink noise with a fast attack / short decay, landing just ahead of the cut.
- **Tension riser + tick** under the 10%→184% count-up (9.0-11.5s) — a rising
  sine sweep plus a fast tremolo-gated tone, standard "counter climbing" texture,
  timed exactly to the GSAP count-up tween.
- **Landing accent** at 11.5s — a short two-tone descending sting the instant the
  counter freezes on 184%, reinforcing the reveal without a cartoonish stinger.
- **Soft UI blips** at each result-screen "sweep" reveal (18.6s, 23.3s, 24.8s) —
  brief high-passed noise ticks under the gold highlight sweeps.
- **Closing chime** at 30.5s — a warm two-note resolve (C5/E5) as the CTA pill
  lands, closing the piece on a settled, confident note.

## Pipeline notes (for reproducing this locally)

Kokoro model files and the mixed intermediate audio live under `.kokoro/`
(gitignored — regenerate, don't commit):

```bash
pip install kokoro-onnx soundfile
mkdir -p .kokoro && cd .kokoro
curl -L -o kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -o voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
python3 gen_vo.py   # writes l01.wav .. l07.wav + manifest.json
```

SFX are synthesized on the fly with `ffmpeg -f lavfi` (sine/anoisesrc + filters);
see the commands recorded in this session's history if regenerating from scratch.
`mix.py` places every VO line and SFX element at its absolute start time with
`adelay`, mixes with `amix`, and normalizes with `loudnorm` to `-16 LUFS` /
`-1.5dBTP` — safe headroom for social platforms' own loudness normalization.

The final mux is a straight audio replace onto the already-validated silent
render (video stream copied, untouched):

```bash
ffmpeg -i renders/staysoji-promo_2026-09-26_13-45-56.mp4 -i .kokoro/master.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest \
  renders/staysoji-promo-launch_2026-09-27.mp4
```
