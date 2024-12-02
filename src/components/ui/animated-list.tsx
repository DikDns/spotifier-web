"use client";

import React, { type ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  storageKey?: string;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 500, storageKey }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const [hasSeenBefore, setHasSeenBefore] = useLocalStorage<boolean>(
      `animated-list-${storageKey ?? "default"}`,
      false,
    );
    const childrenArray = React.Children.toArray(children);

    // Use a faster delay if the user has seen the animation before
    const effectiveDelay = hasSeenBefore ? Math.min(delay / 2, 256) : delay;

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          // Check if we should loop or stop
          if (prevIndex + 1 < childrenArray.length) {
            return prevIndex + 1;
          } else {
            clearInterval(interval); // Stop the interval when all items are shown
            // Mark as seen after the first complete viewing
            setHasSeenBefore(true);
            return prevIndex; // Keep the last index
          }
        });
      }, effectiveDelay);

      return () => clearInterval(interval);
    }, [childrenArray.length, effectiveDelay, setHasSeenBefore]);

    const itemsToShow = useMemo(
      () => childrenArray.slice(0, index + 1).reverse(),
      [index, childrenArray],
    );

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 800, damping: 80 },
  };

  return (
    // @ts-expect-error MotionProps is not compatible with HTMLAttributesWithoutMotionProps
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
