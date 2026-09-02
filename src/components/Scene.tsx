import { useState } from "react";
import { Pic } from "./Pic";
import { greetingLine } from "../data";
import { useAudio } from "../context";

export function Scene({ onOrder }: { onOrder: () => void }) {
  const audio = useAudio();
  const [brewing, setBrewing] = useState(false);
  const hour = new Date().getHours();
  const greet = greetingLine(hour);

  const order = async () => {
    setBrewing(true);
    await audio.applyPreset("chai-time");
    onOrder();
    window.setTimeout(() => setBrewing(false), 1800);
  };

  return (
    <div className="scene" aria-label="Kerala tea stall scene">
      <Pic className="scene-img" src="/hero.jpg" alt="Vintage Kerala tea stall interior" eager width={1408} height={768} sizes="100vw" />
      <div className="vignette" />
      <div className="scene-corner" />
      <div className="shop-sign">
        <p className="sign-title font-malayalam">കട്ടൻ ചായ</p>
        <p className="sign-sub font-elite">Vintage Kerala · Since Always</p>
      </div>
      <div className="inside-tag font-elite">inside · 1988</div>
      <div className="scene-overlay">
        <h1 className="hero-title">Kattan Chaya — Malayalam ASMR & Kerala Tea Stall Ambience</h1>
        <div className="cta-row">
          <button className="btn-start" onClick={() => audio.toggle()} aria-label="Start ambient Kerala tea stall sounds">
            {audio.playing ? "❚❚  PAUSE AMBIENCE" : "▶  START AMBIENCE"}
          </button>
          <button className="btn-chai" onClick={order} disabled={brewing}>
            <span>{brewing ? "🫖" : "🫖"}</span>
            <span>{brewing ? "Brewing..." : "Order Chai"}</span>
          </button>
        </div>
        <p className="hero-copy">Close your eyes. Sip your chai. Let the sounds take you there.</p>
        <div className="hero-hint">
          {greet.period}— try{" "}
          <button type="button" onClick={() => audio.applyPreset(greet.preset)}>
            {greet.hint.replace("try ", "")}
          </button>
        </div>
      </div>
    </div>
  );
}
