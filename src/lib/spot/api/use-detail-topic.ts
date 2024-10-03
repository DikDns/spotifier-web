"use client";

import { useQuery } from "@tanstack/react-query";
import { getDetailTopic } from "@/lib/spot/detail-topic";

export const useDetailTopic = (courseId: string, topicId: string) => {
  return useQuery({
    queryKey: ["detail-topic", courseId, topicId],
    queryFn: () => getDetailTopic(courseId, topicId),
  });
};
