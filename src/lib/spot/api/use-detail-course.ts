"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type DetailCourse, getDetailCourse } from "@/lib/spot/detail-course";
import { useQuery } from "@tanstack/react-query";

export const useDetailCourse = (courseId: string) => {
  const [detailCourse, setDetailCourse] = useLocalStorage<DetailCourse>(
    `detail-course-${courseId}`,
    undefined,
  );
  const query = useQuery({
    queryKey: ["detail-course", courseId],
    queryFn: () => getDetailCourse(courseId),
    initialData: detailCourse,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (query.data) {
      setDetailCourse(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
