import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

export const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "story", label: "OUR STORY" },
  { id: "menu", label: "MENU" },
  { id: "ambience", label: "AMBIENCE MAKER" },
  { id: "gallery", label: "GALLERY" },
  { id: "locations", label: "LOCATIONS" },
  { id: "contact", label: "CONTACT" },
] as const;

const SPY_ORDER = ["home", "story", "ambience", "menu", "gallery", "locations", "contact"] as const;

type NavApi = {
  active: string;
  prepareJump: (id: string) => void;
};

const NavCtx = createContext<NavApi | null>(null);

function visualTop(id: string) {
  if (id === "home") return 0;
  const el = document.getElementById(id);
  if (!el) return null;
  const pull = parseFloat(getComputedStyle(el).marginTop) || 0;
  const shift = pull < 0 ? -pull : 0;
  return el.getBoundingClientRect().top + window.scrollY + shift;
}

function scrollToId(id: string, instant = false) {
  const top = id === "home" ? 0 : visualTop(id);
  if (top == null) return;
  window.scrollTo({ top: Math.max(0, top - 8), behavior: instant ? "auto" : "smooth" });
}

export function sectionLink(id: string) {
  return { pathname: "/" as const, hash: `#${id}` };
}

export function NavProvider({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const [active, setActive] = useState(() => loc.hash.slice(1) || "home");
  const lockUntil = useRef(0);
  const hashRef = useRef(loc.hash);

  useEffect(() => {
    hashRef.current = loc.hash;
    const id = loc.hash.slice(1);
    if (!id) return;
    lockUntil.current = Date.now() + 900;
    setActive(id);
    const t = window.setTimeout(() => scrollToId(id, false), 40);
    return () => window.clearTimeout(t);
  }, [loc.hash]);

  useEffect(() => {
    const detect = () => {
      if (Date.now() < lockUntil.current) return;
      const probe = window.scrollY + Math.min(220, window.innerHeight * 0.28);
      let current = "home";
      for (const section of SPY_ORDER) {
        const top = visualTop(section);
        if (top != null && top <= probe) current = section;
      }
      setActive(current);
    };

    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect);
    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
    };
  }, []);

  const prepareJump = (id: string) => {
    lockUntil.current = Date.now() + 900;
    setActive(id);
    const current = hashRef.current.slice(1) || "home";
    if (current === id) scrollToId(id);
  };

  return <NavCtx.Provider value={{ active, prepareJump }}>{children}</NavCtx.Provider>;
}

export function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) {
    throw new Error("useNav must be used inside NavProvider");
  }
  return ctx;
}
