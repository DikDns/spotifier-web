"use client";

import { motion } from "motion/react";
import {
  FaBookOpen,
  FaCheck,
  FaIdCard,
  FaListCheck,
  FaXmark,
} from "react-icons/fa6";

import { useProfileStats } from "@/lib/hooks/use-profile-stats";
import { useUser } from "@/lib/spot/api";
import { cn } from "@/lib/utils";

export function Profile() {
  const userQuery = useUser();
  const stats = useProfileStats();

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
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Profile</h2>
          <div className="flex items-center gap-2 text-accent-foreground/75">
            <FaIdCard className="h-5 w-5" />
            <span className="text-lg font-medium">
              {userQuery.data?.nim ?? "No NIM"}
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {userQuery.data?.name ?? "Guest User"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Total Courses",
              value: stats.totalCourses,
              icon: FaBookOpen,
              color: "text-violet-500",
            },
            {
              label: "Total Tasks",
              value: stats.totalTasks,
              icon: FaListCheck,
              color: "text-violet-500",
            },
            {
              label: "Tasks Done",
              value: stats.tasksDone,
              icon: FaCheck,
              color: "text-green-500",
            },
            {
              label: "Tasks Missed",
              value: stats.tasksMissed,
              icon: FaXmark,
              color: "text-red-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="relative overflow-hidden rounded-lg border border-accent/20 bg-accent/10 p-4 transition-colors hover:bg-accent/20"
            >
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm text-accent-foreground/75">
                    {stat.label}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
