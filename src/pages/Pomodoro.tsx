import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mixer } from "../components/Mixer";
import { useAudio } from "../context";

type Mode = "focus" | "break" | "long";

export function Pomodoro() {
  const audio = useAudio();
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [goal, setGoal] = useState(8);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(focusMin * 60);
  const [completed, setCompleted] = useState(0);
  const [settings, setSettings] = useState(false);
  const [asmr, setAsmr] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (seconds > 0) return;
    setRunning(false);
    setCompleted((prev) => {
      const nextCompleted = mode === "focus" ? prev + 1 : prev;
      const next: Mode = mode === "focus" ? (nextCompleted > 0 && nextCompleted % 4 === 0 ? "long" : "break") : "focus";
      setMode(next);
      setSeconds((next === "focus" ? focusMin : next === "break" ? breakMin : longMin) * 60);
      return nextCompleted;
    });
  }, [seconds, mode, focusMin, breakMin, longMin]);

  const total = (mode === "focus" ? focusMin : mode === "break" ? breakMin : longMin) * 60;
  const progress = 1 - seconds / total;
  const r = 80;
  const circ = 2 * Math.PI * r;
  const mm = Math.max(0, Math.floor(seconds / 60));
  const ss = Math.max(0, seconds % 60);
  const chai = Math.floor(completed / 4);
  const label = mode === "focus" ? "പഠനം" : mode === "break" ? "ചായ" : "വലിയ ഇടവേള";

  const fillY = useMemo(() => 66 - Math.min(1, chai / 4) * 46, [chai]);

  return (
    <div className="pomodoro">
      <Link className="back-kada" to="/">
        ← Chai Kada
      </Link>
      <div className="pomo-title font-malayalam">⏱ ചായ പൊമൊഡോറോ</div>
      <div className="pomo-sub">Work hard. Chai harder.</div>
      <button className="ghost-btn" onClick={() => setSettings((v) => !v)}>
        ⚙ Settings <span>▼</span>
      </button>
      {settings && (
        <div className="settings-panel">
          <label className="settings-row">
            Focus (min)
            <input type="number" min={1} max={90} value={focusMin} onChange={(e) => setFocusMin(Number(e.target.value))} />
          </label>
          <label className="settings-row">
            Short break
            <input type="number" min={1} max={30} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} />
          </label>
          <label className="settings-row">
            Long break
            <input type="number" min={1} max={45} value={longMin} onChange={(e) => setLongMin(Number(e.target.value))} />
          </label>
          <label className="settings-row">
            Sessions
            <input type="number" min={1} max={12} value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
          </label>
        </div>
      )}

      <div className="ring-wrap">
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(60,48,36,0.3)" strokeWidth="8" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#e9c27a"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="ring-label">
          <div className="ring-time">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
          <div className="ring-mode font-malayalam">{label}</div>
        </div>
      </div>

      <div className="pomo-actions">
        <button
          className="pomo-start"
          onClick={() => {
            setRunning((v) => !v);
            if (!audio.playing) audio.start();
          }}
        >
          {running ? "❚❚ PAUSE" : "▶ START"}
        </button>
        <button
          className="pomo-icon"
          onClick={() => {
            setRunning(false);
            setMode("focus");
            setSeconds(focusMin * 60);
          }}
        >
          ↺
        </button>
        <button
          className="pomo-icon"
          onClick={() => {
            setSeconds(0);
          }}
        >
          ⏭
        </button>
      </div>

      <div className="chai-earned">
        Chai earned — {chai} / 4
      </div>
      <svg width="64" height="72" viewBox="0 0 64 72" aria-hidden>
        <path d="M10 20 L14 62 Q14 66 18 66 L46 66 Q50 66 50 62 L54 20 Z" fill="none" stroke="rgba(200,160,80,0.4)" strokeWidth="2" />
        <path d="M50 30 Q62 30 62 42 Q62 54 50 54" fill="none" stroke="rgba(200,160,80,0.4)" strokeWidth="2" />
        <clipPath id="cupClip">
          <path d="M10 20 L14 62 Q14 66 18 66 L46 66 Q50 66 50 62 L54 20 Z" />
        </clipPath>
        <rect x="10" y={fillY} width="44" height="50" fill="rgba(200,136,10,0.35)" clipPath="url(#cupClip)" />
        <rect x="8" y="18" width="48" height="4" rx="2" fill="rgba(200,160,80,0.5)" />
      </svg>
      <div className="dots-row">
        {Array.from({ length: goal }).map((_, i) => (
          <div className={`dot ${i < completed ? "done" : ""}`} key={i} />
        ))}
      </div>
      <div className="session-meta">
        {completed} SESSION{completed === 1 ? "" : "S"} · {Math.max(0, goal - completed)} LEFT
      </div>
      <button className="ghost-btn" style={{ marginTop: 32 }} onClick={() => setAsmr((v) => !v)}>
        🎵 Songs & ASMR <span>▼</span>
      </button>
      {asmr && (
        <div className="asmr-panel">
          <Mixer />
        </div>
      )}
    </div>
  );
}
