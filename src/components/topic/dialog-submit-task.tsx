"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import moment from "moment";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Task } from "@/lib/spot";
import { usePostTask } from "@/lib/spot/api/use-post-task";

interface DialogSubmitTaskProps {
  task: Task;
}

export function DialogSubmitTask({ task }: DialogSubmitTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: postTask, isPending } = usePostTask();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    void postTask({
      courseId: task.courseId,
      topicId: task.topicId,
      task: {
        id: task.id,
        token: task.token,
        description,
        file,
      },
    }).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Submit Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>
            Submit your task for this topic.
          </DialogDescription>
        </DialogHeader>

        {task.status === "notSubmitted" && (
          <Alert variant="destructive">
            <AlertTitle>Task Deadline Passed</AlertTitle>
            <AlertDescription>
              This task has passed the deadline {moment(task.dueDate).fromNow()}
              . If you submit it today, the date submitted will be the current
              date.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter your submission description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attachment</Label>
            <Input
              id="file"
              name="file"
              type="file"
              required
              // accept all document types, images, and compressed files
              accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,.zip,.rar,.tar,.gz,.bz2,.7z"
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
