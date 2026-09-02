import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { PRESETS, SOUND_META, type SoundId } from "../data";
import { useAudio } from "../context";
import { Pic } from "./Pic";

const PRESET_ORDER = ["rain", "chai-time", "study", "rain-evening", "night"];
const TRACK_SECS = 310;

const ICONS: Record<Exclude<SoundId, "music">, ReactNode> = {
  rain: (
    <svg viewBox="0 0 40 40"><path d="M12 18h16a6 6 0 0 0 0-12 9 9 0 0 0-17 2 5.5 5.5 0 0 0 1 10z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M14 23l-1.5 6M20 23.5 18 32M26 23l-1.5 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  thunder: (
    <svg viewBox="0 0 40 40"><path d="M22 8 14 22h8l-4 12 12-16h-8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  crickets: (
    <svg viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="8" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M14 20c-4-6 2-10 6-6M26 20c4-6-2-10-6-6M16 28l-4 4M24 28l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
  ),
  chatting: (
    <svg viewBox="0 0 40 40"><path d="M10 12h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6l-5 5v-5h-3a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="15" cy="19" r="1.2" fill="currentColor" /><circle cx="20" cy="19" r="1.2" fill="currentColor" /><circle cx="25" cy="19" r="1.2" fill="currentColor" /></svg>
  ),
  fire: (
    <svg viewBox="0 0 40 40"><path d="M20 8c4 6-2 8 0 14 6-4 10 2 8 8a10 10 0 1 1-16 0c0-6 6-10 8-22z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
  ),
  birds: (
    <svg viewBox="0 0 40 40"><path d="M8 22c8-2 12-8 14-14 2 6 6 10 12 12-8 2-12 6-14 14-2-6-6-10-12-12z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="24" cy="16" r="1.2" fill="currentColor" /></svg>
  ),
  wind: (
    <svg viewBox="0 0 40 40"><path d="M6 16h18a4 4 0 1 0-1-8M6 22h24a4 4 0 1 1-1 8M6 28h14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
};

function barsFor(seed: number) {
  return Array.from({ length: 14 }, (_, i) => 18 + ((Math.sin(seed * 1.7 + i * 0.85) + 1) / 2) * 72);
}

function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function RotaryKnob({
  value,
  onChange,
  active,
}: {
  value: number;
  onChange: (v: number) => void;
  active: boolean;
}) {
  const start = useRef<{ y: number; v: number } | null>(null);
  const angle = -135 + value * 270;

  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (!start.current) return;
    const next = start.current.v + (start.current.y - e.clientY) / 130;
    onChange(Math.max(0, Math.min(1, next)));
  };

  return (
    <button
      type="button"
      className={`mix-knob ${active ? "on" : ""}`}
      aria-label="Volume"
      style={{ ["--knob" as string]: `${angle}deg` }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { y: e.clientY, v: value };
        if (value > 0.04) onChange(value);
      }}
      onPointerMove={move}
      onPointerUp={(e) => {
        start.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      }}
      onPointerCancel={() => {
        start.current = null;
      }}
    >
      <span className="mix-knob-mark" />
    </button>
  );
}

export function AmbiencePanel() {
  const audio = useAudio();
  const ambient = Object.entries(SOUND_META) as [Exclude<SoundId, "music">, (typeof SOUND_META)["rain"]][];
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(TRACK_SECS);
  const orderedPresets = PRESET_ORDER.map((id) => PRESETS.find((p) => p.id === id)).filter(Boolean) as typeof PRESETS;
  const endRef = useRef(audio.endTrack);
  endRef.current = audio.endTrack;
  const fileTrack = audio.trackHasFile;

  useEffect(() => {
    if (!(audio.playing && audio.volumes.music > 0.02)) return;
    if (fileTrack) {
      const id = window.setInterval(() => {
        setProgress(audio.getTrackTime());
        setDuration(audio.getTrackDuration());
      }, 250);
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= TRACK_SECS) {
          window.setTimeout(() => endRef.current(), 0);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [audio.playing, audio.volumes.music, audio.trackIndex, fileTrack]);

  useEffect(() => {
    setProgress(0);
    setDuration(fileTrack ? audio.getTrackDuration() : TRACK_SECS);
  }, [audio.trackIndex, fileTrack]);

  const musicOn = audio.playing && audio.volumes.music > 0.02;

  return (
    <div className="mix-stage">
      <div className="mix-scrap" aria-hidden="true">
        <span className="mix-scrap-pin" />
        <Pic src="/images/mix-scrap.jpg" alt="" width={640} height={960} sizes="280px" />
      </div>
      <div className="mix-polaroid">
        <span className="mix-tape" />
        <Pic src="/images/shop-vintage.jpg" alt="" width={800} height={1200} sizes="220px" />
        <Pic className="mix-stamp" src="/images/seal-stamp.jpg" alt="" width={400} height={400} sizes="72px" />
      </div>

      <div className="mix-board">
        <span className="mix-rivet tl" aria-hidden />
        <span className="mix-rivet tr" aria-hidden />
        <span className="mix-rivet bl" aria-hidden />
        <span className="mix-rivet br" aria-hidden />
        <h2 className="mix-kicker">CHAYAKADA AMBIENCE MAKER</h2>
        <p className="mix-tagline">ചായക്കടയുടെ അന്തരീക്ഷം അനുഭവിക്കൂ</p>
        <p className="mix-sub">Sit back &amp; listen. Mix rain, radio, kettle &amp; old Malayalam songs.</p>
        <div className="mix-presets-label">പ്രീസെറ്റുകൾ · PRESETS</div>
        <div className="mix-presets">
          {orderedPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`mix-preset ${audio.presetId === p.id ? "on" : ""}`}
              onClick={() => audio.applyPreset(p.id)}
            >
              <span aria-hidden>{p.emoji}</span>
              <span className="mix-preset-ml">{p.ml}</span>
              <span className="mix-preset-en">{p.en}</span>
            </button>
          ))}
          <button
            type="button"
            className={`mix-preset ${audio.presetId === "today" ? "on" : ""}`}
            onClick={() => audio.applyToday()}
          >
            <span aria-hidden>✨</span>
            <span className="mix-preset-ml">ഇന്നത്തേത്</span>
            <span className="mix-preset-en">Today</span>
          </button>
        </div>

        <div className="mix-toolbar">
          <div className="mix-sleep">
            <span>SLEEP</span>
            {[30, 60, 90].map((m) => (
              <button
                key={m}
                type="button"
                className={audio.sleepMinutes === m ? "on" : ""}
                onClick={() => audio.setSleep(audio.sleepMinutes === m ? null : m)}
              >
                {m}m
              </button>
            ))}
          </div>
          <div className="mix-toggles">
            <button type="button" className="mix-switch" onClick={() => audio.setVibe(!audio.vibe)}>
              <span>VIBE</span>
              <span className={`mix-toggle ${audio.vibe ? "on" : ""}`} />
              <em>{audio.vibe ? "VIBE" : "CLEAR"}</em>
            </button>
            <button type="button" className="mix-switch" onClick={() => audio.setSpatial(!audio.spatial)}>
              <span>SPATIAL</span>
              <span className={`mix-toggle ${audio.spatial ? "on" : ""}`} />
              <em>{audio.spatial ? "SPATIAL" : "STEREO"}</em>
            </button>
          </div>
        </div>

        <div className="mix-grid">
          {ambient.map(([id, meta], idx) => {
            const vol = audio.volumes[id];
            const on = audio.playing && vol > 0.02;
            const bars = barsFor(idx + 3);
            return (
              <article className={`mix-ch ${on ? "on" : ""}`} key={id}>
                <button
                  type="button"
                  className="mix-ch-hit"
                  onClick={() => {
                    audio.setVolume(id, vol > 0.02 ? 0 : 0.55);
                  }}
                >
                  <span className="mix-ch-icon" style={{ color: `rgb(${meta.hue.join(",")})` }}>
                    {ICONS[id]}
                    <i className="mix-led" style={{ background: on ? `rgb(${meta.hue.join(",")})` : "#3a3228" }} />
                  </span>
                  <span>
                    <span className="mix-ch-ml">{meta.ml}</span>
                    <span className="mix-ch-en">{meta.en}</span>
                  </span>
                </button>
                <div className="mix-bars" aria-hidden>
                  {bars.map((h, i) => (
                    <span
                      key={i}
                      className={on && i < vol * 14 ? "live" : ""}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 45}ms`,
                        background: i < vol * 14 ? `rgba(${meta.hue[0]},${meta.hue[1]},${meta.hue[2]},${on ? 0.85 : 0.28})` : "rgba(60,48,36,0.2)",
                      }}
                    />
                  ))}
                </div>
                <div className="mix-dials">
                  <div className="mix-dial-row">
                    <button
                      type="button"
                      className={`mix-onoff ${on ? "is-on" : ""}`}
                      onClick={() => audio.setVolume(id, on ? 0 : vol > 0.02 ? vol : 0.55)}
                      aria-pressed={on}
                      aria-label={on ? "Turn off" : "Turn on"}
                    >
                      {on ? "ON" : "OFF"}
                    </button>
                    <RotaryKnob
                      value={vol}
                      active={on}
                      onChange={(v) => {
                        audio.setVolume(id, v);
                      }}
                    />
                    <span>{Math.round(vol * 100)}%</span>
                  </div>
                  <input
                    className="mix-dotbar"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={vol}
                    style={{ ["--vol" as string]: `${vol * 100}%` }}
                    onChange={(e) => audio.setVolume(id, Number(e.target.value))}
                    aria-label={`${meta.en} volume`}
                  />
                </div>
              </article>
            );
          })}

          <article className={`mix-ch mix-radio ${musicOn ? "on" : ""}`}>
            <div className="mix-ch-ml">പാട്ടുകൾ</div>
            <div className="mix-now-label">NOW PLAYING</div>
            <div className="mix-now-title">{audio.trackTitle}</div>
            <div className="mix-seek">
              <span>{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={Math.max(1, duration)}
                step={fileTrack ? 0.25 : 1}
                value={Math.min(progress, duration)}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setProgress(next);
                  if (fileTrack) audio.seek(next);
                  else if (next >= TRACK_SECS) audio.endTrack();
                }}
                aria-label="Seek"
              />
              <span>{formatTime(duration)}</span>
            </div>
            <div className="mix-transport">
              <button type="button" className={audio.shuffled ? "on" : ""} onClick={audio.shuffle} aria-label="Shuffle">
                🔀
              </button>
              <button type="button" onClick={audio.prevTrack} aria-label="Previous">⏮</button>
              <button
                type="button"
                className="mix-play"
                onClick={() => {
                  void audio.toggleRadio();
                }}
                aria-label={musicOn ? "Pause" : "Play"}
              >
                {musicOn ? "❚❚" : "▶"}
              </button>
              <button type="button" onClick={audio.nextTrack} aria-label="Next">⏭</button>
              <button type="button" className={audio.repeat ? "on" : ""} onClick={() => audio.setRepeat(!audio.repeat)} aria-label="Repeat">
                🔁
              </button>
            </div>
            <div className="mix-music-vol">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audio.volumes.music}
                onChange={(e) => audio.setVolume("music", Number(e.target.value))}
                aria-label="Radio volume"
              />
              <span>VOL</span>
            </div>
          </article>
        </div>

        <div className="mix-master">
          <span>MASTER VOLUME</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audio.masterVolume}
            onChange={(e) => audio.setMasterVolume(Number(e.target.value))}
            aria-label="Master volume"
          />
          <b>{Math.round(audio.masterVolume * 100)}%</b>
        </div>

        <div className="mix-board-foot">
          <Pic className="mix-props-img" src="/images/mix-kettle.jpg" alt="Brass kettle and a glass of kattan chaya" width={480} height={320} sizes="220px" />
          <p className="mix-phones">
            Put on your headphones. Close your eyes. You are now at Kattanchaya.
            <span aria-hidden> 🎧</span>
          </p>
        </div>
      </div>

      <div className="mix-perks">
        <div>
          <svg viewBox="0 0 36 36" aria-hidden><path d="M10 28 L12 10 h12 l2 18z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M24 16 q8 0 8 6 q0 6 -8 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          <strong>100% FREE</strong>
          <span>No Ads. No Login. Just pure nostalgia.</span>
        </div>
        <div>
          <svg viewBox="0 0 36 36" aria-hidden><path d="M8 32c2-10 4-18 6-26M18 32c1-12 2-20 3-26M28 32c-2-10-3-18-4-26" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M6 10c4 2 8-2 12 0M18 8c4 3 8-1 12 1" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          <strong>KERALA AMBIENCE</strong>
          <span>Curated sounds from Kerala&apos;s heart.</span>
        </div>
        <div>
          <svg viewBox="0 0 36 36" aria-hidden><circle cx="14" cy="22" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="14" cy="22" r="2" fill="currentColor" /><path d="M21 22 V8 h8 v4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          <strong>OLD MALAYALAM SONGS</strong>
          <span>Evergreen melodies that take you back.</span>
        </div>
        <div>
          <svg viewBox="0 0 36 36" aria-hidden><path d="M8 10 h10 v18 H8z M18 10 h10 v18 H18" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M18 10 q-4 4 0 8" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          <strong>STUDY &amp; FOCUS</strong>
          <span>Perfect for work, study &amp; relaxation.</span>
        </div>
        <div>
          <svg viewBox="0 0 36 36" aria-hidden><path d="M10 28 L12 10 h12 l2 18z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M16 8 q2-4 4 0" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          <strong>MADE WITH ♥</strong>
          <span>for chaya lovers</span>
        </div>
      </div>
    </div>
  );
}
