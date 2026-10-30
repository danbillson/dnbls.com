import { type CSSProperties, Fragment } from "react";

/**
 * Heading text split into masked words for the reveal system. Start times
 * are spread evenly across `spread` ms; `power` > 1 bunches them at the start
 * (ease-in), < 1 toward the end. With `fps`, start times snap to that frame
 * grid so held-drawing reveals (`.rv-held`) stay in step with each other.
 */
export function Words({
  text,
  spread = 200,
  power = 1,
  fps,
}: {
  text: string;
  spread?: number;
  power?: number;
  fps?: number;
}) {
  const words = text.split(" ");
  const last = Math.max(words.length - 1, 1);
  const frame = fps ? 1000 / fps : 1;
  return words.map((word, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: words are positional and can repeat
    <Fragment key={i}>
      <span
        style={
          {
            "--d": `${Math.round(Math.round((spread * (i / last) ** power) / frame) * frame)}ms`,
          } as CSSProperties
        }
        className="rv-mask inline-block"
      >
        <span className="rv-word inline-block">{word}</span>
      </span>{" "}
    </Fragment>
  ));
}
