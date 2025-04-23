"use client";

import { motion } from "motion/react";
import { FaBookOpen, FaCheck, FaListCheck, FaXmark } from "react-icons/fa6";

import { useProfileStats } from "@/lib/hooks/use-profile-stats";
import { useLocale } from "@/lib/locale-utils";
import { useUser } from "@/lib/spot/api";
import { cn } from "@/lib/utils";

export function Profile() {
  const userQuery = useUser();
  const stats = useProfileStats();
  const { translations } = useLocale();

  const statsArray = [
    stats.totalCourses && {
      label: translations.dashboard.profile.stats.totalCourses,
      value: stats.totalCourses,
      icon: FaBookOpen,
      color: "text-violet-500",
    },
    stats.totalTasks && {
      label: translations.dashboard.profile.stats.totalTasks,
      value: stats.totalTasks,
      icon: FaListCheck,
      color: "text-violet-500",
    },
    stats.tasksDone && {
      label: translations.dashboard.profile.stats.tasksDone,
      value: stats.tasksDone,
      icon: FaCheck,
      color: "text-green-500",
    },
    stats.tasksMissed && {
      label: translations.dashboard.profile.stats.tasksMissed,
      value: stats.tasksMissed,
      icon: FaXmark,
      color: "text-red-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative h-full items-start justify-start overflow-hidden rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-violet-500/30 to-violet-500/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative space-y-6">
        {/* Profile Header */}
        <div>
          <h2 className="pb-2 text-3xl font-semibold tracking-tight">
            {translations.dashboard.profile.title}
          </h2>

          <span className="text-lg font-medium text-accent-foreground/75">
            {userQuery.data?.nim ?? translations.dashboard.profile.noNim}
          </span>

          <p className="text-2xl font-semibold">
            {userQuery.data?.name ?? translations.dashboard.profile.noName}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {statsArray.map((stat, index) => {
            if (!stat) return null;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="relative overflow-hidden rounded-lg border border-accent/20 bg-accent/10 p-4 transition-colors hover:bg-accent/20"
              >
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs text-accent-foreground/75">
                      {stat.label}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
