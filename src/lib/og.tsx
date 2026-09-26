import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PALETTE } from "@/lib/palette";

export const ogSize = { width: 1200, height: 630 };

// Host Grotesk isn't reachable from next/font at build time, so fetch a TTF
// from Google Fonts; fall back to the default sans if the network is out.
async function displayFont(weight: 500 | 600 = 600) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@${weight}&display=swap`,
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

// The hero's slot photo, cropped to the faces: a box in the source's pixels
// (friends.jpg is 1800×2400) at the slot's 1.07:0.7 aspect.
const PHOTO = {
  width: 1800,
  height: 2400,
  crop: { x: 516, y: 672, width: 840 },
};

/** The homepage hero as a card: Dan [photo] Billson, role in scramble colours. */
export async function heroImage({ role }: { role: string }) {
  const [semibold, medium, photo] = await Promise.all([
    displayFont(600),
    displayFont(500),
    readFile(join(process.cwd(), "public/images/me/friends.jpg")),
  ]);
  const fonts = [
    semibold && { name: "Host Grotesk", data: semibold, weight: 600 as const },
    medium && { name: "Host Grotesk", data: medium, weight: 500 as const },
  ].filter((f) => !!f);

  // Same proportions as hero.tsx: slot is cap height (0.7em) by 1.07em.
  const size = 196;
  const slot = { width: size * 1.07, height: size * 0.7 };
  const scale = slot.width / PHOTO.crop.width;
  // Stride through the palette so neighbouring letters never share a colour.
  let n = 0;
  const letters = [...role].map((ch) =>
    ch === " "
      ? { ch, color: undefined }
      : { ch, color: PALETTE[(n++ * 3) % PALETTE.length] },
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9f9",
        color: "#171717",
        fontFamily: fonts.length ? "Host Grotesk" : "sans-serif",
      }}
    >
      {/* Role hangs off the wordmark's left edge, not the page centre. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: size,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1,
          }}
        >
          <span>Dan</span>
          {/* Sits on the baseline: lift it by the descent below the caps. */}
          <div
            style={{
              display: "flex",
              position: "relative",
              overflow: "hidden",
              width: slot.width,
              height: slot.height,
              marginLeft: size * 0.06,
              marginBottom: size * 0.14,
              background: "rgba(23, 23, 23, 0.05)",
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: rendered by Satori, not the browser */}
            <img
              src={`data:image/jpeg;base64,${photo.toString("base64")}`}
              alt=""
              width={PHOTO.width * scale}
              height={PHOTO.height * scale}
              style={{
                position: "absolute",
                left: -PHOTO.crop.x * scale,
                top: -PHOTO.crop.y * scale,
                filter: "grayscale(1)",
              }}
            />
          </div>
          <span>Billson</span>
        </div>
        <div
          style={{
            display: "flex",
            // Big D's side bearing is wider: nudge in so the stems line up,
            // and tuck up into the wordmark's descender space.
            margin: "-14px 0 0 6px",
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: "-0.015em",
          }}
        >
          {letters.map(({ ch, color }, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static text, order is identity
            <span key={i} style={{ color, whiteSpace: "pre" }}>
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
