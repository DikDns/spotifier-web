"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type DetailTopic, getDetailTopic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useDetailTopic = (courseId: string, topicId: string) => {
  const [detailTopic, setDetailTopic] = useLocalStorage<DetailTopic>(
    `detail-topic-${courseId}-${topicId}`,
    undefined,
  );
  const query = useQuery({
    queryKey: ["detail-topic", courseId, topicId],
    queryFn: () => getDetailTopic(courseId, topicId),
    initialData: detailTopic,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setDetailTopic(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
