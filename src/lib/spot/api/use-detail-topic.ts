"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getDetailTopic, type Topic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useDetailTopic = (
  courseId: string,
  topicId: string,
  enabled = true,
) => {
  const [detailTopic, setDetailTopic] = useLocalStorage<Topic>(
    `detail-topic-${courseId}-${topicId}`,
    undefined,
  );
  const query = useQuery({
    queryKey: ["detail-topic", courseId, topicId],
    queryFn: () => getDetailTopic(courseId, topicId),
    placeholderData: detailTopic,
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      setDetailTopic(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
