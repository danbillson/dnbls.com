"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Checkbox } from "@base-ui/react/checkbox";
import { Dialog } from "@base-ui/react/dialog";
import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import { Slider } from "@base-ui/react/slider";
import { Switch } from "@base-ui/react/switch";
import { Tabs } from "@base-ui/react/tabs";
import { Toast } from "@base-ui/react/toast";
import { Tooltip } from "@base-ui/react/tooltip";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./twos.css";

// Demos for "UI at 12fps". Real Base UI components; CSS draws every pose.

type Rate = "twos" | "ones";
type Look = "sprite" | "subtle";

const kicker = "text-xs font-medium tracking-[0.08em] uppercase";
const focus =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
const press = `bt-press inline-flex h-9 items-center justify-center gap-2 px-3.5 text-sm font-medium select-none ${focus}`;
const btn = `${press} bg-foreground text-background hover:bg-accent hover:text-foreground`;
const ghost = `${press} border border-rule bg-white hover:bg-accent`;
const danger = `${press} bg-[#e0141c] text-white hover:bg-foreground`;
const surface =
  "border border-rule bg-white text-foreground shadow-[0_24px_48px_-20px_rgb(23_23_23/0.35)] outline-none";
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/* ========================= scope ========================= */

// Popups portal into their scope so they pick up its mode.
const Container = createContext<RefObject<HTMLDivElement | null> | null>(null);

function Scope({
  rate,
  look,
  fps = 12,
  className,
  children,
}: {
  rate: Rate;
  look: Look;
  fps?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      ref={ref}
      data-bt-rate={rate}
      data-bt-style={look}
      data-bt-ready={ready ? "" : undefined}
      style={{ "--bt-fps": fps } as CSSProperties}
      className={className}
    >
      <Container value={ref}>{children}</Container>
    </div>
  );
}

const useContainer = () => useContext(Container);

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="square"
      aria-hidden
      className={className}
    >
      <path d="M3 8.5l3.25 3L13 4.5" />
    </svg>
  );
}

/* ========================= components ========================= */

function DialogDemo() {
  const container = useContainer();
  return (
    <Dialog.Root>
      <Dialog.Trigger className={btn}>Delete project…</Dialog.Trigger>
      <Dialog.Portal container={container}>
        <Dialog.Backdrop className="bt-backdrop fixed inset-0 z-50" />
        <Dialog.Popup
          className={`bt-dialog fixed top-1/2 left-1/2 z-50 w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 p-6 ${surface}`}
        >
          <Dialog.Title className="font-display text-3xl leading-none font-semibold tracking-[-0.03em]">
            Delete this project?
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm text-muted">
            All 12 drawings go with it. You can’t undo this.
          </Dialog.Description>
          <div className="mt-8 flex justify-end gap-2">
            <Dialog.Close className={ghost}>Cancel</Dialog.Close>
            <Dialog.Close className={danger}>Delete project</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PopoverDemo() {
  const container = useContainer();
  return (
    <Popover.Root>
      <Popover.Trigger className={btn}>Share ↗</Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={10} className="z-40">
          <Popover.Popup className={`bt-popup w-64 p-4 ${surface}`}>
            <Popover.Title className="font-display text-lg leading-tight font-semibold tracking-[-0.02em]">
              Share this post
            </Popover.Title>
            <Popover.Description className="mt-1 text-xs text-muted">
              Anyone with the link can view.
            </Popover.Description>
            <div className="mt-4 flex">
              <input
                readOnly
                aria-label="Link"
                value="dnbls.com/blog/ui-at-12fps"
                className="min-w-0 flex-1 border border-r-0 border-rule bg-background px-2.5 text-xs font-medium outline-none"
              />
              <Popover.Close className={`${btn} h-8 px-3 text-xs`}>
                Copy
              </Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const ITEMS = [
  ["Rename", "R"],
  ["Duplicate", "D"],
  ["Move to…", "M"],
  ["Archive", "A"],
  ["Delete", "⌫"],
];

function MenuDemo() {
  const container = useContainer();
  return (
    <Menu.Root>
      <Menu.Trigger className={ghost}>Actions ▾</Menu.Trigger>
      <Menu.Portal container={container}>
        <Menu.Positioner sideOffset={8} align="start" className="z-40">
          <Menu.Popup className={`bt-menu w-48 py-1 ${surface}`}>
            {ITEMS.map(([label, key], i) => (
              <Menu.Item
                key={label}
                style={at(i)}
                className={`bt-item flex h-8 cursor-default items-center justify-between px-3 text-sm font-medium outline-none select-none data-[highlighted]:bg-accent ${label === "Delete" ? "text-[#e0141c] data-[highlighted]:bg-[#e0141c] data-[highlighted]:text-white" : ""}`}
              >
                {label}
                <span className="text-xs opacity-50">⌘{key}</span>
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

const TOOLS = [
  ["B", "Bold", "font-bold"],
  ["I", "Italic", "italic"],
  ["U", "Underline", "underline underline-offset-2"],
  ["⌘K", "Command menu", "text-xs"],
];

function TooltipDemo() {
  const container = useContainer();
  return (
    <Tooltip.Provider delay={80} closeDelay={0}>
      <div className="flex gap-px border border-rule bg-rule">
        {TOOLS.map(([icon, label, style]) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger
              aria-label={label}
              className={`bt-press size-10 bg-white font-display text-base hover:bg-accent ${focus} ${style}`}
            >
              {icon}
            </Tooltip.Trigger>
            <Tooltip.Portal container={container}>
              <Tooltip.Positioner sideOffset={8} className="z-40">
                <Tooltip.Popup className="bt-popup bg-foreground px-2 py-1 text-xs font-medium text-background">
                  {label}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Switch.Root renders the control
    <label className="flex items-center justify-between gap-4 border-b border-rule py-2.5">
      {label}
      <Switch.Root
        checked={checked}
        defaultChecked={checked === undefined ? true : undefined}
        onCheckedChange={onChange}
        className={`bt-switch relative flex h-7 w-12 shrink-0 border border-foreground bg-white p-[3px] data-[checked]:bg-accent ${focus}`}
      >
        <Switch.Thumb className="bt-thumb block size-5 bg-foreground" />
      </Switch.Root>
    </label>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Checkbox.Root renders the control
    <label className="flex items-center gap-3 border-b border-rule py-2.5">
      <Checkbox.Root
        checked={checked}
        defaultChecked={checked === undefined ? true : undefined}
        onCheckedChange={onChange}
        className={`bt-check flex size-5 shrink-0 items-center justify-center border border-foreground bg-white data-[checked]:bg-accent ${focus}`}
      >
        <Checkbox.Indicator className="bt-check-ind">
          <Check className="size-3.5" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  );
}

function ControlsDemo() {
  return (
    <div className="w-full max-w-60 text-sm font-medium">
      <SwitchRow label="Notifications" />
      <CheckRow label="Exaggerate poses" />
    </div>
  );
}

const TABS = [
  {
    v: "poses",
    label: "Poses",
    lines: [
      "Base UI does state and a11y.",
      "CSS draws every pose.",
      "No animation library.",
    ],
  },
  {
    v: "frames",
    label: "Frames",
    lines: [
      "One keyframe, one drawing.",
      "steps(1, end) holds it.",
      "Length = drawings ÷ fps.",
    ],
  },
  {
    v: "ease",
    label: "Easing",
    lines: [
      "Transitions can’t hold frames…",
      "…unless you use linear()",
      "with repeated stops.",
    ],
  },
];

function TabsDemo() {
  return (
    <Tabs.Root defaultValue="poses" className="w-full max-w-72">
      <Tabs.List className="relative z-0 flex border-b border-foreground">
        {TABS.map((t) => (
          <Tabs.Tab
            key={t.v}
            value={t.v}
            className={`h-9 flex-1 text-sm font-medium text-muted data-[active]:text-foreground ${focus}`}
          >
            {t.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator className="bt-tab-indicator inset-y-0 -z-10 bg-accent" />
      </Tabs.List>
      {TABS.map((t) => (
        <Tabs.Panel
          key={t.v}
          value={t.v}
          className="bt-tab-panel mt-3 text-sm font-medium outline-none"
        >
          {t.lines.map((l, i) => (
            <p key={l} style={at(i)} className="border-b border-rule py-1.5">
              {l}
            </p>
          ))}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}

const FAQ = [
  [
    "Why 12fps?",
    "It’s “on twos”: each drawing held for two frames of 24fps film.",
  ],
  [
    "Isn’t that just lag?",
    "Only when the poses are subtle. Push them and it looks deliberate.",
  ],
  ["What stays smooth?", "Anything you’re touching: pointer, drag, scroll."],
];

function AccordionDemo() {
  return (
    <Accordion.Root className="w-full max-w-72 border-t border-foreground">
      {FAQ.map(([q, a]) => (
        <Accordion.Item key={q} className="border-b border-rule">
          <Accordion.Header>
            <Accordion.Trigger
              className={`flex w-full items-center justify-between py-2.5 text-left text-sm font-medium ${focus}`}
            >
              {q}
              <span aria-hidden className="bt-plus text-base leading-none">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="bt-acc-panel">
            <p className="pb-3 text-[13px] leading-snug text-muted">{a}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

const MESSAGES = [
  ["Saved", "All 12 drawings are safe."],
  ["Exported", "sprite-sheet.png is ready."],
  ["Shared", "Link copied."],
];

function ToastButton() {
  const manager = Toast.useToastManager();
  const [i, setI] = useState(0);
  return (
    <button
      type="button"
      className={btn}
      onClick={() => {
        const [title, description] = MESSAGES[i % MESSAGES.length];
        manager.add({ title, description });
        setI(i + 1);
      }}
    >
      Save changes
    </button>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => (
    <Toast.Root
      key={t.id}
      toast={t}
      className={`bt-toast flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 p-3.5 ${surface}`}
    >
      <span className="grid size-5 shrink-0 place-items-center bg-accent">
        <Check className="size-3" />
      </span>
      <div className="min-w-0 flex-1">
        <Toast.Title className="font-display text-sm font-semibold" />
        <Toast.Description className="text-xs text-muted" />
      </div>
      <Toast.Close
        className="text-muted hover:text-foreground"
        aria-label="Dismiss"
      >
        ✕
      </Toast.Close>
    </Toast.Root>
  ));
}

function Toasts() {
  const container = useContainer();
  return (
    <Toast.Portal container={container}>
      <Toast.Viewport className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2 outline-none">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

const DEMOS = [
  { title: "Dialog", drawings: "5 in · 3 out", C: DialogDemo },
  { title: "Menu", drawings: "4 + 1 per item", C: MenuDemo },
  { title: "Popover", drawings: "4 in · 2 out", C: PopoverDemo },
  { title: "Tooltip", drawings: "4 in · 2 out", C: TooltipDemo },
  { title: "Switch & checkbox", drawings: "4 · 3", C: ControlsDemo },
  { title: "Tabs", drawings: "4", C: TabsDemo },
  { title: "Accordion", drawings: "4", C: AccordionDemo },
  { title: "Toast", drawings: "4 in · 2 out", C: ToastButton },
];

/** All of it at 12fps, exaggerated: the thing from the video. */
export function TwosDemos() {
  return (
    <Scope rate="twos" look="sprite" className="not-prose my-10">
      <Toast.Provider limit={3} timeout={3500}>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {DEMOS.map(({ title, drawings, C }, i) => (
            <div key={title} className="flex min-h-64 flex-col bg-white">
              <p
                className={`flex items-baseline justify-between gap-4 p-3 ${kicker}`}
              >
                <span>
                  <span className="mr-2 text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {title}
                </span>
                <span className="text-muted normal-case tracking-normal tabular-nums">
                  {drawings}
                </span>
              </p>
              <div className="flex flex-1 items-center justify-center px-5 pb-8">
                <C />
              </div>
            </div>
          ))}
        </div>
        <Toasts />
      </Toast.Provider>
    </Scope>
  );
}

/** Input stays smooth: the thumb tracks every frame, only the grab is drawn. */
export function TwosSlider() {
  return (
    <Scope
      rate="twos"
      look="sprite"
      className="not-prose my-10 flex h-40 items-center justify-center border border-rule bg-white"
    >
      <Slider.Root defaultValue={40} className="w-full max-w-64">
        <Slider.Control className="flex w-full touch-none items-center py-4 select-none">
          <Slider.Track className="h-0.5 w-full bg-rule">
            <Slider.Indicator className="bg-foreground" />
            <Slider.Thumb
              aria-label="Volume"
              className="bt-slider-thumb size-4 bg-foreground outline-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground"
            >
              <span className="bt-bubble pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 bg-accent px-1.5 py-0.5 text-xs font-medium tabular-nums">
                <Slider.Value />
              </span>
            </Slider.Thumb>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Scope>
  );
}

/* ========================= comparisons ========================= */

const VARIANTS = {
  smooth: {
    label: "Smooth",
    meta: "every frame",
    rate: "ones",
    look: "subtle",
  },
  laggy: { label: "Laggy", meta: "12fps", rate: "twos", look: "subtle" },
  cartoon: {
    label: "Cartoon",
    meta: "every frame, big poses",
    rate: "ones",
    look: "sprite",
  },
  twos: {
    label: "On twos",
    meta: "12fps, big poses",
    rate: "twos",
    look: "sprite",
  },
} as const;

type Variant = keyof typeof VARIANTS;

/** A stand-in dialog, contained in its cell so two can be open at once. */
function StageDialog({
  open,
  onOpenChange,
}: {
  open: boolean | null;
  onOpenChange: (v: boolean) => void;
}) {
  const state =
    open === null ? {} : open ? { "data-open": "" } : { "data-closed": "" };
  return (
    <div className="bt-stage absolute inset-0 grid place-items-center">
      <button type="button" className={btn} onClick={() => onOpenChange(true)}>
        Delete project…
      </button>
      <div
        {...state}
        aria-hidden
        className="bt-backdrop absolute inset-0"
        onClick={() => onOpenChange(false)}
      />
      <div
        {...state}
        role="dialog"
        aria-label="Delete this project?"
        inert={!open}
        className={`bt-dialog absolute inset-x-3 top-1/2 -translate-y-1/2 p-4 ${surface}`}
      >
        <p className="font-display text-lg leading-none font-semibold tracking-[-0.02em]">
          Delete this project?
        </p>
        <p className="mt-2 text-xs text-muted">You can’t undo this.</p>
        <div className="mt-4 grid grid-cols-2 gap-1.5 sm:flex sm:justify-end">
          <button
            type="button"
            className={`${ghost} h-8 px-2.5 text-xs`}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${danger} h-8 px-2.5 text-xs`}
            onClick={() => onOpenChange(false)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StageControls({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="absolute inset-0 grid place-items-center px-4">
      <div className="w-full max-w-48 text-sm font-medium">
        <SwitchRow label="Notify" checked={on} onChange={onChange} />
        <CheckRow label="Exaggerate" checked={on} onChange={onChange} />
      </div>
    </div>
  );
}

/** Two variants side by side, sharing state, so either one plays both. */
export function TwosCompare({
  a,
  b,
  demo,
}: {
  a: Variant;
  b: Variant;
  demo: "dialog" | "controls";
}) {
  // null = never opened, so the closing animation doesn't play on load
  const [open, setOpen] = useState<boolean | null>(null);
  const [on, setOn] = useState(true);
  return (
    <figure className="not-prose my-10">
      <div className="grid grid-cols-2 gap-px border border-rule bg-rule">
        {[a, b].map((key) => {
          const v = VARIANTS[key];
          return (
            <Scope
              key={key}
              rate={v.rate}
              look={v.look}
              className="flex h-64 flex-col bg-white"
            >
              <p className={`flex flex-col gap-0.5 p-3 ${kicker}`}>
                {v.label}
                <span className="text-muted normal-case tracking-normal">
                  {v.meta}
                </span>
              </p>
              <div className="relative flex-1">
                {demo === "dialog" ? (
                  <StageDialog open={open} onOpenChange={setOpen} />
                ) : (
                  <StageControls on={on} onChange={setOn} />
                )}
              </div>
            </Scope>
          );
        })}
      </div>
      <figcaption className={`mt-2 text-muted ${kicker}`}>
        Try either side, both play
      </figcaption>
    </figure>
  );
}

/* ========================= scrubber ========================= */

// bt-pop-in, one entry per drawing
const POSES = [
  "scale(0.45, 0.3) translateY(24px)",
  "scale(1.14, 0.84)",
  "scale(0.9, 1.12) translateY(-8px)",
  "scale(1.04, 0.97)",
  "none",
];
const FRAME_MS = 1000 / 12;

function PoseCard({
  pose,
  className,
  style,
}: {
  pose: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={{ ...style, transform: pose }}
      className={`absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 p-4 ${className}`}
    >
      <p className="font-display text-lg leading-none font-semibold tracking-[-0.02em]">
        Delete this project?
      </p>
      <p className="mt-2 text-xs text-muted">You can’t undo this.</p>
      <div className="mt-4 flex justify-end gap-1.5">
        <span className={`${ghost} h-8 px-2.5 text-xs`}>Cancel</span>
        <span className={`${danger} h-8 px-2.5 text-xs`}>Delete</span>
      </div>
    </div>
  );
}

/** Step through the dialog's drawings; earlier ones linger behind, fading with age. */
export function TwosScrubber() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = POSES.length - 1;

  // plays at 12fps: each drawing held for one tick, then stops on the last
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (frame >= last) setPlaying(false);
      else setFrame(frame + 1);
    }, FRAME_MS);
    return () => clearTimeout(id);
  }, [playing, frame, last]);

  const go = (f: number) => {
    setPlaying(false);
    setFrame(Math.min(last, Math.max(0, f)));
  };

  return (
    <figure className="not-prose my-10">
      <div className="relative h-64 overflow-hidden border border-rule bg-white">
        {POSES.slice(0, frame).map((pose, i) => (
          <PoseCard
            key={pose}
            pose={pose}
            style={{ opacity: 0.6 ** (frame - i) }}
            className={surface}
          />
        ))}
        <PoseCard
          pose={POSES[frame]}
          style={{ opacity: 0.85 }}
          className={surface}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* biome-ignore lint/a11y/useSemanticElements: buttons, not a form fieldset */}
        <div
          role="group"
          aria-label="Drawings"
          className="flex gap-px border border-rule bg-rule"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(frame + 1);
            if (e.key === "ArrowLeft") go(frame - 1);
          }}
        >
          <button
            type="button"
            onClick={() => {
              setFrame(0);
              setPlaying(true);
            }}
            className={`h-8 bg-white px-3 hover:bg-accent ${kicker} ${focus}`}
          >
            Play
          </button>
          {POSES.map((pose, i) => (
            <button
              key={pose}
              type="button"
              aria-label={`Drawing ${i + 1}`}
              aria-pressed={i === frame}
              onClick={() => go(i)}
              className={`size-8 text-xs font-medium tabular-nums hover:bg-accent aria-pressed:bg-foreground aria-pressed:text-background ${focus} ${i === frame ? "" : "bg-white"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <figcaption className="flex gap-4 text-xs text-muted tabular-nums">
          <span>{Math.round(frame * FRAME_MS)}ms</span>
          <code>transform: {POSES[frame]}</code>
        </figcaption>
      </div>
    </figure>
  );
}
