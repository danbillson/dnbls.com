"use client";

import { useSearchParams } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./picker.css";

export function PrototypePicker({
  names,
  variants,
  topPositioned = [],
}: {
  names: string[];
  variants: ReactNode[];
  /** Variants that occupy bottom-center — picker moves to the top for these. */
  topPositioned?: number[];
}) {
  const searchParams = useSearchParams();
  const initial = Number.parseInt(searchParams.get("v") ?? "", 10) - 1;
  const [current, setCurrent] = useState(
    initial >= 0 && initial < variants.length ? initial : 0,
  );
  const [ready, setReady] = useState(false);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const highlightRef = useRef<HTMLSpanElement>(null);

  function setActive(i: number) {
    if (i < 0 || i >= variants.length) return;
    setCurrent(i);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(i + 1));
    window.history.replaceState(null, "", url);
    window.scrollTo(0, 0);
  }

  useLayoutEffect(() => {
    function moveHighlight() {
      const el = itemsRef.current[current];
      const highlight = highlightRef.current;
      if (!el || !highlight) return;
      highlight.style.width = `${el.offsetWidth}px`;
      highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    }
    moveHighlight();
    window.addEventListener("resize", moveHighlight);
    return () => window.removeEventListener("resize", moveHighlight);
  }, [current]);

  // Enable the slide only after first paint, so load doesn't animate.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
        target.isContentEditable
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = Number.parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) setActive(num - 1);
      else if (e.key === "ArrowRight")
        setActive((current + 1) % variants.length);
      else if (e.key === "ArrowLeft")
        setActive((current - 1 + variants.length) % variants.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div key={current} className="flex flex-1 flex-col">
        {variants[current]}
      </div>
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready ? "" : undefined}
        data-position={topPositioned.includes(current) ? "top" : undefined}
      >
        <span
          ref={highlightRef}
          className="proto-picker-highlight"
          aria-hidden="true"
        />
        {names.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => setActive(i)}
          >
            {name}
          </button>
        ))}
      </nav>
    </>
  );
}
