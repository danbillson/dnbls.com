"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import useMeasure from "react-use-measure";

export function AnimatedCard2() {
  const [ref, bounds] = useMeasure();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={{ height: bounds.height }}
      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
      className="h-fit w-full max-w-sm overflow-hidden rounded-md shadow-md mx-auto"
    >
      <div ref={ref} className="flex flex-col gap-4 p-4">
        <Image
          className="rounded-sm"
          src="/blog/mug.jpg"
          alt="mugs"
          width={600}
          height={600}
        />
        <h1
          className="inline-flex cursor-pointer justify-between text-xl underline"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(!isOpen);
            }
          }}
        >
          Studio Arhoj{" "}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </h1>
        {isOpen && (
          <p>
            I first sumbled across these mugs in Hens Teeth, Dublin where I had
            to grab a couple of them, and then I had the priveledge of visiting
            the store in Copenhagen and couldn&apos;t resist grabbing another.
          </p>
        )}
      </div>
    </motion.div>
  );
}
