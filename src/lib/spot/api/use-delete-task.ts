import { toast } from "sonner";

import { deleteTask } from "@/lib/spot/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTask = (courseId: string, topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string) =>
      deleteTask({ courseId, topicId, answerId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["detail-topic", courseId, topicId],
      });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
