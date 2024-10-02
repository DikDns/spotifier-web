"use client";

import { useCourses } from "@/lib/spot/scraping";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function ActiveTasks() {
  const { data, refetch } = useCourses();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Active Tasks
        </h2>

        <Button onClick={() => refetch()}>Refetch</Button>
      </div>
    </div>
  );
}
