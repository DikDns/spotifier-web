"use client";

import { useQuery } from "@tanstack/react-query";
import { getDetailCourse } from "@/lib/spot/detail-course";

export const useDetailCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["detail-course", courseId],
    queryFn: () => getDetailCourse(courseId),
  });
};
