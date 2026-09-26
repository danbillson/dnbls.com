import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Host Grotesk isn't reachable from next/font at build time, so fetch a TTF
// from Google Fonts; fall back to the default sans if the network is out.
async function displayFont() {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@600&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:40.0)" } },
    ).then((r) => r.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/,
    )?.[1];
    if (!url) return undefined;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return undefined;
  }
}

/** Ink card: kicker top-left, big title, muted subtitle. */
export async function ogImage({
  title,
  subtitle,
  kicker = "dnbls.com",
  titleSize = 132,
}: {
  title: string;
  subtitle: string;
  kicker?: string;
  titleSize?: number;
}) {
  const font = await displayFont();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#171717",
        color: "#f9f9f9",
        fontFamily: font ? "Host Grotesk" : "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 600, color: "#e4ff02" }}>
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            opacity: 0.6,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: font
        ? [{ name: "Host Grotesk", data: font, weight: 600, style: "normal" }]
        : undefined,
    },
  );
}
