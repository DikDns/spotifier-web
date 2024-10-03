"use client";

import { FaSpinner } from "react-icons/fa6";

import { BorderBeam } from "@/components/ui/border-beam";
import { GradualSpacing } from "@/components/ui/gradual-spacing";
import { cn } from "@/lib/utils";

export function ScrapingLoadingCard({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div
      className={cn(
        "relative my-2 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border py-2 backdrop-blur-md [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] md:shadow-md",
      )}
    >
      <GradualSpacing
        className="text-center text-xl font-semibold -tracking-[0.25rem] text-black dark:text-white md:text-2xl"
        text={"Crunching SPOT..."}
      />
      <div className="flex items-center justify-center gap-x-2">
        <FaSpinner className="animate-spin text-sm" />
        <GradualSpacing
          className="text-center text-sm -tracking-[0.3rem] text-accent-foreground/75 md:text-base"
          text={text}
        />
      </div>
      <BorderBeam
        colorFrom="#8b5cf6"
        colorTo="#a855f7"
        size={128}
        duration={3}
        delay={3}
      />
    </div>
  );
}
