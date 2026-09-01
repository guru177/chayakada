import { Link } from "react-router-dom";
import { NAV_LINKS, sectionLink, useNav } from "../nav.tsx";

export function Header() {
  const { active, prepareJump } = useNav();

  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
        <Link to={sectionLink("home")} preventScrollReset className="brand" onClick={() => prepareJump("home")}>
          <div className="brand-ml">കട്ടൻചായ</div>
          <div className="brand-est">EST. 1963</div>
          <svg className="brand-cup" viewBox="0 0 32 22" aria-hidden>
            <path d="M4 4h18l-2 14H7L4 4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M22 8h4a3 3 0 0 1 0 8h-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 1c0 3 2 3 2 6M15 1c0 3 2 3 2 6" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.id}
              to={sectionLink(l.id)}
              preventScrollReset
              className={active === l.id ? "is-active" : ""}
              onClick={() => prepareJump(l.id)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          className="visit-btn"
          to={sectionLink("locations")}
          preventScrollReset
          onClick={() => prepareJump("locations")}
        >
          <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden>
            <path d="M10 18s6-6.2 6-10a6 6 0 1 0-12 0c0 3.8 6 10 6 10z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="10" cy="8" r="2" fill="currentColor" />
          </svg>
          VISIT US
        </Link>
      </div>
    </header>
  );
}
