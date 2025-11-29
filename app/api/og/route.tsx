import { LogoIcon } from "@/components/logo-icon";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const HEADING = "Dan Billson";
const SUBTITLE_MAX_LENGTH = 80;

const titleFont = fetchFont(
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&text=Dan%20Billson",
);

const bodyFont = fetchFont(
  "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400",
);

async function fetchFont(fontCssUrl: string) {
  const cssResponse = await fetch(fontCssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const css = await cssResponse.text();
  const fontUrlMatch = css.match(/src: url\((.+?)\) format\('(woff2|truetype)'\)/);

  if (!fontUrlMatch) {
    throw new Error(`Failed to load font from ${fontCssUrl}`);
  }

  const fontUrl = fontUrlMatch[1].replace(/(^")|("$)/g, "");
  const fontResponse = await fetch(fontUrl);

  return fontResponse.arrayBuffer();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtitleParam = searchParams.get("subtitle") || "";
  const subtitle = subtitleParam.slice(0, SUBTITLE_MAX_LENGTH).trim();

  const [titleFontData, bodyFontData] = await Promise.all([
    titleFont,
    bodyFont,
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
            {subtitle ? (
              <span
                style={{
                  marginTop: 16,
                  fontFamily: '"Work Sans"',
                  fontSize: 52,
                  lineHeight: 1.2,
                  color: "#4a4a4a",
                }}
              >
                {subtitle}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: titleFontData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Work Sans",
          data: bodyFontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
