"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/spot/courses";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};
