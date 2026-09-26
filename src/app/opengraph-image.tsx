import { heroImage, ogSize } from "@/lib/og";

export const alt = "Dan Billson — Design Engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return heroImage({ role: "Design Engineer" });
}
