import { type CSSProperties, Fragment } from "react";

/**
 * Heading text split into masked words for the reveal system. Start times
 * are spread evenly across `spread` ms; `power` > 1 bunches them at the start
 * (ease-in), < 1 toward the end.
 */
export function Words({
  text,
  spread = 200,
  power = 1,
}: {
  text: string;
  spread?: number;
  power?: number;
}) {
  const words = text.split(" ");
  const last = Math.max(words.length - 1, 1);
  return words.map((word, i) => (
    <Fragment key={word}>
      <span
        style={
          {
            "--d": `${Math.round(spread * (i / last) ** power)}ms`,
          } as CSSProperties
        }
        className="rv-mask inline-block"
      >
        <span className="rv-word inline-block">{word}</span>
      </span>{" "}
    </Fragment>
  ));
}
