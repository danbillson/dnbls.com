import {
  GithubIcon,
  LinkedinIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Social() {
  return (
    <div className="flex justify-center m-6 gap-3 mt-12 print:hidden">
      <a
        href="https://github.com/danbillson"
        className="w-6 h-6 mx-2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <HugeiconsIcon icon={GithubIcon} />
      </a>
      <a
        href="https://x.com/dbillson"
        className="w-6 h-6 mx-2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
      >
        <HugeiconsIcon icon={NewTwitterIcon} />
      </a>
      <a
        href="https://www.linkedin.com/in/danbillson/"
        className="w-6 h-6 mx-2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <HugeiconsIcon icon={LinkedinIcon} />
      </a>
    </div>
  );
}
