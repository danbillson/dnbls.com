"use client";

import { motion } from "motion/react";
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
          <motion.div
            key={image.alt}
            className={image.className}
            variants={variants}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="rounded-lg"
              placeholder="blur"
            />
          </motion.div>
        ))}
      </div>
    </InView>
  );
}

const images = [
  {
    src: walking,
    alt: "Dan walking in at the Paddle office",
    width: 500,
    height: 675,
    className: "row-span-3",
  },
  {
    src: mikkeller,
    alt: "Dan at Mikkeller bar in Copenhagen",
    width: 500,
    height: 500,
    className: "row-span-2",
  },
  {
    src: cupie,
    alt: "Dan doing a partner stunt",
    width: 500,
    height: 675,
    className: "row-span-3",
  },
  {
    src: light,
    alt: "Dan under a beam of light",
    width: 500,
    height: 500,
    className: "row-span-2",
  },
  {
    src: te,
    alt: "Team England Cheer",
    width: 740,
    height: 500,
    className: "col-span-2",
  },
] as const;
