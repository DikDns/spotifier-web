"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MagicCard } from "@/components/common/magic-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactParser } from "@/lib/react-parser";
import { useDetailCourse, useDetailTopic } from "@/lib/spot/api";
import { type Task } from "@/lib/spot/tasks";
import { YouTubeEmbed } from "@next/third-parties/google";

export function Topic({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const topicNumber = useSearchParams().get("t");
  const { data: course, isLoading: isCourseLoading } =
    useDetailCourse(courseId);
  const { data: topic, isLoading: isTopicLoading } = useDetailTopic(
    courseId,
    topicId,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isCourseLoading || isTopicLoading || !mounted)
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
              <h2 className="scroll-m-20 text-wrap text-3xl font-semibold capitalize tracking-tight first:mt-0">
                {course?.name} - Topic {topicNumber}
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
        <div className="w-full space-y-2">
          <div className="flex gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Resources
            </h2>
          </div>
          {topic?.contents?.length === 0 ? (
            <EmptyMessage message="No resources found" />
          ) : (
            <DetailResources resources={topic?.contents ?? []} />
          )}
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
            <EmptyMessage message="No tasks found" />
          ) : (
            <DetailTasks tasks={topic?.tasks ?? []} />
          )}
        </div>
      </MagicCard>
    </div>
  );
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        {message}
      </p>
    </div>
  );
}

function DetailTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="w-full">
      {tasks?.length && (
        <AnimatedList storageKey={`tasks`}>
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
      <h4 className="scroll-m-20 text-wrap text-xl font-semibold tracking-tight first:mt-0">
        {task?.title}
      </h4>

      <div className="text-wrap text-accent-foreground/75">
        {task.description}
      </div>
    </div>
  );
}

function DetailResources({
  resources,
}: {
  resources: {
    id: string;
    youtubeId: string | undefined;
    rawHtml: string;
  }[];
}) {
  return resources.map((resource) => {
    return (
      <div
        key={resource.id}
        className="prose dark:prose-invert w-full max-w-full text-wrap pb-6"
      >
        {ReactParser(resource.rawHtml)}

        {resource.youtubeId && (
          <YouTubeEmbed videoid={resource.youtubeId} width={512} height={288} />
        )}
      </div>
    );
  });
}
