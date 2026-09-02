/** Update this when the site has a custom domain. */
export const SITE_URL = "https://guru177.github.io/chayakada";

export const SITE = {
  name: "Kattanchaya",
  nameMl: "കട്ടൻചായ",
  tagline: "Authentic Kerala tea · free chayakada ambience maker",
  description:
    "Kattanchaya (കട്ടൻചായ) is a vintage Kerala chayakada since 1963 in Kozhikode. Drink kattan chaya, browse the menu, and mix rain, radio, kettle and old Malayalam songs in the free online ambience maker.",
  keywords: [
    "kattan chaya",
    "kattanchaya",
    "കട്ടൻ ചായ",
    "കട്ടൻചായ",
    "kerala tea",
    "kerala tea shop",
    "chayakada",
    "chayakada ambience",
    "kattan tea",
    "black tea kerala",
    "kozhikode tea shop",
    "malayalam asmr",
    "kerala rain sounds",
    "old malayalam songs",
    "chai stall ambience",
    "vintage kerala",
    "tea shop mixer",
    "kerala nostalgia",
    "sulaimani",
    "pazhampori",
  ].join(", "),
  image: "/images/hero-bg.jpg",
  imageAlt: "Vintage Kerala chayakada counter with a glass of kattan chaya",
  locale: "ml_IN",
  email: "hello@kattanchaya.in",
  place: {
    name: "Kattanchaya Chayakada",
    street: "Kozhikode",
    region: "Kerala",
    country: "IN",
    hours: "Mo-Su 06:00-21:30",
  },
};

export const HOME_TITLE = "Kattanchaya | കട്ടൻചായ — Kerala Tea Shop & Chayakada Ambience Maker";
export const POMO_TITLE = "Chaya Pomodoro | കട്ടൻചായ study timer with Kerala tea-shop ambience";
export const POMO_DESCRIPTION =
  "Study with a Kerala chayakada Pomodoro timer. Mix rain, radio and kattan-chaya ambience while you focus.";

export function absoluteUrl(path = "/") {
  const origin = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${origin}/`;
  return origin + (path.startsWith("/") ? path : `/${path}`);
}

export function jsonLdGraph(path = "/") {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: SITE.name,
        alternateName: [SITE.nameMl, "Kattan Chaya", "Chayakada Ambience Maker"],
        url: absoluteUrl("/"),
        description: SITE.description,
        inLanguage: ["ml", "en"],
        keywords: SITE.keywords,
      },
      {
        "@type": "WebApplication",
        "@id": `${absoluteUrl("/")}#ambience-maker`,
        name: "Chayakada Ambience Maker",
        alternateName: "കട്ടൻചായ അന്തരീക്ഷം",
        url: `${absoluteUrl("/")}#ambience`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        description:
          "Free online Kerala tea-shop sound mixer: rain, thunder, fire, birds, kada chatter, kettle and old Malayalam radio.",
      },
      {
        "@type": "CafeOrCoffeeShop",
        "@id": `${absoluteUrl("/")}#kada`,
        name: SITE.place.name,
        alternateName: SITE.nameMl,
        url: absoluteUrl("/"),
        image: absoluteUrl(SITE.image),
        email: SITE.email,
        servesCuisine: "Kerala",
        menu: `${absoluteUrl("/")}#menu`,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.place.street,
          addressRegion: SITE.place.region,
          addressCountry: SITE.place.country,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "06:00",
          closes: "21:30",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: path === "/pomodoro" ? POMO_TITLE : HOME_TITLE,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        about: { "@id": `${absoluteUrl("/")}#kada` },
        inLanguage: ["ml", "en"],
        description: path === "/pomodoro" ? POMO_DESCRIPTION : SITE.description,
        primaryImageOfPage: absoluteUrl(SITE.image),
      },
    ],
  };
}
