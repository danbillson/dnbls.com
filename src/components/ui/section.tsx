"use client";

import { type HTMLMotionProps, m } from "motion/react";

const variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const transition = {
  duration: 0.3,
};

type SectionProps = HTMLMotionProps<"section">;

export function Section(props: SectionProps) {
  return (
    <m.section
      variants={variants}
      transition={transition}
      initial="hidden"
      animate="visible"
      {...props}
    />
  );
}
