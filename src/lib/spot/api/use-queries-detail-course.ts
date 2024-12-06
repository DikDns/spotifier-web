"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type DetailCourse, getDetailCourse } from "@/lib/spot/detail-course";
import { useQueries } from "@tanstack/react-query";

export const useQueriesDetailCourse = (courseIds: string[], enabled = true) => {
  const [detailCourses, setDetailCourses] = useLocalStorage<DetailCourse[]>(
    `detail-courses-${courseIds.join("-")}`,
    [],
  );
  const queries = useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: ["detail-course", courseId],
      queryFn: () => getDetailCourse(courseId),
      placeholderData: detailCourses?.find((course) => course.id === courseId),
      staleTime: 1000 * 60 * 5,
      enabled,
    })),
  });

  useEffect(() => {
    if (queries.every((query) => query.data && query.isSuccess)) {
      const detailCourses = queries
        .map((query) => query.data)
        .filter(Boolean) as DetailCourse[];
      setDetailCourses(detailCourses);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries.every((query) => query.data && query.isSuccess)]);

  return queries;
};
