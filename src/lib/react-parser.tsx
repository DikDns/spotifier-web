import HtmlReactParser, { Element } from "html-react-parser";

import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

export function ReactParser(rawHtml: string) {
  return HtmlReactParser(rawHtml, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "a") {
        return (
          <a
            href={`${env.NEXT_PUBLIC_SPOT_URL}${domNode.attribs.href}`}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "decoration-transparent",
            )}
          >
            File Link
          </a>
        );
      }
    },
  });
}
