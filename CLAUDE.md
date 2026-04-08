# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Drums is a mobile-first web app that turns a smartphone into a touch-based drum pad using the Web Audio API. The most critical requirement is **low-latency audio response** — all decisions must prioritise responsiveness.

## Tech Stack

- **Build tool:** Vite
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Audio:** Web Audio API (AudioContext with preloaded buffers)
- **State:** Local React state only (no global state library)
- **Storage:** LocalStorage (for saved loops)

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run linter
npm test             # Run all tests
npm test -- --run    # Run tests once (no watch)
npx vitest run src/path/to/file.test.ts  # Run a single test file
```

## Development Workflow (MANDATORY)

Follow TDD for every task:

1. **Plan** — describe what will be built and list files to create/modify
2. **RED** — write failing tests first (focus on behaviour, not implementation)
3. **GREEN** — write minimal code to pass tests
4. **Refactor** — improve readability, remove duplication, verify no performance regression

## Audio Rules (CRITICAL)

- MUST use Web Audio API (`AudioContext`)
- MUST preload all audio buffers on app load
- MUST NOT create new `Audio` objects on each tap
- MUST allow overlapping playback (no cut-offs)
- Do NOT use HTML `<audio>` elements for playback
- Do NOT delay sound playback for UI updates
- iOS Safari requires user interaction before audio playback — handle this

## Architecture Notes

- **Sound engine:** AudioContext with pre-decoded buffers. On tap, create a new `AudioBufferSourceNode`, connect to destination, and call `start()` immediately.
- **Recording:** Capture tap timestamps relative to recording start. Loop playback replays the sequence using scheduled `AudioBufferSourceNode` calls.
- **Pad grid:** 6 pads in a 2x3 grid (Kick, Snare, Hi-hat, Open hat, Tom, Clap). Must support multi-touch.

## UI Rules

- Mobile-first design with thumb-friendly layout
- Touch targets must be large enough for reliable tapping
- Visual feedback on pad interaction (immediate, not blocking audio)
- Simple grid layout — avoid layout complexity

## Performance Constraints

- Target <50ms perceived audio latency
- No unnecessary re-renders
- No heavy libraries or large bundle sizes
- Prioritise fast initial load

## Anti-Patterns

- Do not introduce a backend
- Do not over-engineer state management
- Do not use global state libraries for MVP
- Do not delay sound for UI updates or animations

## Git Conventions

- One feature per branch
- Commit message format: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`

## When Unsure

Default to simpler implementation, faster performance, better UX. Ask: "Will this make the app feel faster or slower?"
