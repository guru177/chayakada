import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GALLERY, GALLERY_FILTERS } from "../data";
import { Pic } from "./Pic";
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
              <Pic
                src={shot.src}
                alt={shot.alt}
                width={shot.slot === "g-car" ? 800 : 1200}
                height={shot.slot === "g-car" ? 1200 : 800}
                sizes="(max-width: 980px) 48vw, 22vw"
              />
              {shot.caption ? <figcaption>{shot.caption}</figcaption> : null}
            </figure>
          ))}
        </div>

        <div className="gal-foot">
          <Pic className="gal-quote" src="/images/gallery/gal-quote.png" alt="" width={520} height={780} sizes="220px" />
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
          <Pic className="gal-seal" src="/images/seal-stamp.jpg" alt="Traditional Kattanchaya Kerala seal, Est. 1963" width={400} height={400} sizes="150px" />
        </div>
      </div>
    </section>
  );
}
