import { Pic } from "./Pic";

const PERKS = [
  {
    title: "TRADITIONAL RECIPES",
    body: "Time-tested recipes made with love.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path
          d="M14 18c0-2 1.5-4 5-4h8c3.5 0 5 2 5 4v2H14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M16 20h14l-1.4 16H17.4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M33 22h6c3 0 5 2.4 5 5.4s-2 5.6-5 5.6h-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 10c.4-3 2-5 3.5-5s3.2 2 3.6 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M27 10c.3-2.2 1.4-3.6 2.6-3.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="23" cy="16" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "VINTAGE AMBIENCE",
    body: "Step into nostalgia with our classic chayakada vibes.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path d="M7 36V20l17-11 17 11v16" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 20h34" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 36V24h8v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="24" y="24" width="10" height="7" fill="none" stroke="currentColor" strokeWidth="1.45" />
        <path d="M5 36h38M22 9V6h4v2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16 24h2M18 28v4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    title: "MORE THAN TEA",
    body: "A place for conversations, laughter & memories.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="14" cy="16" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="24" cy="14" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="34" cy="16" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6 36c1.5-8 5-12 8-12s5.5 3 6.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 32c1.2-8 4.5-12 8-12s6.4 4 7.6 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M27 34c1.2-7 5-11 7.5-11s6.2 3.2 7.5 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "QUALITY INGREDIENTS",
    body: "Finest tea leaves & fresh ingredients always.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path
          d="M24 42c-8 0-14-6.2-14-14 0-9 8.5-18 14-24 5.5 6 14 15 14 24 0 7.8-6 14-14 14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M24 42V16" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M24 22c-4 2-7 6-8 11M24 20c4 3 7 7 8 12" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="site-foot" id="locations">
      <div className="foot-perks">
        <div className="foot-perks-row">
          {PERKS.map((p) => (
            <article className="foot-perk" key={p.title}>
              {p.icon}
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="foot-main wrap">
        <Pic
          className="foot-parchment"
          src="/images/footer-parchment.png"
          alt="Come, sip and be a part of the Kattanchaya chayakada story"
          width={426}
          height={640}
          sizes="(max-width: 560px) 148px, (max-width: 980px) 168px, (min-width: 1800px) 260px, 220px"
        />

        <div className="foot-brand">
          <div className="foot-ml">കട്ടൻചായ</div>
          <div className="foot-en">KATTANCHAYA</div>
          <div className="foot-est">
            <span />
            EST. 1963
            <span />
          </div>
          <svg className="foot-cup" viewBox="0 0 48 28" aria-hidden>
            <path d="M6 8h26l-2.4 16H9.2L6 8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="19" cy="8" rx="13" ry="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M32 11h6a5 5 0 0 1 0 12h-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 3c0 2.6 1.8 2.8 1.8 5.4M20 2c0 3 2 3.2 2 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </div>

        <div className="foot-follow" id="contact">
          <div className="foot-kicker">FOLLOW US</div>
          <div className="foot-socials">
            <a href="mailto:hello@kattanchaya.in" aria-label="Email">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M6.5 9h11v6.5h-11z" fill="none" stroke="currentColor" strokeWidth="1.35" />
                <path d="M6.5 9l5.5 4 5.5-4" fill="none" stroke="currentColor" strokeWidth="1.35" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13.2 7.6h1.8V6h-1.8A2.7 2.7 0 0 0 10.5 8.7v1.5H9v1.8h1.5V18h1.9v-6h1.8l.4-1.8h-2.2V8.8c0-.5.3-.8.8-.8z" fill="currentColor" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <rect x="7.4" y="7.4" width="9.2" height="9.2" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.35" />
                <circle cx="12" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
                <circle cx="15.2" cy="8.8" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8.2 16.6l.8-2.2A5.4 5.4 0 1 1 12 17.4a5.3 5.3 0 0 1-2.4-.6z" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.4 10.4c.15-.4.4-.42.62-.42h.42c.18 0 .32.1.38.32l.28.72c.06.16 0 .32-.16.46l-.28.28c.48.78 1.18 1.4 2.04 1.88l.36-.3c.16-.14.34-.14.5-.06l.76.32c.22.1.32.24.32.42v.46c0 .22 0 .46-.4.64-1 .32-2.56.16-4.32-1.64-1.54-1.54-1.86-3.1-1.54-4.12z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div className="foot-visit">
          <div className="foot-kicker">
            <svg viewBox="0 0 18 18" aria-hidden>
              <path d="M9 16s5-5.2 5-9a5 5 0 1 0-10 0c0 3.8 5 9 5 9z" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="9" cy="7" r="1.6" fill="currentColor" />
            </svg>
            VISIT US
          </div>
          <address>
            Kattanchaya Chayakada, Kozhikode, Kerala
          </address>
          <hr />
          <div className="foot-kicker">OPEN DAILY</div>
          <p>6:00 AM – 9:30 PM</p>
        </div>

        <Pic
          className="foot-stamp"
          src="/images/footer-stamp.png"
          alt="Vintage Kerala backwaters postage stamp, Kottayam"
          width={362}
          height={480}
          sizes="(max-width: 560px) 96px, (max-width: 980px) 118px, (min-width: 1800px) 188px, 160px"
        />
      </div>

      <p className="foot-copy">© 2024 Kattanchaya Chayakada. All rights reserved.</p>
    </footer>
  );
}
