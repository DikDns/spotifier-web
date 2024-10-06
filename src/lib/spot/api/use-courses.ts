"use client";

import { getCourses } from "@/lib/spot/courses";
import { useQuery } from "@tanstack/react-query";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};
