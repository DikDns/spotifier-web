"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type Course, type GetTasksResponse } from "@/lib/spot";

export const useProfileStats = () => {
  const [tasksDone, setTasksDone] = useLocalStorage<number>("tasks-done", 0);
  const [tasksMissed, setTasksMissed] = useLocalStorage<number>(
    "tasks-missed",
    0,
  );
  const [tasks] = useLocalStorage<GetTasksResponse>("tasks", []);
  const [courses] = useLocalStorage<Course[]>("courses", []);

  useEffect(() => {
    if (tasks) {
      setTasksDone(
        tasks?.filter(
          (task) => task.status === "submitted" || task.status === "graded",
        ).length ?? 0,
      );
      setTasksMissed(
        tasks?.filter((task) => task.status === "notSubmitted").length ?? 0,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  return {
    tasks,
    courses,
    tasksDone,
    tasksMissed,
    totalTasks: tasks?.length ?? 0,
    totalCourses: courses?.length ?? 0,
  };
};
