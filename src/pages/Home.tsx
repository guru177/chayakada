import { Link } from "react-router-dom";
import { useAudio } from "../context";
import { Header } from "../components/Header";
import { AmbiencePanel } from "../components/AmbiencePanel";
import { Gallery } from "../components/Gallery";
import { Footer } from "../components/Footer";
import { NavProvider, sectionLink, useNav } from "../nav.tsx";

export function Home() {
  return (
    <NavProvider>
      <HomePage />
    </NavProvider>
  );
}

function HomePage() {
  const audio = useAudio();
  const { prepareJump } = useNav();

  return (
    <div className="site">
      <Header />

      <section className="hero" id="home" aria-label="Authentic Kerala tea — vintage chayakada">
        <picture>
          <source
            media="(max-width: 980px) and (orientation: portrait)"
            srcSet="/images/hero-bg-mobile.jpg"
          />
          <img
            className="hero-bg"
            src="/images/hero-bg.jpg"
            alt=""
            fetchPriority="high"
          />
        </picture>
        <div className="hero-copy">
          <div className="hero-kicker-block">
            <p className="hero-kicker">ഒരു കട്ടൻ ചായയുടെ കഥ</p>
            <div className="hero-flourish" aria-hidden />
          </div>
          <h1>
            <span className="h-green">AUTHENTIC</span>
            <span className="h-brown">KERALA TEA</span>
          </h1>
          <div className="hero-since">
            <span className="since-line" />
            <span>Since 1963</span>
            <span className="since-line" />
          </div>
          <p className="hero-lead">
            From our chayakada to your heart, serving warmth, nostalgia &amp; the taste of tradition.
          </p>
          <p className="hero-maker">
            <span aria-hidden>✦</span>
            Free chayakada ambience maker on this page
            <span aria-hidden>✦</span>
          </p>
          <div className="hero-actions">
            <Link
              className="btn-solid"
              to={sectionLink("story")}
              preventScrollReset
              onClick={() => prepareJump("story")}
            >
              OUR STORY
            </Link>
            <Link
              className="btn-ghost"
              to={sectionLink("ambience")}
              preventScrollReset
              onClick={() => {
                prepareJump("ambience");
                if (!audio.playing) audio.toggle();
              }}
            >
              {audio.playing ? "ON AIR · MIXER" : "▶ AMBIENCE MAKER"}
            </Link>
          </div>
        </div>
      </section>

      <section className="story-band" id="story">
        <div className="wrap story-grid">
          <div className="polaroid">
            <span className="tape" />
            <div className="polaroid-print">
              <img src="/images/shop-vintage.png" alt="പഴയ കട്ടൻചായ കട" />
            </div>
          </div>
          <div className="story-copy">
            <div className="eyebrow">നമ്മുടെ കഥ</div>
            <div className="story-rule" aria-hidden />
            <h2>കേരളത്തിലെ ചായയുടെ പാരമ്പര്യം</h2>
            <p>
              കേരളത്തിന്റെ മലയോരങ്ങളിൽ — മൂന്നാർ, വയനാട്, പീരുമേട് — ബ്രിട്ടീഷ് കാലത്താണ്
              തേയിലത്തോട്ടങ്ങൾ വേരുറച്ചത്. പക്ഷേ മലയാളിയുടെ ചായ തോട്ടത്തിലല്ല; ബസ് സ്റ്റാന്റിനരികെ,
              മരപ്പലകയിട്ട കടമുറിയിലാണ് ജീവിക്കുന്നത്.
            </p>
            <p>
              കട്ടൻ ചായ എന്നാൽ പാലില്ല, പഞ്ചസാരയില്ല. ഇളം വെള്ളത്തിൽ കടുപ്പമുള്ള ഇലയിട്ട്
              തിളപ്പിച്ച്, ഉയരത്തിൽ നിന്ന് ഒഴിച്ച് നുരയോടെ ഗ്ലാസിലെത്തിക്കുന്ന ചൂട്. അത് ഒരു
              പാനീയം മാത്രമല്ല; കാത്തിരിപ്പിന്റെയും സംസാരത്തിന്റെയും മഴയുടെയും ഭാഷയാണ്.
            </p>
            <p>
              1963 മുതൽ ഈ കട അതേ രീതിയിൽ തന്നെ തുറന്നിരിക്കുന്നു. തൊഴിലാളി, വിദ്യാർത്ഥി,
              യാത്രക്കാരൻ — ആർക്കും ഒരു ഗ്ലാസ്. പാചകക്കുറിപ്പ് മാറിയിട്ടില്ല: ഇല, തിളച്ച വെള്ളം,
              സമയം. കേരളത്തിലെ ചായക്കട ഒരു ജനാധിപത്യ സ്ഥലമാണ്. പദവിയില്ല, ഒരു ബെഞ്ച്, ഒരു കെറ്റിൽ,
              ഒരു ഗ്ലാസ്. അവിടെ നിൽക്കുമ്പോൾ സമയം പതുക്കെ നീങ്ങുന്നു — ചായ പോലെ.
            </p>
            <p>
              പണ്ട് ചായക്കടയിൽ റേഡിയോ മാത്രമായിരുന്നു സംഗീതം. സന്ധ്യയായാൽ പഴയ ഗാനങ്ങൾ, വാർത്ത,
              കായിക വിവരണം. മേശപ്പുറത്ത് ബൺ, പഴംപൊരി, ഒരു ഗ്ലാസ് കട്ടൻ. മഴ പെയ്താൽ കട നിറയും;
              ആരും തിടുക്കപ്പെടില്ല. ചായ തണുത്താൽ വീണ്ടും ഒഴിച്ചുതരും — അതാണ് കടയുടെ നിയമം.
            </p>
            <p>
              സുലൈമാനി ചായയും മലബാറിന്റെ ഓർമയാണ് — ചെറുതായി എള്ളും ഏലക്കയും ചേർത്ത് ദാഹം
              തീർക്കുന്നത്. പക്ഷേ കട്ടന്റെ ആത്മാവ് വേറെ: കയ്പ്, ചൂട്, നുര. അത് ഉറക്കം തുറപ്പിക്കാനും
              രാത്രി സംസാരം നീട്ടാനും ഒരുപോലെ ഉപകരിക്കും. ഒരു ഗ്ലാസിൽ ഒരു ദിവസത്തിന്റെ തുടക്കവും
              അവസാനവും ഒതുങ്ങുന്നു.
            </p>
            <p>
              തോട്ടത്തൊഴിലാളികൾ പുലർച്ചെ കുടിക്കുന്ന ചായയും, കോടതിമുറ്റത്തെ കടയിലെ ചായയും,
              കലാശാലക്ക് മുന്നിലെ സ്റ്റാളിലെ ചായയും ഒരേ കുടുംബത്തിലെ മക്കളാണ്. വില ചെറുത്,
              ആശ്വാസം വലുത്. അതുകൊണ്ടാണ് അറുപതു വർഷമായിട്ടും ഈ കെറ്റിൽ അടുപ്പിൽ നിന്ന് ഇറങ്ങാത്തത്.
            </p>
            <p>
              കട്ടൻചായയുടെ കഥ ഒരു കടയുടെ കഥ മാത്രമല്ല. അത് കേരളത്തിന്റെ കാത്തിരിപ്പിന്റെ കഥയാണ് —
              ബസിനായി, മഴമാറ്റത്തിനായി, ഒരു വാക്കിനായി. ഇവിടെ ഇരുന്നാൽ നിങ്ങൾക്ക് ആ ഓർമ്മകൾ ഇപ്പോഴും
              കേൾക്കാം: ഇലയുടെ മണം, ചെമ്പുകെറ്റിലിന്റെ ശബ്ദം, ഗ്ലാസ് മേശയിൽ വയ്ക്കുന്ന ലഘുസ്പർശം.
            </p>
          </div>
        </div>
      </section>

      <section className="ambience-band" id="ambience">
        <AmbiencePanel />
      </section>

      <section className="menu-board-band" id="menu" aria-label="കട്ടൻചായ ചായക്കട menu board">
        <img src="/images/menu-board.jpg" alt="കട്ടൻചായ ചായക്കട chalkboard menu, EST. 1963" />
      </section>

      <Gallery />
      <Footer />
    </div>
  );
}
