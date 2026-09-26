"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import useMeasure from "react-use-measure";

// Demos for "Animating height in React". Same card, three stages.

const copy =
  "I first stumbled across these mugs in Hens Teeth, Dublin where I had to grab a couple of them, and then I had the privilege of visiting the store in Copenhagen and couldn’t resist grabbing another.";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CardBody({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Image
        src="/blog/mug.jpg"
        alt="Studio Arhoj mugs"
        width={600}
        height={600}
        className="bg-foreground/5"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="inline-flex w-full cursor-pointer items-center justify-between font-display text-xl font-semibold tracking-tight"
      >
        Studio Arhoj
        <Chevron open={open} />
      </button>
      {children}
    </div>
  );
}

const frame = "not-prose mx-auto my-10 w-full max-w-sm border border-rule";

export function AnimatedCard1() {
  const [open, setOpen] = useState(false);
  return (
    <div className={frame}>
      <CardBody open={open} onToggle={() => setOpen(!open)}>
        {open && <p className="text-muted">{copy}</p>}
      </CardBody>
    </div>
  );
}

export function AnimatedCard2() {
  const [ref, bounds] = useMeasure();
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        animate={{ height: bounds.height }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className={`${frame} overflow-hidden`}
      >
        <div ref={ref}>
          <CardBody open={open} onToggle={() => setOpen(!open)}>
            {open && <p className="text-muted">{copy}</p>}
          </CardBody>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

export function AnimatedCard3() {
  const [ref, bounds] = useMeasure();
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        animate={{ height: bounds.height }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className={`${frame} overflow-hidden`}
      >
        <div ref={ref}>
          <CardBody open={open} onToggle={() => setOpen(!open)}>
            <AnimatePresence>
              {open && (
                <motion.p
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    filter: "blur(4px)",
                    transition: { duration: 0.1 },
                  }}
                  transition={{ delay: 0.2 }}
                  className="text-muted"
                >
                  {copy}
                </motion.p>
              )}
            </AnimatePresence>
          </CardBody>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
