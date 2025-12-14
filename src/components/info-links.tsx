import { InstagramIcon, LinkSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type LinkTitleProps = {
  location: string;
  url?: string;
  instagram?: string;
};

export function InfoLinks({ location, url, instagram }: LinkTitleProps) {
  return (
    <div className="flex items-center justify-between mt-3 text-muted-foreground">
      <p className={cn("leading-7 inline-flex font-bold")}>{location}</p>
      <div className="flex gap-4">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            <HugeiconsIcon icon={LinkSquare01Icon} />
          </a>
        ) : null}
        {instagram ? (
          <a href={instagram} target="_blank" rel="noreferrer">
            <HugeiconsIcon icon={InstagramIcon} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
