"use client";

import { getDetailTopic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useTopics = (courseId: string, topicIds: string[]) => {
  return useQuery({
    queryKey: ["detail-topic", courseId, topicIds],
    queryFn: async () => {
      const promises = topicIds.map((topicId) =>
        getDetailTopic(courseId, topicId),
      );
      const data = await Promise.all(promises);
      return data;
    },
  });
};
