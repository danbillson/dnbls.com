export function CVTitle() {
  return (
    <div className="flex justify-between w-full not-print:mt-14">
      <div>
        <h1 className="text-title-lg">Dan Billson</h1>
        <p className="text-label text-content-secondary">Software Engineer</p>
      </div>
      <div className="flex flex-col text-right">
        <p>London</p>
        <a className="underline" href="mailto:dan@dnbls.com">
          dan@dnbls.com
        </a>
        <a className="underline" href="https://github.com/danbillson">
          github.com/danbillson
        </a>
      </div>
    </div>
  );
}
