import { SiteHeader } from "@/components/site-header";
import { WorkViewer } from "@/components/work-viewer";
import { experience } from "@/lib/content";
import { getImages } from "@/lib/images";

// The viewer lives in the layout so it stays mounted across /work/[slug]
// navigations — switching jobs animates instead of remounting the page.
export default function WorkLayout({ children }: LayoutProps<"/work">) {
  const jobs = experience.map((e) => ({
    ...e,
    photos: e.photos ? getImages(e.photos) : [],
  }));

  return (
    <>
      {/* Sticky on desktop so the full-height sidebar can sit beneath it. */}
      <div className="z-10 bg-background py-[var(--margin)] md:sticky md:top-0">
        <SiteHeader />
      </div>
      <WorkViewer jobs={jobs} />
      {children}
    </>
  );
}
