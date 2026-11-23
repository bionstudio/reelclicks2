import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";

const HEADLINE = "Turning MomentsInto Memories.";
const LABELS = "CINEMATIC STORYTELLING STUDIO — MAHARASHTRA REELCLICKS.IN";

/** Fetches a font subset (TTF) from Google Fonts containing only `text`. */
async function loadFont(family: string, axis: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:${axis}&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

/** Fonts are fetched once at build time and cached. */
async function loadFonts() {
  "use cache";
  cacheLife("max");
  return Promise.all([
    loadFont("Manrope", "wght@500", LABELS),
    loadFont("Cormorant+Garamond", "ital,wght@0,300", HEADLINE),
    loadFont("Cormorant+Garamond", "ital,wght@1,300", HEADLINE),
  ]);
}

/** Default share image (1200×630) — used when a page has no CMS sharing image. */
export async function GET() {
  const [sans, serif, serifItalic] = await loadFonts();
  const fonts = [
    ...(sans ? [{ name: "Manrope", data: sans, style: "normal" as const, weight: 500 as const }] : []),
    ...(serif ? [{ name: "Cormorant", data: serif, style: "normal" as const, weight: 300 as const }] : []),
    ...(serifItalic ? [{ name: "Cormorant", data: serifItalic, style: "italic" as const, weight: 300 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background:
            "radial-gradient(circle at 25% 20%, rgba(201,169,110,0.25), transparent 55%), linear-gradient(160deg, #1b1916 0%, #0a0a0a 60%)",
          color: "#F3EEE6",
          position: "relative",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: "#0A0A0A" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, background: "#0A0A0A" }} />
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#C9A96E" }}>
          CINEMATIC STORYTELLING STUDIO — MAHARASHTRA
        </div>
        <div style={{ display: "flex", fontSize: 104, lineHeight: 1, marginTop: 28, fontFamily: "Cormorant, serif" }}>
          Turning Moments
        </div>
        <div style={{ display: "flex", fontSize: 104, lineHeight: 1, color: "#E6D3A3", fontStyle: "italic", fontFamily: "Cormorant, serif" }}>
          Into Memories.
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 48, fontSize: 30, letterSpacing: 6 }}>
          <div style={{ width: 64, height: 1, background: "#C9A96E", marginRight: 24 }} />
          REELCLICKS<span style={{ color: "#C9A96E" }}>.IN</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
