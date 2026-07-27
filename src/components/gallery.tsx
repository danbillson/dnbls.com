"use client";

import { m } from "motion/react";
import Image from "next/image";
import { InView } from "@/components/ui/in-view";
import cupie from "../../public/home/cupie.jpg";
import light from "../../public/home/light.jpg";
import mikkeller from "../../public/home/mikkeller.jpg";
import te from "../../public/home/te.jpg";
import walking from "../../public/home/walking.jpg";

const variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
} as const;

export default function Gallery() {
  return (
    <InView
      viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.09,
          },
        },
      }}
    >
      <div className="mt-6 grid grid-cols-2 gap-3">
        {images.map((image) => (
          <m.div
            key={image.alt}
            className={image.className}
            variants={variants}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={image.sizes}
              loading={image.eager ? "eager" : "lazy"}
              className="rounded-lg"
              placeholder="blur"
            />
          </m.div>
        ))}
      </div>
    </InView>
  );
}

const COLUMN_SIZES = "(min-width: 720px) 306px, calc(50vw - 30px)";
const FULL_WIDTH_SIZES = "(min-width: 720px) 624px, calc(100vw - 48px)";

const images = [
  {
    src: walking,
    alt: "Dan walking in at the Paddle office",
    width: 500,
    height: 675,
    className: "row-span-3",
    sizes: COLUMN_SIZES,
    eager: true,
  },
  {
    src: mikkeller,
    alt: "Dan at Mikkeller bar in Copenhagen",
    width: 500,
    height: 500,
    className: "row-span-2",
    sizes: COLUMN_SIZES,
    eager: true,
  },
  {
    src: cupie,
    alt: "Dan doing a partner stunt",
    width: 500,
    height: 675,
    className: "row-span-3",
    sizes: COLUMN_SIZES,
    eager: true,
  },
  {
    src: light,
    alt: "Dan under a beam of light",
    width: 500,
    height: 500,
    className: "row-span-2",
    sizes: COLUMN_SIZES,
    eager: false,
  },
  {
    src: te,
    alt: "Team England Cheer",
    width: 740,
    height: 500,
    className: "col-span-2",
    sizes: FULL_WIDTH_SIZES,
    eager: false,
  },
] as const;
