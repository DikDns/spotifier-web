import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@/lib/locale-utils";
import { type Task } from "@/lib/spot";
import { useDeleteTask } from "@/lib/spot/api/use-delete-task";

interface DeleteTaskButtonProps {
  task: Task;
}

export function DeleteTaskButton({ task }: DeleteTaskButtonProps) {
  const { translations } = useLocale();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(
    task.courseId,
    task.topicId,
  );

  const handleDelete = () => {
    if (!task.answer) return;

    deleteTask(task.answer.id);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting} size="icon">
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {translations.topic.deleteTask.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {translations.topic.deleteTask.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {translations.topic.deleteTask.cancel}
                </AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  {translations.topic.deleteTask.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent side="right" variant="destructive">
          <p>{translations.topic.deleteTask.button}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
