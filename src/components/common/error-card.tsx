"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorCardProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  description = "There was an error fetching the data. Please try again later.",
  retry,
}: ErrorCardProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{description}</p>
        {retry && (
          <Button onClick={retry} variant="outline" className="w-fit">
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
