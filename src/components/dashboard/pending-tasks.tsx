"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { motion } from "motion/react";
import { FaArrowRotateRight } from "react-icons/fa6";
import uniqolor from "uniqolor";

import { ErrorCard } from "@/components/common/error-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { CardTask } from "@/components/dashboard/card-task";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTasks } from "@/lib/spot/api";
import { cn } from "@/lib/utils";

export function PendingTasks() {
  const [loadingText, setLoadingText] = useState("Loading...");
  const {
    data: tasks,
    isFetching,
    isError,
    error,
    refetch,
  } = useTasks(setLoadingText);
  const [pendingTasks, setPendingTasks] = useState<typeof tasks>([]);

  useEffect(() => {
    if (tasks) {
      const filteredPendingTasks = tasks.filter(
        (task) => task.status === "pending",
      );
      setPendingTasks(filteredPendingTasks);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const renderLoading = () =>
    isFetching && <ScrapingLoadingCard text={loadingText} />;

  const renderEmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center space-y-2">
      <p className="text-wrap text-center font-medium text-accent-foreground/75 md:text-lg">
        All tasks are completed, good job! 🎉
      </p>
      <p className="text-wrap text-center text-sm text-accent-foreground/75">
        (Click the refresh button to load the latest tasks)
      </p>
    </div>
  );

  const renderTasks = () => (
    <div className="w-full">
      <AnimatedList storageKey="pending-tasks">
        {pendingTasks?.map((task) => {
          const color = uniqolor(task.course?.name ?? "", {
            format: "hex",
          });

          return (
            <AnimatedListItem key={task?.id}>
              <CardTask
                href={`/dashboard/courses/${task.courseId}/topics/${task.topicId}`}
                color={color.color}
                name={task.course?.name ?? ""}
                description={task?.title}
                icon="📝"
                time={moment(task?.dueDate).fromNow()}
              />
            </AnimatedListItem>
          );
        })}
      </AnimatedList>
    </div>
  );

  const hasPendingTasks = pendingTasks && pendingTasks.length > 0;
  const gradientColors = hasPendingTasks
    ? "from-amber-500/10 via-amber-500/30 to-amber-500/10"
    : "from-green-500/10 via-green-500/30 to-green-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative h-full items-start justify-start overflow-hidden rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <motion.div
        className={cn("absolute inset-0 bg-gradient-to-r", gradientColors)}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Pending Tasks
          </h2>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isFetching}
                  variant="ghost"
                  onClick={() => refetch()}
                  className="hover:bg-accent/20"
                >
                  <FaArrowRotateRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" variant="inverseAccent">
                <p>Refetch Pending tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative h-full space-y-4">
          {renderLoading()}

          {isError && (
            <ErrorCard
              title="Failed to load tasks"
              description={
                error?.message || "There was an error loading your tasks"
              }
              retry={() => refetch()}
            />
          )}

          {!isFetching &&
            !isError &&
            (pendingTasks?.length === 0 ? renderEmptyState() : renderTasks())}
        </div>
      </div>
    </motion.div>
  );
}
