# 🥁 Pocket Drums - Product Requirements Document

## 1. Objective

Create a mobile-first web app that turns a smartphone into a responsive, touch-based drum pad.

Success criteria:
- User can play sounds instantly with no noticeable latency
- User can record and loop beats within seconds
- App is usable immediately with zero onboarding

---

## 2. Target Users

### Primary
- Casual users looking for quick interaction
- Music beginners

### Secondary
- Content creators (TikTok / Instagram)
- Amateur music producers

---

## 3. Core Experience

### Entry Flow
1. User lands on the site
2. Drum pads are immediately visible
3. User taps → sound plays instantly

No login required.

---

## 4. Core Features (MVP)

### 4.1 Drum Pad Interface
- 6 pads in a 2x3 grid
- Each pad mapped to a sound:
  - Kick
  - Snare
  - Hi-hat
  - Open hat
  - Tom
  - Clap

#### Requirements
- <50ms perceived latency
- Visual feedback on tap
- Multi-touch support

---

### 4.2 Sound Engine
- Use Web Audio API (AudioContext + buffers)
- Preload all sounds on app load
- Avoid re-instantiating audio on each tap

---

### 4.3 Record & Loop
Controls:
- Record
- Stop
- Play loop
- Clear

#### Behaviour
- Capture timing of taps
- Loop playback continuously
- Loop length defined by recording duration

---

### 4.4 Sound Packs (Post-MVP)
- Classic kit
- Electronic kit
- 808 kit

---

## 5. Future Features (V2+)

### 5.1 Custom Sound Recording
- Record audio via microphone
- Assign recording to a pad

### 5.2 Shareable Loops
- Generate link for playback

### 5.3 Haptic Feedback
- Vibrate on tap (mobile only)

---

## 6. UX Principles

- Instant feedback (no lag)
- Thumb-friendly layout
- Zero onboarding
- Play within 1 second of load

---

## 7. Technical Approach

### Frontend
- Vite
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Audio
- Web Audio API
- AudioContext with preloaded buffers

### State Management
- Local React state

### Storage
- LocalStorage (for saved loops)

---

## 8. Key Risks

### Latency
- Must preload sounds
- Avoid runtime audio creation

### Mobile Browser Constraints
- iOS requires user interaction before audio playback

### Performance
- Avoid heavy effects

---

## 9. MVP Scope

Must include:
- 6 drum pads
- Instant playback
- Record + loop
- Single sound kit

---

## 10. Build Plan

1. Create grid UI (no sound)
2. Add single pad with sound
3. Expand to 6 pads
4. Add multi-touch support
5. Implement recording
6. Implement loop playback
7. Add visual feedback and polish

---

## 11. Definition of Done

- User can tap pads and hear immediate sound
- User can record and replay a loop
- No noticeable lag on modern mobile devices
- UI is responsive and touch-friendly