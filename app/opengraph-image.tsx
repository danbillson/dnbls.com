import { generateOgImage } from "@/components/og-image";

export const alt = "Dan Billson";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOgImage();
}
