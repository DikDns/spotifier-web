"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import heroVideoAfter from "@/assets/hero-video-after.gif";
import heroVideoBefore from "@/assets/hero-video-before.gif";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Card, CardContent } from "@/components/ui/card";
import { easeInOut } from "@/lib/animation-utils";
import { mapRange } from "@/lib/map-range";

const TOP_OFFSET = 1000;
const BOTTOM_OFFSET = 1500;

export function PreviewVideo() {
  const parentRef = useRef<HTMLElement | null>(null);
  const previewSliderRef = useRef<HTMLDivElement | null>(null);
  const previewSliderInsideRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400, 2028, 5000], [0, -428, 1200, 0]);

  useMotionValueEvent(scrollY, "change", (currentPos) => {
    if (!(currentPos < TOP_OFFSET || currentPos > BOTTOM_OFFSET)) return;
    const scrollPercent = mapRange(currentPos, TOP_OFFSET, BOTTOM_OFFSET, 0, 1);
    const x = easeInOut(scrollPercent * -1);

    const previewSlider = previewSliderRef.current;
    const previewSliderInside = previewSliderInsideRef.current;

    if (previewSlider && previewSliderInside) {
      previewSlider.style.right = `${x * 100}%`;
      previewSliderInside.style.right = `-${x * 100}%`;
    }
  });

  return (
    <motion.section
      ref={parentRef}
      style={{ y }}
      className={"flex min-h-svh items-center justify-center bg-background"}
    >
      <Card
        className={
          "relative m-4 aspect-video w-full max-w-[1280px] sm:m-6 md:mx-16 md:my-0 md:w-[75%]"
        }
      >
        <ShineBorder
          borderWidth={2}
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          className="z-50"
        />

        <CardContent className="overflow-hidden p-0">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <div className="absolute top-0 z-0 aspect-video w-full">
              <Image
                src={heroVideoBefore}
                alt="Preview Features Video Before (SPOT-UPI)"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              ref={previewSliderRef}
              className="absolute right-full top-0 z-10 aspect-video w-full overflow-hidden border-r-4 border-r-destructive"
            >
              <div
                ref={previewSliderInsideRef}
                className="absolute -right-full h-full w-full"
              >
                <Image
                  src={heroVideoAfter}
                  alt="Preview Features Video After (SPOTifier)"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
