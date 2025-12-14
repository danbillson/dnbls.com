import { LogoIcon } from "./logo-icon";

export function Title() {
  return (
    <div className="mt-14 mb-8 flex items-center gap-2">
      <LogoIcon className="size-10" />
      <h1 className="font-medium text-2xl tracking-tighter">
        hey, i&apos;m dan
      </h1>
    </div>
  );
}
