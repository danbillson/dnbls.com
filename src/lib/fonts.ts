import { DM_Sans, Host_Grotesk, IBM_Plex_Sans, Inter } from "next/font/google";

export const fontDisplay = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});

// Body candidates — swap `--font-sans` in globals.css to compare.
// Only the active one should preload.
export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  preload: false,
});

export const fontPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  preload: false,
});

export const fontVariables = [
  fontDisplay.variable,
  fontInter.variable,
  fontDmSans.variable,
  fontPlex.variable,
].join(" ");
