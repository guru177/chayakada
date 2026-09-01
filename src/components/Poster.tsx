import { useEffect, useState } from "react";
import { POSTERS } from "../data";

export function Poster() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setIndex((i) => (i + 1) % POSTERS.length), 12000);
    return () => clearInterval(t);
  }, []);

  const poster = POSTERS[index];

  return (
    <div className="col">
      <div className="kicker">Now Showing</div>
      <div className="poster-frame">
        <div
          className="poster-art"
          key={poster.en}
          style={{
            background: `radial-gradient(circle at 40% 30%, ${poster.palette[1]}33, transparent 45%), linear-gradient(180deg, ${poster.palette[0]}, ${poster.palette[2]})`,
          }}
        >
          <svg width="70%" height="70%" viewBox="0 0 200 280" aria-hidden>
            <rect x="18" y="22" width="164" height="236" fill="none" stroke={poster.palette[1]} strokeOpacity="0.45" />
            <circle cx="100" cy="108" r="34" fill="none" stroke={poster.palette[1]} strokeWidth="1.5" />
            <path d="M78 150 Q100 168 122 150" fill="none" stroke={poster.palette[1]} strokeWidth="1.2" />
            <path d="M88 118 Q100 128 112 118" fill="none" stroke={poster.palette[1]} />
            <text x="100" y="210" textAnchor="middle" fill={poster.palette[1]} fontSize="11" letterSpacing="3" fontFamily="Playfair Display, serif">
              {poster.year}
            </text>
          </svg>
          <div className="poster-caption">
            <div className="poster-meta">
              {poster.year} · {poster.director}
            </div>
            <div className="poster-ml font-malayalam">{poster.ml}</div>
            <div className="poster-en">{poster.en}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
