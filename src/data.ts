export type SoundId =
  | "rain"
  | "thunder"
  | "crickets"
  | "chatting"
  | "fire"
  | "birds"
  | "wind"
  | "kettle"
  | "music";

export type Volumes = Record<SoundId, number>;

export const SOUND_META: Record<
  Exclude<SoundId, "music">,
  { ml: string; en: string; emoji: string; hue: [number, number, number] }
> = {
  rain: { ml: "മഴ", en: "Rain", emoji: "🌧️", hue: [58, 121, 166] },
  thunder: { ml: "ഇടി", en: "Thunder", emoji: "⚡", hue: [94, 58, 166] },
  crickets: { ml: "ചീവീട്", en: "Crickets", emoji: "🦗", hue: [58, 166, 76] },
  chatting: { ml: "സംസാരം", en: "Chatting", emoji: "💬", hue: [166, 116, 58] },
  fire: { ml: "അടുപ്പ്", en: "Fireplace", emoji: "🔥", hue: [196, 92, 42] },
  birds: { ml: "പക്ഷികൾ", en: "Birds", emoji: "🦜", hue: [58, 148, 132] },
  wind: { ml: "കാറ്റ്", en: "Wind", emoji: "🌬️", hue: [120, 140, 160] },
  kettle: { ml: "കെറ്റിൽ", en: "Kettle", emoji: "🫖", hue: [166, 108, 58] },
};

export const AMBIENCE_IDS = Object.keys(SOUND_META) as Array<Exclude<SoundId, "music">>;

export const DEFAULT_VOLUMES: Volumes = {
  rain: 0.65,
  thunder: 0.5,
  crickets: 0.45,
  chatting: 0.4,
  fire: 0.55,
  birds: 0.5,
  wind: 0.45,
  kettle: 0.42,
  music: 0,
};

export const PRESETS: {
  id: string;
  ml: string;
  en: string;
  emoji: string;
  volumes: Volumes;
}[] = [
  {
    id: "rain",
    ml: "മഴ",
    en: "Rain",
    emoji: "🌧",
    volumes: {
      rain: 0.88,
      thunder: 0.28,
      crickets: 0.12,
      chatting: 0.18,
      fire: 0.22,
      birds: 0.05,
      wind: 0.38,
      kettle: 0.18,
      music: 0.12,
    },
  },
  {
    id: "rain-evening",
    ml: "മഴക്കാലം",
    en: "Monsoon",
    emoji: "🌧",
    volumes: {
      rain: 0.78,
      thunder: 0.42,
      crickets: 0.2,
      chatting: 0.48,
      fire: 0.55,
      birds: 0.08,
      wind: 0.32,
      kettle: 0.28,
      music: 0.22,
    },
  },
  {
    id: "chai-time",
    ml: "ചായ സമയം",
    en: "Tea Time",
    emoji: "🍵",
    volumes: {
      rain: 0.18,
      thunder: 0,
      crickets: 0.12,
      chatting: 0.65,
      fire: 0.35,
      birds: 0.7,
      wind: 0.12,
      kettle: 0.72,
      music: 0.52,
    },
  },
  {
    id: "study",
    ml: "പഠനം",
    en: "Study",
    emoji: "📖",
    volumes: {
      rain: 0.12,
      thunder: 0,
      crickets: 0.08,
      chatting: 0.22,
      fire: 0.28,
      birds: 0.72,
      wind: 0.18,
      kettle: 0.4,
      music: 0.32,
    },
  },
  {
    id: "night",
    ml: "രാത്രി",
    en: "Night",
    emoji: "🌙",
    volumes: {
      rain: 0.22,
      thunder: 0.08,
      crickets: 0.55,
      chatting: 0.7,
      fire: 0.48,
      birds: 0,
      wind: 0.22,
      kettle: 0.48,
      music: 0.38,
    },
  },
];

export const MENU = [
  { ml: "കട്ടൻ ചായ", en: "Kattan Chaya", desc: "Strong black tea, no milk, no sugar.", price: "₹15", img: "/images/menu-kattan.jpg" },
  { ml: "ബൺ", en: "Bun", desc: "Fresh from the oven every morning.", price: "₹12", img: "/images/menu-bun.jpg" },
  { ml: "പഴം പൊരി", en: "Pazham Pori", desc: "Crispy ripe banana fritters.", price: "₹20", img: "/images/menu-pazham.jpg" },
  { ml: "ഓംലെറ്റ്", en: "Omelette", desc: "Fluffy, peppered, made to order.", price: "₹25", img: "/images/menu-omelette.jpg" },
  { ml: "നാരങ്ങ വെള്ളം", en: "Naaranga Vellam", desc: "Fresh lime, salt, soda if you ask.", price: "₹15", img: "/images/menu-lime.jpg" },
];

export const GALLERY_FILTERS = [
  { id: "all", ml: "എല്ലാം" },
  { id: "kada", ml: "ചായക്കട ഓർമ്മകൾ" },
  { id: "kerala", ml: "കേരളം" },
  { id: "old", ml: "പഴയകാലം" },
  { id: "cinema", ml: "സിനിമ" },
  { id: "life", ml: "ചായ & ജീവിതം" },
] as const;

export const GALLERY = [
  { id: "kada", slot: "g-kada", tag: "kada", src: "/images/gallery/gal-kada.jpg", alt: "Vintage Kerala chayakada interior — കട്ടൻചായ കട", caption: "" },
  { id: "alleppey", slot: "g-alleppey", tag: "kerala", src: "/images/gallery/gal-alleppey.jpg", alt: "Alleppey houseboat, Kerala, 1988", caption: "Alleppey, 1988" },
  { id: "car", slot: "g-car", tag: "old", src: "/images/gallery/gal-ambassador.jpg", alt: "Ambassador car in monsoon rain, Kerala", caption: "" },
  { id: "hills", slot: "g-hills", tag: "kerala", src: "/images/gallery/gal-hills.jpg", alt: "Kerala tea estate hills", caption: "" },
  { id: "cinema", slot: "g-cinema", tag: "cinema", src: "/images/gallery/gal-cinema.jpg", alt: "Old Malayalam cinema projector", caption: "" },
  { id: "snacks", slot: "g-snacks", tag: "life", src: "/images/gallery/gal-snacks.jpg", alt: "Kattan chaya and pazham pori on a wooden table", caption: "" },
  { id: "ksrtc", slot: "g-ksrtc", tag: "old", src: "/images/gallery/gal-ksrtc.jpg", alt: "KSRTC bus, Kerala, 1992", caption: "KSRTC — 1992" },
  { id: "counter", slot: "g-counter", tag: "kada", src: "/images/gallery/gal-counter.jpg", alt: "Kerala tea shop counter with glasses of kattan chaya", caption: "" },
  { id: "talk", slot: "g-talk", tag: "kada", src: "/images/gallery/gal-talk.jpg", alt: "Conversation at a Kerala chayakada", caption: "" },
  { id: "cycle", slot: "g-cycle", tag: "life", src: "/images/gallery/gal-cycle.jpg", alt: "Bicycle by a Kerala backwater", caption: "" },
];

export const POSTERS = [
  {
    year: "1988",
    director: "Inside the Kada",
    ml: "കട്ടൻ ചായ",
    en: "Black Tea",
    palette: ["#1a0a04", "#c8880a", "#7a0e0e"],
  },
  {
    year: "1989",
    director: "Monsoon Reels",
    ml: "മഴവില്ല്",
    en: "Rainlight",
    palette: ["#0e2a4a", "#c8d8e8", "#3a6b8a"],
  },
  {
    year: "1991",
    director: "Night Radio",
    ml: "അല്ലി",
    en: "Jasmine Hour",
    palette: ["#1a1208", "#e8b040", "#4a2a10"],
  },
  {
    year: "1993",
    director: "Bus Stand Pictures",
    ml: "ചായക്കട",
    en: "The Stall",
    palette: ["#142018", "#e8e0c8", "#3a5a40"],
  },
];

export type RadioTrack = {
  id: string;
  title: string;
  artist: string;
  /** Local file under /public, e.g. "/audio/songs/evening.mp3" */
  src?: string;
};

export type RadioPlaylist = {
  id: string;
  title: string;
  tracks: RadioTrack[];
};

export const RADIO_PLAYLISTS: RadioPlaylist[] = [
  {
    id: "kada",
    title: "KADA",
    tracks: [
      {
        id: "chillhop",
        title: "Malayalam Chillhop",
        artist: "Chris Wayne",
        src: "/audio/songs/malayalam-chillhop.mp3",
      },
      {
        id: "evergreen",
        title: "Evergreen Hits 80s–90s",
        artist: "K.J. Yesudas · K.S. Chithra",
        src: "/audio/songs/evergreen-hits.mp3",
      },
    ],
  },
];

export function radioPlaylist(id: string): RadioPlaylist {
  return RADIO_PLAYLISTS.find((p) => p.id === id) ?? RADIO_PLAYLISTS[0];
}

/** Looping field recordings. `chatting` uses the people/kada crowd take. */
export const AMBIENCE_LOOPS: Partial<Record<Exclude<SoundId, "music">, string>> = {
  rain: "/audio/ambience/rain.m4a",
  thunder: "/audio/ambience/thunder.m4a",
  crickets: "/audio/ambience/crickets.m4a",
  chatting: "/audio/ambience/chatting.m4a",
  fire: "/audio/ambience/fire.m4a",
  birds: "/audio/ambience/birds.m4a",
  wind: "/audio/ambience/wind.m4a",
  kettle: "/audio/ambience/kettle.mp3",
};

export const ABOUT = [
  {
    title: "Kattan Chaya · കട്ടൻ ചായ",
    body: "Kattan chaya — literally “black tea” in Malayalam — is the soul of Kerala. Brewed strong and dark, without milk or sugar, it is served at every roadside chaaya kada (ചായ കട) across Keralam. This site brings that experience online — a free Malayalam ASMR soundscape of a vintage Kerala tea stall.",
  },
  {
    title: "Kerala Nostalgia · കേരളം",
    body: "For Malayalis everywhere, this is your digital chaaya kada. Mix the sounds of Kerala — monsoon rain, thunder, crackling fire, chirping birds, wind and old Malayalam conversations. Pair it with a soft kada radio for the full Keralam nostalgia experience.",
  },
  {
    title: "Kada Radio · പാട്ടുകൾ",
    body: "Tune the radio while ambient Kerala sounds play in the background. Perfect for studying, working, or simply reliving the warmth of a Keralam evening with a cup of kattan chai.",
  },
  {
    title: "Free Malayalam ASMR · സൗജന്യം",
    body: "Completely free. No login, no ads, no interruptions. Just the pure sounds of Kerala — kattan chaya, chaya kada, rain, fire and radio. A digital chaaya kada you can keep open all day.",
  },
];

export function greetingLine(hour: number) {
  if (hour < 12) return { period: "Good morning", hint: "try Morning Chai", preset: "chai-time" };
  if (hour < 17) return { period: "Good afternoon", hint: "try Study Mode", preset: "study" };
  if (hour < 21) return { period: "Good evening", hint: "try Rain Evening", preset: "rain-evening" };
  return { period: "Good night", hint: "try Night Mode", preset: "night" };
}

export function malayalamPeriod(hour: number) {
  if (hour < 12) return "രാവിലെ";
  if (hour < 16) return "ഉച്ചയ്ക്ക്";
  if (hour < 19) return "വൈകുന്നേരം";
  return "രാത്രി";
}

export function keralaSeason(month: number) {
  if (month >= 5 && month <= 8) return "Monsoon Season 🌧";
  if (month >= 9 && month <= 10) return "Post-Monsoon 🌿";
  if (month === 11 || month <= 1) return "Winter Light ☕";
  return "Summer Heat ☀️";
}
