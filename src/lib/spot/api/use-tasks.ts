"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/spot/tasks";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};
