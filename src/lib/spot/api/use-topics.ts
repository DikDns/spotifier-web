"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getDetailTopic, type Topic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useTopics = (courseId: string, topicIds: string[]) => {
  const [detailTopics, setDetailTopics] = useLocalStorage<Topic[]>(
    `detail-topic-${courseId}`,
    undefined,
  );
  const query = useQuery({
    queryKey: ["detail-topic", courseId, topicIds],
    queryFn: async () => {
      const promises = topicIds.map((topicId) =>
        getDetailTopic(courseId, topicId),
      );
      const data = await Promise.all(promises);
      return data;
    },
    placeholderData: detailTopics,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      setDetailTopics(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
