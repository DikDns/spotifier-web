import Link from "next/link";
import moment from "moment";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { type Task } from "@/lib/spot";
import { cn } from "@/lib/utils";

const SPOT_URL = env.NEXT_PUBLIC_SPOT_URL;

interface DetailTaskProps {
  index: number;
  task: Task;
}

export function DetailTask({ index, task }: DetailTaskProps) {
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
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </Badge>
      </div>

      <div className="text-wrap text-accent-foreground/75">
        {task.description}
      </div>

      <div className="flex flex-col gap-2 text-sm text-accent-foreground/75">
        {task.startDate && (
          <div>
            Start Date: {moment(task.startDate).format("DD MMM YYYY HH:mm")}
          </div>
        )}
        {task.dueDate && (
          <div>
            Due Date: {moment(task.dueDate).format("DD MMM YYYY HH:mm")} (
            {moment(task.dueDate).fromNow()})
          </div>
        )}
      </div>

      {task.file && (
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-accent-foreground/75">Attachment:</span>
          <Link
            href={SPOT_URL + task.file}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Download File
          </Link>
        </div>
      )}

      {task.answer && (
        <div
          className={cn(
            "space-y-2 rounded-lg border p-4",
            getStatusColor(task.status),
          )}
        >
          <h5 className="font-semibold text-foreground">Your Submission</h5>

          <div className="text-sm text-accent-foreground/75">
            Submitted:{" "}
            {moment(task.answer.dateSubmitted).format("DD MMM YYYY HH:mm")}
          </div>

          {task.answer.fileHref && (
            <div className="pt-2">
              <Link
                href={SPOT_URL + task.answer.fileHref}
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-zinc-50",
                )}
              >
                View Submitted File
              </Link>
            </div>
          )}

          {task.answer.isGraded && (
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Score: {task.answer.score}
              </div>
              {task.answer.lecturerNotes && (
                <div className="text-sm text-accent-foreground/75">
                  Notes: {task.answer.lecturerNotes}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
