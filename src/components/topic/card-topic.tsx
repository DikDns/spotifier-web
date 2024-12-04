"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface CardTopic {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  href: string;
  disabled?: boolean;
}

export const CardTopic = ({
  name,
  description,
  icon,
  color,
  time,
  href,
  disabled,
}: CardTopic) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{
        scale: disabled ? 1 : 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "relative mx-auto block min-h-fit w-full overflow-hidden rounded-2xl p-4",
          // light styles
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
          // dark styles
          "transform-gpu bg-transparent backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          // disabled styles
          disabled && "cursor-not-allowed opacity-60",
        )}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => !disabled && setIsHovered(false)}
      >
        <motion.div
          className="flex flex-row items-center gap-3"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: color,
            }}
            whileHover={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
          >
            <motion.span
              className="text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              {icon}
            </motion.span>
          </motion.div>

          <motion.div
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.figcaption
              className="flex max-w-[768px] flex-row items-center text-lg font-medium dark:text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span className="text-sm sm:text-lg">{name}</motion.span>
              <span className="mx-1 flex-shrink-0">·</span>
              <motion.span
                className="flex-shrink-0 text-xs text-gray-500"
                whileHover={{ scale: 1.05 }}
              >
                {time}
              </motion.span>
            </motion.figcaption>

            <motion.p
              className="line-clamp-1 max-w-[768px] text-wrap text-sm font-normal dark:text-white/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {description}
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            transformOrigin: "left",
            zIndex: 20,
          }}
        />
      </Link>
    </motion.div>
  );
};
