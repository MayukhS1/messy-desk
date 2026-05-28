export function parseYouTubeVideoId(url: string): string | null {
  try {
    const trimmed = url.trim();
    const u = new URL(trimmed);

    if (u.hostname === "youtu.be" || u.hostname.endsWith(".youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        return u.searchParams.get("v");
      }
      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed) return embed[1];
      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeVideoId(url) !== null;
}

export function youTubeEmbedUrl(url: string, autoplay = false): string | null {
  const id = parseYouTubeVideoId(url);
  if (!id) return null;
  const params = autoplay ? "?autoplay=1" : "";
  return `https://www.youtube.com/embed/${id}${params}`;
}
