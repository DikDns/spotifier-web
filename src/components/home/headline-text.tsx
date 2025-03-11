"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";

import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/ui/blur-fade";
import { backOut } from "@/lib/animation-utils";

const MIN_VALUE_TRIGGER = 0;
const MAX_HEIGHT_SCROLL = 600;

export function HeadlineText() {
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollPercent = latest / MAX_HEIGHT_SCROLL;
    // -1 for reverse
    const x = backOut(scrollPercent) * -1;

    const taglineSection = document.getElementById("tagline-section");
    if (taglineSection && scrollPercent >= MIN_VALUE_TRIGGER) {
      taglineSection.style.top = `${128 * x}px`;
    }
  });

  return (
    <section
      id="tagline-section"
      className="fixed left-0 right-0 top-0 z-[0] flex min-h-svh flex-col items-center justify-center px-3"
    >
      <div className="mb-9">
        <TextAnimate
          animation="scaleUp"
          as="h1"
          className="text-center font-sans text-lg font-bold sm:text-4xl lg:text-6xl"
          by="character"
          once
        >
          Takes SPOT to the modern era.
        </TextAnimate>
      </div>
      <div className="mb-6 flex w-full items-center justify-center sm:w-96">
        <BlurFade delay={0.75} blur="3px">
          <Link href="/start">
            <InteractiveHoverButton className="text-sm sm:text-lg">
              Begin the Experience
            </InteractiveHoverButton>
          </Link>
        </BlurFade>
      </div>
    </section>
  );
}
