import { toast } from "sonner";

import { deleteTask } from "@/lib/spot/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["detail-course"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["detail-topic"],
      });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
