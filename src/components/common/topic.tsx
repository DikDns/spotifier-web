"use client";

import { useRouter } from "next/navigation";

import { MagicCard } from "@/components/common/magic-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetailCourse, useDetailTopic } from "@/lib/spot/api";
import { type Task } from "@/lib/spot/tasks";

export function Topic({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) {
  const { data: course, isLoading: isCourseLoading } =
    useDetailCourse(courseId);
  const { data: topic, isLoading: isTopicLoading } = useDetailTopic(
    courseId,
    topicId,
  );

  if (isCourseLoading || isTopicLoading)
    return <Skeleton className="h-4 w-32" />;

  return (
    <div className="flex flex-col gap-4 p-4">
      <MagicCard
        className="items-start justify-start p-4"
        childrenClassName="w-full"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-x-2">
              <h2 className="scroll-m-20 text-wrap text-3xl font-semibold tracking-tight first:mt-0">
                {course?.name}
              </h2>
            </div>
          </div>
          <p className="text-wrap text-sm text-accent-foreground/75">
            {topic?.description}
          </p>
        </div>
      </MagicCard>

      <MagicCard
        className="items-start justify-start p-4"
        childrenClassName="w-full"
      >
        <div className="space-y-2">
          <div className="flex gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Tasks
            </h2>
          </div>
          {topic?.tasks?.length === 0 ? (
            <EmptyTasks />
          ) : (
            <DetailTasks tasks={topic?.tasks ?? []} />
          )}
        </div>
      </MagicCard>
    </div>
  );
}

function EmptyTasks() {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        No tasks found
      </p>
    </div>
  );
}

function DetailTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="w-full">
      {tasks?.length && (
        <AnimatedList>
          {tasks?.map((task) => <DetailTask key={task?.id} {...task} />)}
        </AnimatedList>
      )}
    </div>
  );
}

function DetailTask(task: Task) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
        {task?.title}
      </h4>

      <div></div>
    </div>
  );
}
