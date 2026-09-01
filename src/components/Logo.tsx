export function Logo() {
  return (
    <div style={{ width: 84, height: 109.2, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="100%" height="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <style>{`
          @keyframes steam1 { 0%,100%{d:path("M305 175 Q300 155 310 140 Q305 125 312 110")} 50%{d:path("M305 175 Q312 155 302 140 Q310 125 305 110")} }
          @keyframes steam2 { 0%,100%{d:path("M340 170 Q335 148 345 132 Q338 115 346 100")} 50%{d:path("M340 170 Q348 148 338 132 Q345 115 340 100")} }
          @keyframes steam3 { 0%,100%{d:path("M375 175 Q370 155 380 140 Q375 125 382 112")} 50%{d:path("M375 175 Q382 155 372 140 Q380 125 375 112")} }
          .steam-1{animation:steam1 3s ease-in-out infinite}
          .steam-2{animation:steam2 3.5s ease-in-out infinite}
          .steam-3{animation:steam3 4s ease-in-out infinite}
        `}</style>
        <ellipse cx="340" cy="260" rx="290" ry="230" fill="none" stroke="#5C2E0E" strokeWidth="3" />
        <ellipse cx="340" cy="260" rx="280" ry="220" fill="#1A0A02" stroke="#8B5E3C" strokeWidth="2" />
        <ellipse cx="340" cy="260" rx="268" ry="208" fill="none" stroke="#8B5E3C" strokeWidth="0.5" strokeDasharray="4 6" />
        <ellipse cx="340" cy="260" rx="255" ry="195" fill="#2A1508" />
        <path d="M240 100 Q260 80 280 95 Q300 75 320 90 Q340 70 360 90 Q380 75 400 95 Q420 80 440 100" fill="none" stroke="#C4944A" strokeWidth="1.2" strokeLinecap="round" />
        <path className="steam-1" d="M305 175 Q300 155 310 140 Q305 125 312 110" fill="none" stroke="#C4944A" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <path className="steam-2" d="M340 170 Q335 148 345 132 Q338 115 346 100" fill="none" stroke="#C4944A" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
        <path className="steam-3" d="M375 175 Q370 155 380 140 Q375 125 382 112" fill="none" stroke="#C4944A" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
        <path d="M302 190 L310 235 Q310 240 340 240 Q370 240 370 235 L378 190 Z" fill="#C4944A" opacity="0.15" stroke="#C4944A" strokeWidth="1" />
        <ellipse cx="340" cy="190" rx="38" ry="8" fill="#2A1508" stroke="#C4944A" strokeWidth="1" />
        <text x="340" y="310" textAnchor="middle" fontFamily="'Noto Serif Malayalam', serif" fontSize="52" fontWeight="700" fill="#E8C875" letterSpacing="4">
          ചായ കട
        </text>
        <line x1="180" y1="330" x2="500" y2="330" stroke="#C4944A" strokeWidth="0.8" opacity="0.6" />
        <text x="340" y="360" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="16" fill="#C4944A" letterSpacing="6">
          KATTAN CHAYA
        </text>
        <text x="340" y="385" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="11" fill="#8B5E3C" letterSpacing="3" fontStyle="italic">
          VINTAGE KERALA · SINCE ALWAYS
        </text>
      </svg>
    </div>
  );
}
