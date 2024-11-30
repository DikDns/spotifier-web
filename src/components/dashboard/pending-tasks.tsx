"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { FaArrowRotateRight } from "react-icons/fa6";
import uniqolor from "uniqolor";

import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { TaskItem } from "@/components/common/task-item";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useTasks } from "@/lib/spot/api";

export function PendingTasks() {
  const router = useRouter();
  const [loadingText, setLoadingText] = useState("Loading...");
  const { data: tasks, isLoading, refetch } = useTasks(setLoadingText);
  const [localTasks, setLocalTasks] = useLocalStorage<typeof tasks>(
    "pendingTasks",
    [],
  );
  const [pendingTasks, setPendingTasks] = useState<typeof tasks>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (localTasks) {
      setPendingTasks(localTasks);
    }

    setIsClient(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tasks) {
      const filteredPendingTasks = tasks.filter(
        (task) => task.status === "pending",
      );
      setLocalTasks(filteredPendingTasks);
      setPendingTasks(filteredPendingTasks);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  if (!isClient) return null;

  const renderLoading = () =>
    isLoading && <ScrapingLoadingCard text={loadingText} />;

  const renderEmptyState = () => (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        All tasks are completed, good job!
      </p>
    </div>
  );

  const renderTasks = () => (
    <div className="w-full">
      <AnimatedList storageKey="pendingTasks">
        {pendingTasks?.map((task) => {
          const color = uniqolor(task.course?.name ?? "", {
            format: "hex",
          });

          return (
            <AnimatedListItem key={task?.id}>
              <TaskItem
                onClick={() => {
                  router.push(
                    `https://spot.upi.edu/mhs/tugas/${task.courseId}/${task.topicId}`,
                  );
                }}
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

  return (
    <div className="space-y-2">
      <div className="flex gap-x-2 pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Pending Tasks
        </h2>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={isLoading}
                variant="ghost"
                onClick={() => refetch()}
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

      {renderLoading()}

      {pendingTasks?.length === 0 ? renderEmptyState() : renderTasks()}
    </div>
  );
}
