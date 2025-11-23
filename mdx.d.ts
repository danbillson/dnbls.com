declare module "*.mdx" {
  import { MDXProps } from "mdx/types";

  export const metadata: {
    title?: string;
    date?: string;
    description?: string;
    published?: boolean;
  };

  export default function MDXContent(props: MDXProps): JSX.Element;
}

