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
    mutationFn: async (task: PostTaskPayload) => {
      let res = await postTask({
        courseId,
        topicId,
        task,
      });

      // Wait for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This is double to ensure that the task is submitted because SPOT is so frucking slow
      res = await postTask({
        courseId,
        topicId,
        task,
      });

      return res;
    },
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
