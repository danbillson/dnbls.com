// Body font candidates. Keys map to `html[data-font]` in globals.css.
export const bodyFonts = [
  { id: "inter", label: "Inter" },
  { id: "dm", label: "DM Sans" },
  { id: "plex", label: "IBM Plex Sans" },
  { id: "host", label: "Host Grotesk" },
] as const;

export type BodyFont = (typeof bodyFonts)[number]["id"];

export const FONT_KEY = "proto-font";
export const GRID_KEY = "proto-grid";

// Runs before paint so the chosen font/grid don't flash. `?font=dm&grid=1` overrides.
export const prototypeInitScript = `(function(){try{var d=document.documentElement,p=new URLSearchParams(location.search),f=p.get("font")||localStorage.getItem("${FONT_KEY}"),g=p.get("grid")||localStorage.getItem("${GRID_KEY}");if(f)d.dataset.font=f;if(g==="1")d.dataset.grid="1"}catch(e){}})()`;
