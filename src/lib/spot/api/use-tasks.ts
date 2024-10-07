"use client";

import { getTasks } from "@/lib/spot/tasks";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (setLoadingText: (text: string) => void) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      return getTasks(setLoadingText);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};
