import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { engine } from "./audio/engine";
import {
  AMBIENCE_IDS,
  DEFAULT_VOLUMES,
  PRESETS,
  RADIO_PLAYLISTS,
  radioPlaylist,
  type RadioTrack,
  type SoundId,
  type Volumes,
} from "./data";

type AudioApi = {
  playing: boolean;
  volumes: Volumes;
  vibe: boolean;
  spatial: boolean;
  presetId: string | null;
  sleepUntil: number | null;
  sleepMinutes: number | null;
  shuffled: boolean;
  repeat: boolean;
  setRepeat: (on: boolean) => void;
  trackIndex: number;
  playlistOpen: boolean;
  setPlaylistOpen: (open: boolean) => void;
  toggle: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => void;
  setVolume: (id: SoundId, value: number) => void;
  applyPreset: (id: string) => Promise<void>;
  applyToday: () => Promise<void>;
  setVibe: (on: boolean) => void;
  setSpatial: (on: boolean) => void;
  setSleep: (minutes: number | null) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrack: (index: number) => void;
  shuffle: () => void;
  toggleRadio: () => Promise<void>;
  muteRadio: () => void;
  playlistId: string;
  playlistTracks: RadioTrack[];
  setPlaylist: (id: string) => void;
  endTrack: () => void;
  seek: (seconds: number) => void;
  getTrackTime: () => number;
  getTrackDuration: () => number;
  trackHasFile: boolean;
  trackTitle: string;
  trackArtist: string;
  masterVolume: number;
  setMasterVolume: (value: number) => void;
  toggleGroup: (group: "rain" | "asmr" | "songs" | "chatter") => Promise<void>;
  groupOn: Record<"rain" | "asmr" | "songs" | "chatter", boolean>;
  ambienceOn: boolean;
  toggleAmbience: () => Promise<void>;
};

const AudioCtx = createContext<AudioApi | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Volumes>({ ...DEFAULT_VOLUMES });
  const [vibe, setVibeState] = useState(false);
  const [spatial, setSpatialState] = useState(false);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [sleepUntil, setSleepUntil] = useState<number | null>(null);
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(0.85);
  const [playlistId, setPlaylistId] = useState(RADIO_PLAYLISTS[0].id);
  const sleepRef = useRef<number | null>(null);
  const volumesRef = useRef(volumes);
  volumesRef.current = volumes;
  const ambienceSnap = useRef<Volumes | null>(null);

  const api = useMemo<AudioApi>(() => {
    const applyFx = () => {
      engine.setMasterVolume(masterVolume);
      engine.setVibe(vibe);
      engine.setSpatial(spatial);
    };

    const apply = async (next: Volumes, autoPlay = true) => {
      volumesRef.current = next;
      setVolumes(next);
      if (autoPlay) {
        await engine.start(next);
        applyFx();
        setPlaying(true);
      } else if (engine.playing) {
        engine.setVolumes(next);
      }
    };

    return {
      playing,
      volumes,
      vibe,
      spatial,
      presetId,
      sleepUntil,
      sleepMinutes,
      shuffled,
      repeat,
      setRepeat,
      trackIndex,
      playlistOpen,
      setPlaylistOpen,
      toggle: async () => {
        if (playing) {
          engine.stop();
          setPlaying(false);
        } else {
          await engine.start(volumesRef.current);
          applyFx();
          setPlaying(true);
        }
      },
      start: async () => {
        await engine.start(volumesRef.current);
        applyFx();
        setPlaying(true);
      },
      stop: () => {
        engine.stop();
        setPlaying(false);
      },
      setVolume: (id, value) => {
        const next = { ...volumesRef.current, [id]: value };
        volumesRef.current = next;
        setVolumes(next);
        setPresetId(null);
        if (value > 0.04 && !engine.playing) {
          void engine.start(next).then(() => {
            applyFx();
            setPlaying(true);
          });
          return;
        }
        if (engine.playing) engine.setVolumes(next);
      },
      applyPreset: async (id) => {
        const preset = PRESETS.find((p) => p.id === id);
        if (!preset) return;
        setPresetId(id);
        await apply(preset.volumes);
      },
      applyToday: async () => {
        const next: Volumes = { ...DEFAULT_VOLUMES };
        (Object.keys(next) as SoundId[]).forEach((key) => {
          next[key] = Math.round((0.15 + Math.random() * 0.7) * 100) / 100;
        });
        next.music = Math.round((0.15 + Math.random() * 0.4) * 100) / 100;
        setPresetId("today");
        await apply(next);
      },
      setVibe: (on) => {
        setVibeState(on);
        engine.setVibe(on);
      },
      setSpatial: (on) => {
        setSpatialState(on);
        engine.setSpatial(on);
      },
      setSleep: (minutes) => {
        if (sleepRef.current) window.clearTimeout(sleepRef.current);
        if (!minutes) {
          setSleepUntil(null);
          setSleepMinutes(null);
          return;
        }
        setSleepMinutes(minutes);
        const until = Date.now() + minutes * 60_000;
        setSleepUntil(until);
        sleepRef.current = window.setTimeout(() => {
          engine.stop();
          setPlaying(false);
          setSleepUntil(null);
          setSleepMinutes(null);
        }, minutes * 60_000);
      },
      nextTrack: () => {
        setTrackIndex(engine.nextTrack());
      },
      prevTrack: () => setTrackIndex(engine.prevTrack()),
      setTrack: (index: number) => setTrackIndex(engine.setTrack(index)),
      shuffle: () => {
        setShuffled((s) => !s);
        setTrackIndex(engine.shuffle());
      },
      playlistId,
      playlistTracks: radioPlaylist(playlistId).tracks,
      setPlaylist: (id: string) => {
        setPlaylistId(radioPlaylist(id).id);
        setTrackIndex(engine.setPlaylist(id));
      },
      toggleRadio: async () => {
        const current = volumesRef.current;
        if (!playing) {
          const next = current.music < 0.05 ? { ...current, music: 0.85 } : current;
          volumesRef.current = next;
          setVolumes(next);
          await engine.start(next);
          applyFx();
          setPlaying(true);
          return;
        }
        if (current.music < 0.05) {
          const next = { ...current, music: 0.85 };
          volumesRef.current = next;
          setVolumes(next);
          engine.setVolumes(next);
          return;
        }
        const next = { ...current, music: 0 };
        volumesRef.current = next;
        setVolumes(next);
        engine.setVolumes(next);
      },
      muteRadio: () => {
        const current = volumesRef.current;
        if (current.music <= 0) return;
        const next = { ...current, music: 0 };
        volumesRef.current = next;
        setVolumes(next);
        if (engine.playing) engine.setVolumes(next);
      },
      endTrack: () => {
        if (repeat) {
          setTrackIndex(engine.setTrack(engine.getTrackIndex()));
          return;
        }
        setTrackIndex(engine.nextTrack());
      },
      seek: (seconds: number) => engine.seek(seconds),
      getTrackTime: () => engine.getCurrentTime(),
      getTrackDuration: () => engine.getDuration(),
      trackHasFile: Boolean(radioPlaylist(playlistId).tracks[trackIndex]?.src),
      trackTitle: radioPlaylist(playlistId).tracks[trackIndex]?.title ?? "",
      trackArtist: radioPlaylist(playlistId).tracks[trackIndex]?.artist ?? "",
      masterVolume,
      setMasterVolume: (value: number) => {
        setMasterVolumeState(value);
        engine.setMasterVolume(value);
      },
      toggleGroup: async (group) => {
        const map = {
          rain: ["rain", "thunder", "wind"] as SoundId[],
          asmr: ["fire", "crickets", "birds", "kettle"] as SoundId[],
          songs: ["music"] as SoundId[],
          chatter: ["chatting"] as SoundId[],
        };
        const keys = map[group];
        const on = keys.some((k) => volumesRef.current[k] > 0.04);
        const next = { ...volumesRef.current };
        const defaults: Volumes = { ...DEFAULT_VOLUMES, music: 0.52 };
        keys.forEach((k) => {
          next[k] = on ? 0 : defaults[k];
        });
        setVolumes(next);
        setPresetId(null);
        await engine.start(next);
        setPlaying(true);
      },
      groupOn: {
        rain: volumes.rain > 0.04 || volumes.thunder > 0.04 || volumes.wind > 0.04,
        asmr: volumes.fire > 0.04 || volumes.crickets > 0.04 || volumes.birds > 0.04 || volumes.kettle > 0.04,
        songs: volumes.music > 0.04,
        chatter: volumes.chatting > 0.04,
      },
      ambienceOn: AMBIENCE_IDS.some((id) => volumes[id] > 0.02),
      toggleAmbience: async () => {
        const current = volumesRef.current;
        const anyOn = AMBIENCE_IDS.some((id) => current[id] > 0.02);
        const next = { ...current };
        if (anyOn) {
          ambienceSnap.current = { ...current };
          AMBIENCE_IDS.forEach((id) => {
            next[id] = 0;
          });
        } else {
          const snap = ambienceSnap.current ?? DEFAULT_VOLUMES;
          AMBIENCE_IDS.forEach((id) => {
            next[id] = snap[id] > 0.02 ? snap[id] : DEFAULT_VOLUMES[id];
          });
        }
        volumesRef.current = next;
        setVolumes(next);
        setPresetId(null);
        const shouldPlay = AMBIENCE_IDS.some((id) => next[id] > 0.04) || next.music > 0.04;
        if (shouldPlay && !engine.playing) {
          await engine.start(next);
          applyFx();
          setPlaying(true);
          return;
        }
        if (engine.playing) engine.setVolumes(next);
      },
    };
  }, [playing, volumes, vibe, spatial, presetId, sleepUntil, sleepMinutes, trackIndex, playlistOpen, masterVolume, shuffled, repeat, playlistId]);

  const repeatRef = useRef(repeat);
  repeatRef.current = repeat;

  useEffect(() => {
    engine.onTrackEnded = () => {
      if (repeatRef.current) {
        setTrackIndex(engine.setTrack(engine.getTrackIndex()));
        return;
      }
      setTrackIndex(engine.nextTrack());
    };
    return () => {
      engine.onTrackEnded = null;
    };
  }, []);

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
