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
import { useLocale } from "@/lib/locale-utils";
import { type Task } from "@/lib/spot";
import { usePostTask } from "@/lib/spot/api/use-post-task";

interface DialogSubmitTaskProps {
  task: Task;
}

export function DialogSubmitTask({ task }: DialogSubmitTaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { translations } = useLocale();
  const { mutateAsync: postTask, isPending } = usePostTask(
    task.courseId,
    task.topicId,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    void postTask({
      id: task.id,
      token: task.token,
      description,
      file,
    }).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{translations.topic.submitTask.button}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.topic.submitTask.title}</DialogTitle>
          <DialogDescription>
            {translations.topic.submitTask.description}
          </DialogDescription>
        </DialogHeader>

        {task.status === "notSubmitted" && (
          <Alert variant="destructive">
            <AlertTitle>
              {translations.topic.submitTask.pastDue.title}
            </AlertTitle>
            <AlertDescription>
              {translations.topic.submitTask.pastDue.description.replace(
                "{time}",
                moment(task.dueDate).fromNow(),
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              {translations.topic.submitTask.form.description.label}
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder={
                translations.topic.submitTask.form.description.placeholder
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              {translations.topic.submitTask.form.attachment.label}
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              required
              // accept all document types, images, and compressed files
              accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,.zip"
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                <span>{translations.topic.submitTask.form.submit.loading}</span>
              </>
            ) : (
              translations.topic.submitTask.form.submit.default
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
