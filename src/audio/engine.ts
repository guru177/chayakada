import type { SoundId, Volumes } from "../data";
import { AMBIENCE_LOOPS, radioPlaylist, RADIO_PLAYLISTS } from "../data";

type Layer = {
  gain: GainNode;
  panner: StereoPannerNode;
  stop: () => void;
};

function noiseBuffer(ctx: AudioContext, seconds: number, color: "white" | "pink" | "brown") {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === "white") {
      data[i] = white;
    } else if (color === "brown") {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

function loopNoise(
  ctx: AudioContext,
  dest: AudioNode,
  color: "white" | "pink" | "brown",
  filter?: { type: BiquadFilterType; freq: number; q?: number },
) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 3.2, color);
  src.loop = true;
  let node: AudioNode = src;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type;
    f.frequency.value = filter.freq;
    f.Q.value = filter.q ?? 0.7;
    src.connect(f);
    node = f;
  }
  node.connect(dest);
  src.start();
  return () => {
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
    src.disconnect();
  };
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private vibe: BiquadFilterNode | null = null;
  private master: GainNode | null = null;
  private layers = new Map<SoundId, Layer>();
  private musicTimer: number | null = null;
  private musicOsc: OscillatorNode | null = null;
  private songEl: HTMLAudioElement | null = null;
  private songNode: MediaElementAudioSourceNode | null = null;
  private songDest: AudioNode | null = null;
  private ambienceEls = new Map<SoundId, HTMLAudioElement>();
  private trackIndex = 0;
  private playlistId = RADIO_PLAYLISTS[0].id;
  private shuffled = false;
  private masterValue = 0.85;
  private runId = 0;
  playing = false;
  vibeOn = false;
  spatialOn = false;
  onTrackEnded: (() => void) | null = null;

  private ensure() {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.25;

    const vibe = ctx.createBiquadFilter();
    vibe.type = "lowpass";
    vibe.frequency.value = 18000;
    vibe.Q.value = 0.4;

    const master = ctx.createGain();
    master.gain.value = 0.85;

    vibe.connect(compressor);
    compressor.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.vibe = vibe;
    this.master = master;
    return ctx;
  }

  private makeLayer(id: SoundId): Layer {
    const ctx = this.ensure();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;
    panner.connect(gain);
    gain.connect(this.vibe!);

    const stops: Array<() => void> = [];
    const loopUrl = id === "music" ? undefined : AMBIENCE_LOOPS[id];

    if (id === "music") {
      this.startRadio(panner);
      stops.push(() => this.stopRadio());
    } else if (loopUrl) {
      this.startFileLoop(id, loopUrl, panner, stops);
    } else if (id === "rain") {
      stops.push(loopNoise(ctx, panner, "white", { type: "highpass", freq: 400, q: 0.5 }));
      stops.push(loopNoise(ctx, panner, "pink", { type: "bandpass", freq: 1800, q: 0.6 }));
    } else if (id === "thunder") {
      const rumble = ctx.createGain();
      rumble.gain.value = 0;
      rumble.connect(panner);
      stops.push(loopNoise(ctx, rumble, "brown", { type: "lowpass", freq: 180, q: 0.8 }));
      const runId = this.runId;
      let timer = 0;
      const tick = () => {
        if (!this.playing || !this.ctx || this.runId !== runId) return;
        const now = this.ctx.currentTime;
        rumble.gain.cancelScheduledValues(now);
        rumble.gain.setValueAtTime(0, now);
        rumble.gain.linearRampToValueAtTime(0.9, now + 0.08);
        rumble.gain.exponentialRampToValueAtTime(0.001, now + 2.4 + Math.random() * 1.6);
        timer = window.setTimeout(tick, 6000 + Math.random() * 10000);
      };
      timer = window.setTimeout(tick, 2000);
      stops.push(() => clearTimeout(timer));
    } else if (id === "crickets") {
      const chirpGain = ctx.createGain();
      chirpGain.gain.value = 0;
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = 4200;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = 4500;
      filt.Q.value = 8;
      osc.connect(filt);
      filt.connect(chirpGain);
      chirpGain.connect(panner);
      osc.start();
      const runId = this.runId;
      let timer = 0;
      const pulse = () => {
        if (!this.playing || !this.ctx || this.runId !== runId) return;
        const now = this.ctx.currentTime;
        chirpGain.gain.setValueAtTime(0, now);
        chirpGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
        chirpGain.gain.linearRampToValueAtTime(0, now + 0.08);
        timer = window.setTimeout(pulse, 140 + Math.random() * 220);
      };
      timer = window.setTimeout(pulse, 200);
      stops.push(() => {
        clearTimeout(timer);
        osc.stop();
        osc.disconnect();
      });
    } else if (id === "chatting") {
      const voice = ctx.createGain();
      voice.gain.value = 0.35;
      stops.push(loopNoise(ctx, voice, "pink", { type: "bandpass", freq: 900, q: 1.4 }));
      voice.connect(panner);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 2.4;
      lfoGain.gain.value = 0.22;
      lfo.connect(lfoGain);
      lfoGain.connect(voice.gain);
      lfo.start();
      stops.push(() => {
        lfo.stop();
        lfo.disconnect();
      });
    } else if (id === "fire") {
      stops.push(loopNoise(ctx, panner, "pink", { type: "lowpass", freq: 700, q: 0.7 }));
      const popGain = ctx.createGain();
      popGain.gain.value = 0;
      popGain.connect(panner);
      stops.push(loopNoise(ctx, popGain, "white", { type: "highpass", freq: 2500, q: 0.8 }));
      const runId = this.runId;
      let timer = 0;
      const pop = () => {
        if (!this.playing || !this.ctx || this.runId !== runId) return;
        const now = this.ctx.currentTime;
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(0.45, now + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        timer = window.setTimeout(pop, 180 + Math.random() * 520);
      };
      timer = window.setTimeout(pop, 300);
      stops.push(() => clearTimeout(timer));
    } else if (id === "birds") {
      const birdGain = ctx.createGain();
      birdGain.gain.value = 0;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 1800;
      osc.connect(birdGain);
      birdGain.connect(panner);
      osc.start();
      const runId = this.runId;
      let timer = 0;
      const sing = () => {
        if (!this.playing || !this.ctx || this.runId !== runId) return;
        const now = this.ctx.currentTime;
        const f = 1400 + Math.random() * 1800;
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.linearRampToValueAtTime(f + 400 * (Math.random() - 0.5), now + 0.18);
        birdGain.gain.setValueAtTime(0, now);
        birdGain.gain.linearRampToValueAtTime(0.16, now + 0.04);
        birdGain.gain.linearRampToValueAtTime(0, now + 0.22);
        timer = window.setTimeout(sing, 900 + Math.random() * 2200);
      };
      timer = window.setTimeout(sing, 400);
      stops.push(() => {
        clearTimeout(timer);
        osc.stop();
        osc.disconnect();
      });
    } else if (id === "wind") {
      const windGain = ctx.createGain();
      windGain.gain.value = 0.55;
      stops.push(loopNoise(ctx, windGain, "pink", { type: "lowpass", freq: 420, q: 0.5 }));
      windGain.connect(panner);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(windGain.gain);
      lfo.start();
      stops.push(() => {
        lfo.stop();
        lfo.disconnect();
      });
    } else if (id === "kettle") {
      const rumble = ctx.createGain();
      rumble.gain.value = 0.32;
      rumble.connect(panner);
      stops.push(loopNoise(ctx, rumble, "brown", { type: "lowpass", freq: 170, q: 0.9 }));
      const hiss = ctx.createGain();
      hiss.gain.value = 0.2;
      hiss.connect(panner);
      stops.push(loopNoise(ctx, hiss, "white", { type: "highpass", freq: 2600, q: 0.55 }));
      const steamLfo = ctx.createOscillator();
      const steamDepth = ctx.createGain();
      steamLfo.frequency.value = 0.22;
      steamDepth.gain.value = 0.08;
      steamLfo.connect(steamDepth);
      steamDepth.connect(hiss.gain);
      steamLfo.start();
      const bubble = ctx.createGain();
      bubble.gain.value = 0;
      bubble.connect(panner);
      stops.push(loopNoise(ctx, bubble, "white", { type: "bandpass", freq: 480, q: 2.8 }));
      const runId = this.runId;
      let timer = 0;
      const simmer = () => {
        if (!this.playing || !this.ctx || this.runId !== runId) return;
        const now = this.ctx.currentTime;
        bubble.gain.setValueAtTime(0, now);
        bubble.gain.linearRampToValueAtTime(0.28, now + 0.012);
        bubble.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        timer = window.setTimeout(simmer, 70 + Math.random() * 220);
      };
      timer = window.setTimeout(simmer, 180);
      stops.push(() => {
        clearTimeout(timer);
        steamLfo.stop();
        steamLfo.disconnect();
      });
    }

    return {
      gain,
      panner,
      stop: () => stops.forEach((fn) => fn()),
    };
  }

  private startFileLoop(id: SoundId, url: string, dest: AudioNode, stops: Array<() => void>) {
    const ctx = this.ensure();
    const el = new Audio(url);
    el.loop = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    const node = ctx.createMediaElementSource(el);
    node.connect(dest);
    this.ambienceEls.set(id, el);
    void el.play().catch(() => {
      /* start() retries after the user click */
    });
    stops.push(() => {
      el.pause();
      el.removeAttribute("src");
      el.load();
      node.disconnect();
      this.ambienceEls.delete(id);
    });
  }

  private ensureSong(dest: AudioNode) {
    const ctx = this.ensure();
    if (!this.songEl) {
      this.songEl = new Audio();
      this.songEl.preload = "auto";
      this.songEl.crossOrigin = "anonymous";
      this.songEl.addEventListener("ended", () => this.onTrackEnded?.());
      this.songNode = ctx.createMediaElementSource(this.songEl);
    }
    if (this.songDest !== dest && this.songNode) {
      try {
        this.songNode.disconnect();
      } catch {
        /* not connected yet */
      }
      this.songNode.connect(dest);
      this.songDest = dest;
    }
  }

  private tracks() {
    return radioPlaylist(this.playlistId).tracks;
  }

  private currentTrack() {
    const list = this.tracks();
    return list[this.trackIndex] ?? list[0];
  }

  private startRadio(dest: AudioNode) {
    this.stopRadio();
    const track = this.currentTrack();
    if (track?.src) {
      this.ensureSong(dest);
      const el = this.songEl!;
      el.src = track.src;
      el.volume = 1;
      el.currentTime = 0;
      void el.play().catch(() => {
        /* user gesture required; toggleRadio/start already clicked */
      });
      return;
    }
    this.startGeneratedRadio(dest);
  }

  private startGeneratedRadio(dest: AudioNode) {
    this.stopRadio();
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 1400;
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.22;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    osc.connect(filt);
    filt.connect(dest);
    filt.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(dest);
    osc.start();
    this.musicOsc = osc;

    const scales = [
      [196, 220, 247, 294, 330, 392],
      [174, 196, 220, 261, 293, 349],
      [146, 174, 196, 220, 261, 293],
      [130, 155, 174, 196, 233, 261],
    ];
    const scale = scales[this.trackIndex % scales.length];
    const step = () => {
      if (!this.musicOsc || !this.ctx) return;
      const note = scale[Math.floor(Math.random() * scale.length)];
      this.musicOsc.frequency.setTargetAtTime(note, this.ctx.currentTime, 0.04);
      this.musicTimer = window.setTimeout(step, 420 + Math.random() * 380);
    };
    step();
  }

  private stopRadio() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicOsc) {
      try {
        this.musicOsc.stop();
      } catch {
        /* already stopped */
      }
      this.musicOsc.disconnect();
      this.musicOsc = null;
    }
    if (this.songEl) {
      this.songEl.pause();
    }
  }

  async start(volumes: Volumes) {
    const ctx = this.ensure();
    if (ctx.state === "suspended") await ctx.resume();
    if (!this.playing) {
      (Object.keys(volumes) as SoundId[]).forEach((id) => {
        if (!this.layers.has(id)) this.layers.set(id, this.makeLayer(id));
      });
      this.playing = true;
    }
    this.setVolumes(volumes);
    this.setVibe(this.vibeOn);
    this.setSpatial(this.spatialOn);
    this.setMasterVolume(this.masterValue);
    this.ambienceEls.forEach((el, id) => {
      if (volumes[id] > 0.02) void el.play().catch(() => {});
    });
  }

  stop() {
    this.runId += 1;
    this.ambienceEls.forEach((el) => el.pause());
    this.layers.forEach((layer) => {
      layer.gain.gain.setTargetAtTime(0, this.ctx?.currentTime ?? 0, 0.08);
    });
    this.playing = false;
    window.setTimeout(() => {
      if (this.playing) return;
      this.layers.forEach((layer) => layer.stop());
      this.layers.clear();
    }, 400);
  }

  setVolumes(volumes: Volumes) {
    const now = this.ctx?.currentTime ?? 0;
    this.layers.forEach((layer, id) => {
      const target = this.playing ? Math.max(0, Math.min(1, volumes[id])) * (id === "music" ? 1 : 0.55) : 0;
      layer.gain.gain.setTargetAtTime(target, now, 0.08);
    });
    const el = this.songEl;
    const file = Boolean(this.currentTrack()?.src);
    if (el && file && this.playing) {
      if (volumes.music > 0.02) {
        if (el.paused && el.src) void el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
    this.ambienceEls.forEach((loop, id) => {
      if (!this.playing) {
        loop.pause();
        return;
      }
      if (volumes[id] > 0.02) {
        if (loop.paused) void loop.play().catch(() => {});
      } else {
        loop.pause();
      }
    });
  }

  setMasterVolume(value: number) {
    this.masterValue = Math.max(0, Math.min(1, value));
    this.ensure();
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(this.masterValue, this.ctx.currentTime, 0.05);
  }

  setVibe(on: boolean) {
    this.vibeOn = on;
    if (!this.vibe) return;
    this.vibe.frequency.setTargetAtTime(on ? 720 : 18000, this.ctx!.currentTime, 0.08);
  }

  setSpatial(on: boolean) {
    this.spatialOn = on;
    this.layers.forEach((layer, id) => {
      const spread: Record<SoundId, number> = {
        rain: -0.35,
        thunder: 0.15,
        crickets: 0.55,
        chatting: -0.2,
        fire: 0.05,
        birds: 0.45,
        wind: -0.5,
        kettle: 0.28,
        music: 0,
      };
      layer.panner.pan.setTargetAtTime(on ? spread[id] : 0, this.ctx!.currentTime, 0.12);
    });
  }

  setPlaylist(id: string) {
    const nextId = radioPlaylist(id).id;
    if (this.playlistId === nextId) return this.trackIndex;
    this.playlistId = nextId;
    this.trackIndex = 0;
    const music = this.layers.get("music");
    if (music && this.playing) {
      this.stopRadio();
      this.startRadio(music.panner);
    }
    return this.trackIndex;
  }

  setTrack(index: number) {
    const len = this.tracks().length;
    this.trackIndex = len ? (index + len) % len : 0;
    const music = this.layers.get("music");
    if (music && this.playing) {
      this.stopRadio();
      this.startRadio(music.panner);
    }
    return this.trackIndex;
  }

  private otherTrack() {
    const len = this.tracks().length;
    if (len < 2) return this.trackIndex;
    let next = this.trackIndex;
    while (next === this.trackIndex) {
      next = Math.floor(Math.random() * len);
    }
    return next;
  }

  nextTrack() {
    if (this.shuffled) return this.setTrack(this.otherTrack());
    return this.setTrack(this.trackIndex + 1);
  }

  prevTrack() {
    if (this.shuffled) return this.setTrack(this.otherTrack());
    return this.setTrack(this.trackIndex - 1);
  }

  shuffle() {
    this.shuffled = !this.shuffled;
    if (this.shuffled) return this.setTrack(this.otherTrack());
    return this.trackIndex;
  }

  getTrackIndex() {
    return this.trackIndex;
  }

  hasFileTrack() {
    return Boolean(this.currentTrack()?.src);
  }

  getDuration() {
    const d = this.songEl?.duration;
    if (this.hasFileTrack() && d && Number.isFinite(d) && d > 0) return d;
    return 310;
  }

  getCurrentTime() {
    if (this.hasFileTrack() && this.songEl) return this.songEl.currentTime || 0;
    return 0;
  }

  seek(seconds: number) {
    if (!this.songEl || !this.hasFileTrack()) return;
    const d = this.getDuration();
    this.songEl.currentTime = Math.max(0, Math.min(d, seconds));
  }
}

export const engine = new AudioEngine();
