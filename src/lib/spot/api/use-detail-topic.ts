"use client";

import { getDetailTopic } from "@/lib/spot/detail-topic";
import { useQuery } from "@tanstack/react-query";

export const useDetailTopic = (courseId: string, topicId: string) => {
  return useQuery({
    queryKey: ["detail-topic", courseId, topicId],
    queryFn: () => getDetailTopic(courseId, topicId),
  });
};
