import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";

const HEADLINE = "Turning moments into reelclicks.in";
const ITALIC = "memories.";
const LABELS = "REC CREATOR & FILM STUDIO — MAHARASHTRA";

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
    loadFont("Manrope", "wght@600", LABELS),
    loadFont("Bricolage+Grotesque", "wght@700", HEADLINE),
    loadFont("Instrument+Serif", "ital@1", ITALIC),
  ]);
}

/** Default share image (1200×630) — used when a page has no CMS sharing image. */
export async function GET() {
  const [sans, serif, serifItalic] = await loadFonts();
  const fonts = [
    ...(sans ? [{ name: "Manrope", data: sans, style: "normal" as const, weight: 600 as const }] : []),
    ...(serif ? [{ name: "Bricolage", data: serif, style: "normal" as const, weight: 700 as const }] : []),
    ...(serifItalic ? [{ name: "Instrument", data: serifItalic, style: "italic" as const, weight: 400 as const }] : []),
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
          background: "#0B0B0B",
          color: "#F4EFE6",
          position: "relative",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 18, background: "#FF3D2E" }} />
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, letterSpacing: 3 }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#FF3D2E", marginRight: 16 }} />
          REC — CREATOR &amp; FILM STUDIO — MAHARASHTRA
        </div>
        <div style={{ display: "flex", fontSize: 118, lineHeight: 0.95, marginTop: 30, fontFamily: "Bricolage", letterSpacing: -5 }}>
          Turning moments
        </div>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 118, lineHeight: 1, letterSpacing: -5 }}>
          <span style={{ fontFamily: "Bricolage" }}>into</span>
          <span style={{ fontFamily: "Instrument", fontStyle: "italic", color: "#FF3D2E", marginLeft: 28, letterSpacing: -2 }}>memories.</span>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 40, fontFamily: "Bricolage", letterSpacing: -1.5 }}>
          reelclicks<span style={{ color: "#FF3D2E" }}>.in</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
