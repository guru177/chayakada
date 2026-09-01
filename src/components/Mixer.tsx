import { PRESETS, RADIO_TRACKS, SOUND_META, type SoundId } from "../data";
import { useAudio } from "../context";

function barsFor(seed: number) {
  return Array.from({ length: 20 }, (_, i) => 15 + ((Math.sin(seed * 1.7 + i * 0.9) + 1) / 2) * 70);
}

export function Mixer() {
  const audio = useAudio();
  const ambient = Object.entries(SOUND_META) as [Exclude<SoundId, "music">, (typeof SOUND_META)["rain"]][];

  return (
    <section className="mixer" aria-label="Songs & ASMR — Kerala ambient sounds">
      <div className="mixer-head">
        <div className="kicker">Sit back & listen</div>
        <h2 className="mixer-title">Songs & ASMR</h2>
        <p className="mixer-sub">Mix Kerala ambience sounds or tune into the kada radio</p>
      </div>

      <div className="label">Presets</div>
      <div className="preset-row">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className={`preset-pill ${audio.presetId === preset.id ? "active" : ""}`}
            onClick={() => audio.applyPreset(preset.id)}
          >
            <span>{preset.emoji}</span>
            <span className="font-malayalam" style={{ fontSize: 12 }}>
              {preset.ml}
            </span>
          </button>
        ))}
        <button className={`preset-pill ${audio.presetId === "today" ? "active" : ""}`} onClick={() => audio.applyToday()}>
          <span>✨</span>
          <span className="font-malayalam" style={{ fontSize: 12 }}>
            ഇന്നത്തേത്
          </span>
        </button>
      </div>

      <div className="control-row">
        <div className="control-group">
          <span className="label" style={{ margin: 0 }}>
            Sleep
          </span>
          {[30, 60, 90].map((m) => (
            <button
              key={m}
              className={`timer-pill ${audio.sleepMinutes === m ? "active" : ""}`}
              onClick={() => audio.setSleep(audio.sleepMinutes === m ? null : m)}
            >
              {m}m
            </button>
          ))}
        </div>
        <div className="control-group">
          <span className="toggle-label">Vibe</span>
          <div className={`toggle ${audio.vibe ? "on" : ""}`} onClick={() => audio.setVibe(!audio.vibe)}>
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-state">{audio.vibe ? "MUFFLED" : "CLEAR"}</span>
        </div>
        <div className="control-group">
          <span className="toggle-label">Spatial</span>
          <div className={`toggle ${audio.spatial ? "on" : ""}`} onClick={() => audio.setSpatial(!audio.spatial)}>
            <div className="toggle-thumb" />
          </div>
          <span className="toggle-state">{audio.spatial ? "WIDE" : "STEREO"}</span>
        </div>
      </div>

      <div className="sound-grid">
        {ambient.map(([id, meta], idx) => {
          const vol = audio.volumes[id];
          const on = audio.playing && vol > 0.02;
          const bars = barsFor(idx + 2);
          return (
            <div
              className={`sc ${on ? "on" : ""}`}
              key={id}
              onClick={() => audio.setVolume(id, vol > 0.02 ? 0 : 0.55)}
            >
              <div className="sc-head">
                <span className="sc-emoji">{meta.emoji}</span>
                <div>
                  <div className="sc-ml font-malayalam">{meta.ml}</div>
                  <div className="sc-en">{meta.en}</div>
                </div>
              </div>
              <div className="bars">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className={`bar ${on && i < vol * 20 ? "live" : ""}`}
                    style={{
                      height: `${h}%`,
                      background: on
                        ? `rgba(${meta.hue[0]}, ${meta.hue[1]}, ${meta.hue[2]}, 0.55)`
                        : i < vol * 20
                          ? `rgba(${meta.hue[0]}, ${meta.hue[1]}, ${meta.hue[2]}, 0.22)`
                          : "rgba(60, 48, 36, 0.18)",
                      animationDelay: `${i * 40}ms`,
                    }}
                  />
                ))}
              </div>
              <input
                className="vol-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={vol}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => audio.setVolume(id, Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, rgba(233,194,122,0.55) 0%, rgba(233,194,122,0.35) ${vol * 100}%, rgba(60,48,36,0.1) ${vol * 100}%, rgba(60,48,36,0.1) 100%)`,
                  opacity: on ? 1 : 0.45,
                }}
              />
              <div className="vol-meta">
                <span>{Math.round(vol * 100)}%</span>
                <span>{on ? "ON" : "OFF"}</span>
              </div>
            </div>
          );
        })}

        <div className={`sc ${audio.playing && audio.volumes.music > 0.02 ? "on" : ""}`}>
          <div className="sc-head">
            <span className="sc-emoji">🎵</span>
            <div>
              <div className="sc-ml font-malayalam">പാട്ടുകൾ</div>
              <div className="sc-en">Music</div>
            </div>
          </div>
          <div className="music-title">{audio.trackTitle}</div>
          <div className="music-controls">
            <button className="icon-btn" onClick={audio.prevTrack}>
              ⏮
            </button>
            <button
              className="icon-btn"
              onClick={() => {
                void audio.toggleRadio();
              }}
            >
              {audio.playing && audio.volumes.music > 0.02 ? "❚❚" : "▶"}
            </button>
            <button className="icon-btn" onClick={audio.nextTrack}>
              ⏭
            </button>
            <button className="icon-btn" onClick={audio.shuffle}>
              🔀
            </button>
            <button className="icon-btn" onClick={() => audio.setPlaylistOpen(!audio.playlistOpen)}>
              ☰
            </button>
          </div>
          <input
            className="vol-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audio.volumes.music}
            onChange={(e) => audio.setVolume("music", Number(e.target.value))}
          />
          <div className="vol-meta">
            <span>{Math.round(audio.volumes.music * 100)}%</span>
            <span>vol</span>
          </div>
          {audio.playlistOpen && (
            <div className="playlist">
              {RADIO_TRACKS.map((track, i) => (
                <button
                  key={track.id}
                  className={i === audio.trackIndex ? "active" : ""}
                  onClick={() => audio.setTrack(i)}
                >
                  {track.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
