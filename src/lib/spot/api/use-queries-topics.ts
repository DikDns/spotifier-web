"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getDetailTopic, type Topic } from "@/lib/spot/detail-topic";
import { useQueries } from "@tanstack/react-query";

export const useQueriesTopics = (
  courseId: string,
  topicIds: string[],
  enabled = true,
) => {
  const [detailTopics, setDetailTopics] = useLocalStorage<Topic[]>(
    `detail-topic-${courseId}`,
    [],
  );
  const queries = useQueries({
    queries: topicIds.map((topicId) => ({
      queryKey: ["detail-topic", courseId, topicId],
      queryFn: () => getDetailTopic(courseId, topicId),
      placeholderData: detailTopics?.find((topic) => topic.id === topicId),
      staleTime: 1000 * 60 * 5,
      enabled,
    })),
  });

  useEffect(() => {
    if (queries.every((query) => query.data && query.isSuccess)) {
      const data = queries
        .map((query) => query.data)
        .filter(Boolean) as Topic[];
      setDetailTopics(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return queries;
};
