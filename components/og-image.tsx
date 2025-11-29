import { LogoIcon } from "@/components/logo-icon";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const HEADING = "Dan Billson";
const SUBTITLE_MAX_LENGTH = 80;

export async function generateOgImage(subtitle?: string) {
  const subtitleText = subtitle
    ? subtitle.slice(0, SUBTITLE_MAX_LENGTH).trim()
    : undefined;

  // Load fonts from local assets folder
  const [titleFontData, bodyFontData] = await Promise.all([
    readFile(join(process.cwd(), "assets", "BricolageGrotesque-Bold.ttf")),
    subtitleText
      ? readFile(join(process.cwd(), "assets", "WorkSans-Regular.ttf"))
      : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          color: "#140700",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
          }}
        >
          <LogoIcon width={120} height={120} />

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
                  color: "#525252",
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
          weight: 700 as const,
          style: "normal" as const,
        },
        ...(bodyFontData
          ? [
              {
                name: "Work Sans",
                data: bodyFontData,
                weight: 400 as const,
                style: "normal" as const,
              },
            ]
          : []),
      ],
    },
  );
}
