"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type Course, getCourses } from "@/lib/spot/courses";
import { useQuery } from "@tanstack/react-query";

export const useCourses = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>("courses", undefined);

  const query = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    initialData: courses,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setCourses(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
