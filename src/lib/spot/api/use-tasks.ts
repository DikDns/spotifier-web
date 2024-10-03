"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/spot/tasks";

export const useTasks = (setLoadingText: (text: string) => void) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(setLoadingText),
  });
};
