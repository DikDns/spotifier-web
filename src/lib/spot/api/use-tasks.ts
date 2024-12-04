"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getTasks, type GetTasksResponse } from "@/lib/spot/tasks";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (setLoadingText: (text: string) => void) => {
  const [tasks, setTasks] = useLocalStorage<GetTasksResponse>("tasks", []);

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return getTasks(setLoadingText);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    placeholderData: tasks,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setTasks(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isSuccess, query.data]);

  return query;
};
