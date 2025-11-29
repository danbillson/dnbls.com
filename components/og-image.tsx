import { LogoIcon } from "@/components/logo-icon";
import { ImageResponse } from "next/og";

const HEADING = "Dan Billson";
const SUBTITLE_MAX_LENGTH = 80;

// Cache font promises to avoid refetching on every request
const fontCache = new Map<string, Promise<ArrayBuffer>>();

async function fetchFont(fontCssUrl: string): Promise<ArrayBuffer> {
  // Return cached promise if available
  if (fontCache.has(fontCssUrl)) {
    return fontCache.get(fontCssUrl)!;
  }

  const fontPromise = (async () => {
    const cssResponse = await fetch(fontCssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 86400 }, // Cache fonts for 24 hours
    });

    const css = await cssResponse.text();
    const fontUrlMatch = css.match(
      /src: url\((.+?)\) format\('(woff2|truetype)'\)/,
    );

    if (!fontUrlMatch) {
      throw new Error(`Failed to load font from ${fontCssUrl}`);
    }

    const fontUrl = fontUrlMatch[1].replace(/(^")|("$)/g, "");
    const fontResponse = await fetch(fontUrl, {
      next: { revalidate: 86400 }, // Cache fonts for 24 hours
    });

    return fontResponse.arrayBuffer();
  })();

  fontCache.set(fontCssUrl, fontPromise);
  return fontPromise;
}

export async function generateOgImage(subtitle?: string) {
  const subtitleText = subtitle
    ? subtitle.slice(0, SUBTITLE_MAX_LENGTH).trim()
    : undefined;

  const [titleFontData, bodyFontData] = await Promise.all([
    fetchFont(
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&text=Dan%20Billson",
    ),
    subtitleText
      ? fetchFont("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400")
      : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#f8f7f4",
          color: "#0f0f0f",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "60px",
            margin: "auto",
            padding: "80px 96px",
            borderRadius: "32px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 20px 70px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            style={{
              borderRadius: "999px",
              padding: "24px",
              border: "1px solid #111111",
            }}
          >
            <LogoIcon width={220} height={220} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: '"Bricolage Grotesque"',
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {HEADING}
            </span>
            {subtitleText ? (
              <span
                style={{
                  marginTop: 16,
                  fontFamily: '"Work Sans"',
                  fontSize: 52,
                  lineHeight: 1.2,
                  color: "#4a4a4a",
                }}
              >
                {subtitleText}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: titleFontData,
          weight: 700,
          style: "normal",
        },
        ...(bodyFontData
          ? [
              {
                name: "Work Sans",
                data: bodyFontData,
                weight: 400,
                style: "normal",
              },
            ]
          : []),
      ],
    },
  );
}

