"use client";

import { useTasks } from "@/lib/spot/api";
import { useEffect, useState } from "react";

export function PendingTasks() {
  const { data: tasks, isLoading } = useTasks();
  const [pendingTasks, setPendingTasks] = useState<typeof tasks>([]);

  useEffect(() => {
    if (tasks) {
      const pendingTasks = tasks.filter((task) => task.status === "pending");
      setPendingTasks(pendingTasks);
    }
  }, [tasks]);

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Pending Tasks
        </h2>
        {isLoading && <div>Loading...</div>}

        {pendingTasks?.map((task) => (
          <div key={task.id}>
            <h2 className="text-lg font-semibold">{task.course?.name}</h2>
            <h3 className="text-md font-medium">{task.title}</h3>
            <p className="text-sm text-muted-foreground">
              {task.dueDate?.toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
