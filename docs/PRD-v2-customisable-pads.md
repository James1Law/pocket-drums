# PRD: Customisable Pad Layout & Expanded Sound Kit

**Version:** 2.0  
**Date:** 2026-04-09  
**Status:** Confirmed

---

## 1. Problem Statement

Users have different preferences for where drum pads sit on screen. Some want the kick on the left, others on the right. The current layout is a fixed 2x3 grid with no way to rearrange pads. Additionally, the current six sounds (kick, snare, hi-hat, open hat, tom, clap) don't cover a standard drum kit — notably missing a second tom, cowbell, and other common percussion.

## 2. Goals

1. Let users drag and drop pads to rearrange them into their preferred layout
2. Persist the custom layout so it survives page reloads
3. Expand the sound palette to cover a full standard kit plus common extras
4. Maintain <50ms audio latency — no regressions from either feature

## 3. Non-Goals

- Free-form positioning (absolute pixel placement) — too complex for MVP; grid swap is sufficient
- Resizable pads
- Sample uploads or external audio files
- Tablet/wider screen layouts (future consideration)
- Backend or user accounts

---

## 4. Feature 1: Draggable Pad Rearrangement

### 4.1 User Experience

- **Enter edit mode:** User long-presses any pad (500ms) or taps a small "Edit layout" button in the header. Pads enter a "jiggle" state (subtle animation, similar to iOS home screen) to indicate they are movable.
- **Drag to swap:** User drags a pad onto another pad's position. The two pads swap places. The grid structure (2 columns) stays the same — only the order of pads changes.
- **Exit edit mode:** User taps a "Done" button that replaces the edit button, or taps outside any pad. Jiggle animation stops.
- **Persistence:** The pad order is saved to `localStorage` under a new key (`pocket-drums-pad-order`). On next load, pads render in the saved order.
- **Reset:** An option in edit mode to "Reset to default" restores the original order.

### 4.2 Technical Approach

| Concern | Decision |
|---------|----------|
| Drag implementation | Use the HTML Drag and Drop API with pointer events as fallback for touch. Alternatively, use a lightweight library like `@dnd-kit/core` (~5 KB gzipped) which has excellent touch/pointer support out of the box. |
| State | New `usePadLayout` hook that holds the ordered array of `PadId`s. Reads initial order from `localStorage`, falls back to default config order. |
| Grid rendering | `PadGrid` maps over the ordered `PadId` array instead of the static `PAD_CONFIG` array. Lookup pad config by id. |
| Audio impact | None — drag only reorders visual elements; `AudioEngine.play(padId)` is unchanged. |
| Recording compatibility | Recordings store `PadId` strings, not positions, so existing recordings remain valid regardless of layout changes. |

### 4.3 Acceptance Criteria

- [ ] User can enter and exit edit mode
- [ ] Dragging pad A onto pad B swaps their positions
- [ ] Pad order persists across page reloads
- [ ] "Reset to default" restores original order
- [ ] Pads are not playable while in edit mode (prevents accidental sounds while dragging)
- [ ] Works on touch (mobile) and pointer (desktop)
- [ ] No audio latency regression
- [ ] Keyboard mapping follows grid position, not pad identity (i.e., top-left pad is always Q regardless of which sound is there)
- [ ] All 10 grid positions have a keyboard shortcut

---

## 5. Feature 2: Expanded Sound Kit

### 5.1 New Sounds

Expanding from 6 to 10 active pads, with 3 additional sounds available as swappable extras.

**Core additions (always visible by default):**

| Pad ID | Label | Rationale |
|--------|-------|-----------|
| `tom2` | LOW TOM | Standard kits have at least high and low toms |
| `tom3` | FLOOR TOM | Floor tom completes the standard 3-tom setup |
| `cowbell` | COWBELL | User-requested; iconic percussion sound |
| `ride` | RIDE | Standard cymbal missing from current kit |

**Swappable extras (can replace any of the 10 active pads):**

| Pad ID | Label | Rationale |
|--------|-------|-----------|
| `crash` | CRASH | Standard cymbal for accents |
| `tambourine` | TAMBOURINE | Common percussion layer |
| `rimshot` | RIM SHOT | Snare variation, common in many genres |

The grid is always 10 pads (2x5). Users can swap any active pad for one of the extras via the edit mode (Feature 1). This keeps the screen from getting too busy while still offering variety.

### 5.2 Updated Grid Layout

With 10 pads, the grid moves from 2x3 to **2x5** (2 columns, 5 rows). This keeps the same column structure users are used to while adding rows. On taller screens the pads remain comfortably sized; on shorter screens the minimum height (currently 80px) may need to reduce slightly to ~70px.

### 5.3 Default Pad Order

A sensible default order, grouping similar sounds. Users can rearrange via Feature 1.

```
| HI-HAT    | RIDE      |
| SNARE     | CLAP      |
| TOM       | LOW TOM   |
| FLOOR TOM | COWBELL   |
| KICK      | OPEN HAT  |
```

### 5.4 Synthesis Specs

All new sounds will be synthesized (consistent with existing approach — no audio files).

**Low Tom (`tom2`)**
- Sine oscillator, frequency sweep 150Hz -> 60Hz over 0.2s
- Gain 0.8 -> 0.01 over 0.35s
- Slightly lower and longer than existing tom

**Floor Tom (`tom3`)**
- Sine oscillator, frequency sweep 100Hz -> 40Hz over 0.25s
- Gain 0.8 -> 0.01 over 0.45s
- Deepest tom, longest sustain

**Cowbell (`cowbell`)**
- Two square oscillators at 587Hz and 845Hz (detuned)
- Bandpass filter at 700Hz
- Gain 0.6 -> 0.01 over 0.2s
- Short, metallic character

**Ride (`ride`)**
- Noise source through highpass filter at 5000Hz
- Mixed with sine oscillator at 400Hz (low bell component)
- Gain 0.4 -> 0.01 over 0.8s
- Longer sustain than hi-hat, more shimmer

**Crash (`crash`)**
- Noise source through bandpass filter at 3000Hz (wide Q)
- Gain 0.7 -> 0.01 over 1.2s
- Long sustain, bright and washy

**Tambourine (`tambourine`)**
- Noise burst through highpass filter at 8000Hz
- 3 rapid micro-bursts (5ms apart) for jingle character
- Gain 0.5 -> 0.01 over 0.15s

**Rim Shot (`rimshot`)**
- Triangle oscillator at 350Hz, very short (0.03s)
- Mixed with noise burst through bandpass at 2500Hz (0.05s)
- Gain 0.9 -> 0.01 over 0.08s
- Sharp, cracking attack

### 5.5 Type & Config Changes

- `PadId` type expands: add `'tom2' | 'tom3' | 'cowbell' | 'ride' | 'crash' | 'tambourine' | 'rimshot'`
- `PAD_CONFIG` gets entries for all 13 sounds (10 default + 3 extras)
- `AudioEngine.synthesizers` map gets 7 new entries (all sounds must be synthesisable even if not on the grid)
- `useKeyboardPads` mapping is **position-based**, not pad-based. The 10 grid positions always map to the same keys regardless of which sound occupies them:

```
| Q | W |
| A | S |
| Z | X |
| E | D |
| C | V |
```

All 10 positions have a shortcut. The mapping reads from the current pad layout order.

### 5.6 Colour Assignments

**Default 10:**

| Pad | Colour | Tailwind Class |
|-----|--------|----------------|
| HI-HAT | Yellow | `bg-yellow-600` (existing) |
| RIDE | Amber | `bg-amber-600` |
| SNARE | Blue | `bg-blue-600` (existing) |
| CLAP | Pink | `bg-pink-600` (existing) |
| TOM | Purple | `bg-purple-600` (existing) |
| LOW TOM | Violet | `bg-violet-600` |
| FLOOR TOM | Indigo | `bg-indigo-600` |
| COWBELL | Rose | `bg-rose-600` |
| KICK | Orange | `bg-orange-600` (existing) |
| OPEN HAT | Green | `bg-green-600` (existing) |

**Swappable extras:**

| Pad | Colour | Tailwind Class |
|-----|--------|----------------|
| CRASH | Cyan | `bg-cyan-600` |
| TAMBOURINE | Teal | `bg-teal-600` |
| RIM SHOT | Red | `bg-red-600` |

### 5.7 Acceptance Criteria

- [ ] All 10 pads render and produce distinct sounds
- [ ] Each new synthesis function has unit tests verifying node creation
- [ ] New pads work with recording/playback (record hits, loop them)
- [ ] Keyboard shortcuts work for all 10 pads
- [ ] Grid remains usable on small screens (iPhone SE viewport: 375x667)
- [ ] No performance regression — 10 pads should feel as responsive as 6

---

## 6. Implementation Order

### Phase 1: Expanded Sound Kit
1. Add new `PadId` types and config entries (all 13 sounds — 10 default + 3 extras)
2. Write synthesis functions for all 7 new sounds (with tests)
3. Register all 13 in `AudioEngine`
4. Update keyboard mapping to position-based (10 keys for 10 grid slots)
5. Adjust grid layout from 2x3 to 2x5
6. Update existing tests

### Phase 2: Draggable Pad Rearrangement
1. Add `usePadLayout` hook with localStorage persistence
2. Refactor `PadGrid` to use ordered layout
3. Implement edit mode toggle (UI + jiggle animation)
4. Implement drag-to-swap interaction
5. Add "Reset to default" option
6. Write tests for layout persistence and swap logic

**Rationale for order:** Phase 1 establishes the full pad set first, so Phase 2's drag/rearrange feature works with the complete kit from the start. This avoids rework if the grid size changes.

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 10 pads too cramped on small screens | Poor UX on small phones | Test on 375x667 viewport; reduce gap/padding if needed; minimum pad height 70px |
| Drag conflicts with pad tap on touch | Accidental sounds or failed drags | Edit mode disables sound playback; require long-press or explicit button to enter edit mode |
| Drag library adds bundle size | Slower load | Evaluate `@dnd-kit/core` (~5 KB gz) vs native drag events; set 50 KB bundle budget for this feature |
| Synthesised cowbell/ride sound quality | Sounds unrealistic | Iterate on synthesis parameters; good enough for a pocket drum app — not aiming for studio fidelity |
| localStorage pad order breaks if pad IDs change | Layout resets unexpectedly | Validate stored order against current `PAD_CONFIG` on load; fall back to default if invalid |

---

## 8. Resolved Questions

1. **Keyboard mapping:** Position-based. All 10 positions have shortcuts. Q/W/A/S/Z/X/E/D/C/V. **Confirmed.**
2. **Additional sounds:** Crash, tambourine, rim shot added as swappable extras. Grid stays at 10 pads max. Users swap them in via edit mode. **Confirmed.**
3. **Wider screens/tablets:** Not in scope. Mobile-first only. **Confirmed.**

---

## 9. Success Metrics

- Users can rearrange pads and their layout persists (functional test)
- All 10 sounds are distinct and usable
- No measurable increase in audio latency
- App remains under 100 KB total bundle (gzipped)
