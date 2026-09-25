import { Host_Grotesk, Inter } from "next/font/google";

export const fontDisplay = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const fontVariables = `${fontDisplay.variable} ${fontSans.variable}`;
