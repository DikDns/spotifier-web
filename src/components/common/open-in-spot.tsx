"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { cn } from "@/lib/utils";

export function OpenInSpot({
  href,
  children,
  target = "_blank",
}: {
  href: string;
  children?: ReactNode;
  target?: "_blank" | "_self";
}) {
  return (
    <Link
      href={`${env.NEXT_PUBLIC_SPOT_URL}${href}`}
      target={target}
      className={cn(buttonVariants({ variant: "outline" }), "gap-x-2")}
    >
      {children ?? (
        <>
          Open in SPOT <ExternalLink className="h-4 w-4" />
        </>
      )}
    </Link>
  );
}
