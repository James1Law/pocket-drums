# Pocket Drums

A mobile-first web app that turns your phone into a responsive, touch-based drum pad. Built with the Web Audio API for instant, low-latency sound.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **6 drum pads** — Kick, Snare, Hi-hat, Open Hat, Tom, Clap
- **Instant playback** — Programmatic Web Audio synthesis with <50ms perceived latency
- **Multi-touch** — Play multiple pads simultaneously
- **Record & Loop** — Capture your beats and loop them continuously
- **Live layering** — Tap pads on top of a playing loop
- **Save loops** — Persist your recordings to localStorage
- **Keyboard support** — Play on desktop with Q/W/A/S/Z/X keys
- **iOS compatible** — Handles AudioContext unlock automatically
- **Zero onboarding** — Play within 1 second of loading

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## How It Works

### Sound Engine

All drum sounds are synthesized in real-time using the Web Audio API — no audio files to download. Each sound is built from oscillators, noise buffers, and filters:

| Sound | Technique |
|-------|-----------|
| Kick | Frequency-swept oscillator (150Hz → 40Hz) |
| Snare | Bandpass-filtered noise + triangle oscillator |
| Hi-hat | Short highpass-filtered noise burst |
| Open Hat | Longer highpass-filtered noise burst |
| Tom | Pitch-swept oscillator (200Hz → 80Hz) |
| Clap | Layered noise bursts through bandpass filter |

### Loop Playback

Recording captures pad hits with sub-millisecond timestamps via `performance.now()`. Playback uses a **look-ahead scheduler** — events are pre-scheduled 100ms ahead using `audioContext.currentTime` (hardware-clocked), eliminating JavaScript timer jitter for tight rhythmic accuracy.

## Tech Stack

- **[Vite](https://vite.dev/)** — Build tool
- **[React](https://react.dev/)** + **TypeScript** — UI framework
- **[Tailwind CSS](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** — Styling
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** — Sound synthesis & scheduling
- **[Vitest](https://vitest.dev/)** + **Testing Library** — Tests

## Keyboard Mapping (Desktop)

| Key | Sound |
|-----|-------|
| Q | Kick |
| W | Snare |
| A | Hi-hat |
| S | Open Hat |
| Z | Tom |
| X | Clap |

## License

MIT
