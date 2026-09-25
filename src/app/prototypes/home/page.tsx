import { Suspense } from "react";
import { PrototypePicker } from "../prototype-picker";
import Catalogue from "./variants/catalogue";
import Ledger from "./variants/ledger";
import Poster from "./variants/poster";
import Split from "./variants/split";
import Wordmark from "./variants/wordmark";

export const metadata = { title: "Prototype — Home" };

const variants: { name: string; node: React.ReactNode; top?: boolean }[] = [
  { name: "Split", node: <Split /> },
  { name: "Wordmark", node: <Wordmark />, top: true },
  { name: "Ledger", node: <Ledger /> },
  { name: "Catalogue", node: <Catalogue /> },
  { name: "Poster", node: <Poster /> },
];

export default function HomePrototype() {
  return (
    <Suspense>
      <PrototypePicker
        names={variants.map((v) => v.name)}
        variants={variants.map((v) => v.node)}
        topPositioned={variants.flatMap((v, i) => (v.top ? [i] : []))}
      />
    </Suspense>
  );
}
