import { toast } from "sonner";

import { postTask } from "@/lib/spot/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTask,
    onSuccess: () => {
      toast.success("Task submitted successfully");
      void queryClient.invalidateQueries({
        queryKey: ["detail-course"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["detail-topic"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
