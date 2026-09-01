import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GALLERY, GALLERY_FILTERS } from "../data";
import { sectionLink, useNav } from "../nav.tsx";

export function Gallery() {
  const { prepareJump } = useNav();
  const [filter, setFilter] = useState("all");
  const shots = useMemo(
    () => (filter === "all" ? GALLERY : GALLERY.filter((g) => g.tag === filter)),
    [filter],
  );

  return (
    <section className="gal-band" id="gallery">
      <div className="gal-inner">
        <div className="gal-title">
          <span className="gal-ornament" aria-hidden>
            ✦ ———
          </span>
          <h2>ഗാലറി</h2>
          <span className="gal-ornament" aria-hidden>
            ——— ✦
          </span>
        </div>
        <p className="gal-sub">ചായയുടെ സുഗന്ധം, ഓർമ്മകളുടെ നിറങ്ങൾ ☕</p>

        <div className="gal-filters" role="tablist" aria-label="Gallery filters">
          <span className="gal-wave" aria-hidden>
            ∿∿∿
          </span>
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={filter === f.id ? "on" : ""}
              onClick={() => setFilter(f.id)}
            >
              {f.ml}
            </button>
          ))}
          <span className="gal-wave" aria-hidden>
            ∿∿∿
          </span>
        </div>

        <div className={`gal-mosaic ${filter === "all" ? "is-all" : "is-filtered"}`}>
          {shots.map((shot) => (
            <figure className={`gal-shot ${shot.slot}`} key={shot.id}>
              <span className="gal-tape" aria-hidden />
              <img src={shot.src} alt={shot.alt} />
              {shot.caption ? <figcaption>{shot.caption}</figcaption> : null}
            </figure>
          ))}
        </div>

        <div className="gal-foot">
          <img className="gal-quote" src="/images/gallery/gal-quote.png" alt="" />
          <div className="gal-cta">
            <svg viewBox="0 0 40 32" aria-hidden>
              <path d="M8 12h8l3-4h10l3 4h0v14H8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="20" cy="19" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="20" cy="19" r="2.2" fill="currentColor" />
            </svg>
            <p>നിങ്ങളുടെ ഓർമ്മകൾ ഞങ്ങളുമായി പങ്കിടുക</p>
            <Link
              className="gal-send"
              to={sectionLink("contact")}
              preventScrollReset
              onClick={() => prepareJump("contact")}
            >
              ചിത്രം അയക്കൂ
              <span aria-hidden> ✈</span>
            </Link>
          </div>
          <img className="gal-seal" src="/images/seal-stamp.png" alt="Traditional Kattanchaya Kerala" />
        </div>
      </div>
    </section>
  );
}
