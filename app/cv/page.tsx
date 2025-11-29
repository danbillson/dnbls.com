import "@/styles/mdx.css";
import type { Metadata } from "next";
import CV from "@/content/cv.mdx";

export const metadata: Metadata = {
  title: "CV",
  description: "Dan Billson's CV and professional experience",
};

export default function CVPage() {
  return (
    <article className="py-8">
      <div className="mdx">
        <CV />
      </div>
    </article>
  );
}
