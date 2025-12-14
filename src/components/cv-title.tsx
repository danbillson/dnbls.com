export function CVTitle() {
  return (
    <div className="flex justify-between w-full">
      <div>
        <h1 className="text-3xl font-medium">Dan Billson</h1>
        <p className="text-sm text-muted-foreground">Software Engineer</p>
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
