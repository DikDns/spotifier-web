"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";

export function Card({
  children,
  className,
  childrenClassName,
}: {
  children: React.ReactNode;
  className?: string;
  childrenClassName?: string;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <MagicCard
      className={cn(
        "min-h-10 flex-col items-center justify-center whitespace-nowrap rounded-md shadow-2xl",
        className,
      )}
      childrenClassName={childrenClassName}
      gradientColor={resolvedTheme === "dark" ? "#262626" : "#D9D9D955"}
    >
      {children}
    </MagicCard>
  );
}
