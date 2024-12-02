"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

interface CardTopic {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  href: string;
}

export const CardTopic = ({
  name,
  description,
  icon,
  color,
  time,
  href,
}: CardTopic) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative mx-auto block min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[101%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu bg-transparent backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <figcaption className="flex max-w-[768px] flex-row items-center text-lg font-medium dark:text-white">
            <span className="truncate text-sm sm:text-lg">{name}</span>
            <span className="mx-1 flex-shrink-0">·</span>
            <span className="flex-shrink-0 text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="max-w-[768px] truncate text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
