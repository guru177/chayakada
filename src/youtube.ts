export type YoutubeTarget =
  | { kind: "video"; id: string; start?: number }
  | { kind: "playlist"; id: string };

export const YOUTUBE_DEFAULT: YoutubeTarget = {
  kind: "video",
  id: "qqhEeTFY_yQ",
  start: 60,
};

const STORAGE_KEY = "kattan-youtube-embed";

function parseStart(raw: string | null): number | undefined {
  if (!raw) return undefined;
  if (/^\d+$/.test(raw)) return Number(raw);
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return undefined;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : undefined;
}

export function parseYoutubeInput(raw: string): YoutubeTarget | null {
  const text = raw.trim();
  if (!text) return null;

  if (/^[\w-]{11}$/.test(text) && !text.includes("http")) {
    return { kind: "video", id: text };
  }

  try {
    const url = new URL(text);
    const host = url.hostname.replace(/^www\./, "");
    if (!host.includes("youtube.com") && host !== "youtu.be") return null;

    const start = parseStart(url.searchParams.get("t") || url.searchParams.get("start"));
    const list = url.searchParams.get("list");
    const video = url.searchParams.get("v");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      if (id) return { kind: "video", id, start };
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "embed" && parts[1] && parts[1] !== "videoseries") {
      return { kind: "video", id: parts[1], start };
    }
    if (parts[0] === "shorts" && parts[1]) return { kind: "video", id: parts[1], start };
    if (parts[0] === "live" && parts[1]) return { kind: "video", id: parts[1], start };

    if (video) return { kind: "video", id: video, start };
    if (list && list !== "LL") return { kind: "playlist", id: list };
  } catch {
    /* not a URL */
  }
  return null;
}

export function youtubeEmbedSrc(target: YoutubeTarget, origin?: string) {
  const params = new URLSearchParams({
    enablejsapi: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    autoplay: "1",
  });
  if (origin) params.set("origin", origin);
  if (target.kind === "playlist") {
    return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(target.id)}&${params}`;
  }
  if (target.start) params.set("start", String(target.start));
  return `https://www.youtube.com/embed/${encodeURIComponent(target.id)}?${params}`;
}

export function loadYoutubeTarget(): YoutubeTarget {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return YOUTUBE_DEFAULT;
    const parsed = JSON.parse(raw) as YoutubeTarget;
    if (parsed.kind === "video" && parsed.id) return parsed;
    if (parsed.kind === "playlist" && parsed.id) return parsed;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return YOUTUBE_DEFAULT;
}

export function saveYoutubeTarget(item: YoutubeTarget) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  } catch {
    /* private mode */
  }
}

export type YoutubeHit = {
  id: string;
  title: string;
  channel: string;
  thumb: string;
};

export const YOUTUBE_SUGGESTIONS = [
  "Malayalam lofi",
  "Old Malayalam",
  "Unni Menon",
  "Kuthu",
  "Kerala rain",
];

export async function searchYoutubeVideos(query: string): Promise<YoutubeHit[]> {
  const q = query.trim();
  if (!q) return [];
  const key = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (key) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "8");
    url.searchParams.set("q", q);
    url.searchParams.set("key", key);
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as {
        items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string } } } }>;
      };
      const hits = (data.items || [])
        .map((item) => {
          const id = item.id?.videoId;
          if (!id) return null;
          return {
            id,
            title: item.snippet?.title || "YouTube",
            channel: item.snippet?.channelTitle || "",
            thumb: item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          };
        })
        .filter((hit): hit is YoutubeHit => Boolean(hit));
      if (hits.length) return hits;
    }
  }
  const res = await fetch(`/api/yt-search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("search failed");
  return (await res.json()) as YoutubeHit[];
}

export function youtubeVolumePercent(radio: number, master: number) {
  return Math.round(Math.max(0, Math.min(1, radio * master)) * 100);
}

type YtPlayer = {
  setVolume: (n: number) => void;
  mute: () => void;
  unMute: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          events?: {
            onReady?: (e: { target: YtPlayer }) => void;
          };
        },
      ) => YtPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function loadYoutubeApi(): Promise<NonNullable<Window["YT"]>> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const finish = () => {
      if (window.YT?.Player) resolve(window.YT);
    };
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      finish();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
    const id = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(id);
        finish();
      }
    }, 80);
  });
}

export function applyYoutubeVolume(player: YtPlayer | null, radio: number, master: number) {
  if (!player) return;
  try {
    const percent = youtubeVolumePercent(radio, master);
    player.setVolume(percent);
    if (percent <= 0) player.mute();
    else player.unMute();
  } catch {
    /* player not ready */
  }
}

export type { YtPlayer };
