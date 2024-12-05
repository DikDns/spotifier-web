import { toast } from "sonner";

import { postTask } from "@/lib/spot/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostTaskPayload {
  id: string;
  token: string;
  description: string;
  file: File;
}

export const usePostTask = (courseId: string, topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: PostTaskPayload) =>
      postTask({
        courseId,
        topicId,
        task,
      }),
    onSuccess: () => {
      toast.success("Task submitted successfully");
      void queryClient.invalidateQueries({
        queryKey: ["detail-topic", courseId, topicId],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
