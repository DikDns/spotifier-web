"use client";

import uniqolor from "uniqolor";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/spot/api";

import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { useLocalStorage } from "usehooks-ts";

export function PendingTasks() {
  const router = useRouter();
  const { data: tasks, isLoading } = useTasks();
  const [localTasks, setLocalTasks] = useLocalStorage<typeof tasks>(
    "pendingTasks",
    [],
  );
  const [pendingTasks, setPendingTasks] = useState<typeof tasks>([]);

  useEffect(() => {
    if (localTasks) {
      setPendingTasks(localTasks);
    }
  }, [localTasks]);

  useEffect(() => {
    if (tasks) {
      const filteredPendingTasks = tasks.filter(
        (task) => task.status === "pending",
      );
      setLocalTasks(filteredPendingTasks);
    }
  }, [tasks, setLocalTasks]);

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Pending Tasks
        </h2>

        {isLoading && <div>Loading...</div>}
      </div>

      <div className="w-full">
        <AnimatedList>
          {pendingTasks?.map((task) => {
            const color = uniqolor(task.course?.name ?? "", {
              format: "hex",
            });

            return (
              <AnimatedListItem key={task?.id}>
                <Item
                  onClick={() => {
                    router.push(
                      `https://spot.upi.edu/mhs/tugas/${task.courseId}/${task.topicId}`,
                    );
                  }}
                  color={color.color}
                  name={task?.course?.name ?? ""}
                  description={task?.title}
                  icon="📝"
                  time={moment(task?.dueDate).fromNow()}
                />
              </AnimatedListItem>
            );
          })}
        </AnimatedList>
      </div>
    </div>
  );
}

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  onClick: () => void;
}

const Item = ({ name, description, icon, color, time, onClick }: Item) => {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
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
          <figcaption className="flex max-w-[400px] flex-row items-center text-lg font-medium dark:text-white">
            <span className="truncate text-sm sm:text-lg">{name}</span>
            <span className="mx-1 flex-shrink-0">·</span>
            <span className="flex-shrink-0 text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="max-w-[400px] truncate text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};
