import Link from "next/link";
import moment from "moment";

import { DeleteTaskButton } from "@/components/topic/delete-task-button";
import { DialogSubmitTask } from "@/components/topic/dialog-submit-task";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { useLocale } from "@/lib/locale-utils";
import { ReactParser } from "@/lib/react-parser";
import { type Task } from "@/lib/spot";
import { cn } from "@/lib/utils";

const SPOT_URL = env.NEXT_PUBLIC_SPOT_URL;

interface DetailTaskProps {
  index: number;
  task: Task;
}

export function DetailTask({ index, task }: DetailTaskProps) {
  const { translations } = useLocale();

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "submitted":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "graded":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "notSubmitted":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-2">
        <h4 className="scroll-m-20 text-wrap text-xl font-semibold tracking-tight first:mt-0">
          {`${index + 1}.`} {task?.title}
        </h4>

        <Badge className={cn(getStatusColor(task.status))}>
          {task.status === "pending" && translations.task.status.pending}
          {task.status === "submitted" && translations.task.status.submitted}
          {task.status === "graded" && translations.task.status.graded}
          {task.status === "notSubmitted" &&
            translations.task.status.notSubmitted}
        </Badge>
      </div>

      <div className="text-wrap text-accent-foreground/75">
        {task.description}
      </div>

      <div className="flex flex-col gap-2 text-sm text-accent-foreground/75">
        {task.startDate && (
          <div>
            {translations.task.startDate}:{" "}
            {moment(task.startDate).format(translations.task.detail.dateFormat)}
          </div>
        )}
        {task.dueDate && (
          <div>
            {translations.task.dueDate}:{" "}
            {moment(task.dueDate).format(translations.task.detail.dateFormat)} (
            {moment(task.dueDate).fromNow()})
          </div>
        )}
      </div>

      {task.file && (
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-accent-foreground/75">
            {translations.task.attachment}:
          </span>
          <Link
            href={SPOT_URL + task.file}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {translations.task.downloadFile}
          </Link>
        </div>
      )}

      {task.answer && (
        <div
          className={cn(
            "space-y-2 rounded-lg border bg-muted-foreground/10 p-4",
          )}
        >
          <h5 className="font-semibold text-foreground">
            {translations.task.submission.title}
          </h5>

          <div className="text-sm text-accent-foreground/75">
            {translations.task.submission.submitted}:{" "}
            {moment(task.answer.dateSubmitted).format(
              translations.task.detail.dateFormat,
            )}
          </div>

          <div className="prose prose-sm max-w-full text-wrap text-sm dark:prose-invert">
            {ReactParser(task.answer.content)}
          </div>

          {task.answer.fileHref && (
            <div className="flex items-center gap-x-2 pt-2">
              <Link
                href={SPOT_URL + task.answer.fileHref}
                target="_blank"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {translations.task.submission.viewFile}
              </Link>

              <DeleteTaskButton task={task} />
            </div>
          )}

          {task.answer.isGraded && (
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {translations.task.grading.score}: {task.answer.score}
              </div>
              {task.answer.lecturerNotes && (
                <div className="text-sm text-accent-foreground/75">
                  {translations.task.grading.notes}: {task.answer.lecturerNotes}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-x-2">
        {(task.status === "pending" || task.status === "notSubmitted") && (
          <DialogSubmitTask task={task} />
        )}
      </div>
    </div>
  );
}
