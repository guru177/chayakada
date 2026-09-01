# Kattan Chaya — ambience mixer

This site is a vintage Kerala tea-shop soundscape. Rain, thunder, fire, birds, wind, kada chatter, and a lo-fi radio are **synthesized in the browser** with the Web Audio API. Original copyrighted songs are not streamed.

Open **http://localhost:5174/#ambience** (or `/#ambience` on whatever port Vite prints) after `npm run dev`.

Headphones help. Browsers only start audio after a click — turning a knob, tapping a preset, or pressing play counts.

---

## What each control does

### Presets
Pills along the top load a full mix and start playback:

| Preset | What you hear |
| --- | --- |
| Rain / മഴ | Heavy rain, light thunder and wind |
| Tea Time / ചായ സമയം | Chatter, birds, a little radio |
| Study / പഠനം | Soft birds, low rain, quiet music |
| Monsoon / മഴക്കാലം | Rain, thunder, fire, chatter |
| Night / രാത്രി | Crickets, chatter, low rain |
| Today / ഇന്നത്തേത് | A random mix |

Tweaking any knob after a preset leaves that preset (the pill is no longer highlighted).

### Sleep
**30m / 60m / 90m** stops the whole mix when the timer ends. Tap the active time again to cancel.

### Vibe
**CLEAR** is the full-frequency mix. **VIBE** is a warm low-pass (muffled, like a room next door).

### Spatial
**STEREO** is centered. **SPATIAL** pans layers (rain left, birds right, and so on) so the stall feels wider.

### Sound cards
Seven layers: Rain, Thunder, Crickets, Chatting, Fireplace, Birds, Wind.

- Tap the **name/icon** to toggle that layer on (~55%) or off.
- Drag the **knob** up/down to set volume. Dragging above a whisper also **starts** the engine if it was stopped.
- The bar visualizer animates only while that layer is audible.

### Radio (പാട്ടുകൾ)
Titles are original Malayalam names on **Kada Radio**. If a track has no `src` file, you hear a generated pentatonic loop. If you add a file (see below), play/seek/next use that recording.

- **Play / pause** starts or mutes **only the radio**. Rain and the other layers keep going.
- **Prev / next** change station.
- **Shuffle** picks a random other station, then keeps next/prev random until you turn it off.
- **Repeat** replays the current station when it ends. Next still skips.
- The **vertical slider** is radio volume; moving it up starts playback if needed.
- The **seek bar** follows the file (or a 5:10 clock for generated radio).

### Master volume
The long gold slider at the bottom is the output gain for **everything**.

### Adding your own songs and loops
Copyrighted songs from other sites are not bundled. Drop files you have rights to in `public/audio/` and list them in `src/data.ts`. Step-by-step: [public/audio/README.md](../public/audio/README.md).

---

## How the audio engine works

```
UI (AmbiencePanel / Mixer)
        │
        ▼
AudioProvider  src/context.tsx
  volumes, playing, vibe, spatial,
  sleep, track, shuffle, repeat
        │
        ▼
AudioEngine    src/audio/engine.ts   (singleton)
        │
        ▼
Web Audio graph
```

### Graph

Each sound is a **layer**: generators → stereo panner → layer gain → vibe filter → compressor → master gain → speakers.

| Layer | How it is made |
| --- | --- |
| Rain | Looped white + pink noise, highpass / bandpass |
| Thunder | Brown noise rumble, triggered every few seconds |
| Crickets | Band-passed square chirps |
| Chatting | Pink noise through a voice-like bandpass, amplitude LFO |
| Fire | Low pink noise + random white pops |
| Birds | Short sine glides at random pitches |
| Wind | Pink noise, slow gain LFO |
| Music | Triangle oscillator, delayed, on a scale picked by station |

Volumes in the UI are 0–1. The engine scales ambience to ~0.55 and radio to ~0.35 so the mix does not clip.

### Start / stop
A click or knob move calls `engine.start(volumes)`, which resumes the `AudioContext` (required by the browser) and builds any missing layers. **Stop** (sleep timer, or the Pomodoro mixer’s global pause) fades gains, then tears the generators down.

Vibe, spatial, and master are stored even before the first note, then applied on start so toggles are not lost.

### Files

| File | Role |
| --- | --- |
| `src/audio/engine.ts` | Web Audio graph, synthesis, radio, pan, filters |
| `src/context.tsx` | React API used by every control |
| `src/data.ts` | Presets, default volumes, radio titles, labels |
| `src/components/AmbiencePanel.tsx` | Home-page vintage mixer |
| `src/components/Mixer.tsx` | Compact mixer on `/pomodoro` |
| `src/pages/Home.tsx` | Hero, story, `#ambience` section |

The same `AudioProvider` wraps the whole app, so a mix started on the home page continues on the Pomodoro page.

---

## Quick check

1. Click **Tea Time** — you should hear chatter and birds within a second.
2. Drag **Rain** up — rain should layer in; the Rain preset highlight should clear.
3. Turn **Vibe** on — the mix should go duller.
4. Turn **Spatial** on — rain and birds should sit in different places.
5. Press radio **play** — a melody should appear without killing the rain.
6. Press radio **pause** — melody gone, rain still there.
7. Set **Sleep 30m** — the pill stays on; cancel by tapping it again (do not wait 30 minutes).
8. Drag **master** down — everything gets quieter, including radio.
