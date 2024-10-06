"use client";

import { getDetailCourse } from "@/lib/spot/detail-course";
import { useQuery } from "@tanstack/react-query";

export const useDetailCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["detail-course", courseId],
    queryFn: () => getDetailCourse(courseId),
  });
};
