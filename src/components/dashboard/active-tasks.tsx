"use client";

import { getCourses } from "@/lib/scraping";
import { Button } from "@/components/ui/button";

export function ActiveTasks() {
  const fetchData = async () => {
    const courses = await getCourses();
    console.log(courses);
  };

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Active Tasks
        </h2>

        <Button onClick={() => void fetchData()}>Refetch</Button>
      </div>
    </div>
  );
}
