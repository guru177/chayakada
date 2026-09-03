export function parseYoutubeSearchHtml(html) {
  const match = html.match(/ytInitialData\s*=\s*(\{[\s\S]+?\});\s*<\/script>/);
  if (!match) return [];
  let data;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return [];
  }
  const hits = [];
  const seen = new Set();
  walk(data, hits, seen);
  return hits;
}

function walk(node, hits, seen) {
  if (!node || typeof node !== "object" || hits.length >= 8) return;
  const video = node.videoRenderer;
  if (video?.videoId && !seen.has(video.videoId)) {
    seen.add(video.videoId);
    const title =
      video.title?.runs?.map((run) => run.text).join("") ||
      video.title?.simpleText ||
      "YouTube";
    const channel =
      video.ownerText?.runs?.[0]?.text ||
      video.shortBylineText?.runs?.[0]?.text ||
      "";
    const thumb =
      video.thumbnail?.thumbnails?.at(-1)?.url ||
      `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`;
    hits.push({ id: video.videoId, title, channel, thumb });
  }
  const values = Array.isArray(node) ? node : Object.values(node);
  for (const child of values) walk(child, hits, seen);
}

export async function searchYoutube(query) {
  const q = query.trim();
  if (!q) return [];
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgIQAQ%3D%3D`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`YouTube search ${res.status}`);
  return parseYoutubeSearchHtml(await res.text());
}

export function ytSearchPlugin() {
  const handle = async (req, res) => {
    const url = new URL(req.url || "", "http://localhost");
    const q = url.searchParams.get("q") || "";
    try {
      const hits = await searchYoutube(q);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(hits));
    } catch {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "search failed" }));
    }
  };
  return {
    name: "yt-search",
    configureServer(server) {
      server.middlewares.use("/api/yt-search", handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/yt-search", handle);
    },
  };
}
