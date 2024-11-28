"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { type DetailTopic, getDetailTopic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useTopics = (courseId: string, topicIds: string[]) => {
  const [detailTopics, setDetailTopics] = useLocalStorage<DetailTopic[]>(
    `detail-topic-${courseId}`,
    [],
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
    initialData: detailTopics,
  });

  useEffect(() => {
    if (query.data) {
      setDetailTopics(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
