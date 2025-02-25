"use client";

import { useSearchParams } from "next/navigation";

import { ErrorCard } from "@/components/common/error-card";
import { MagicCard } from "@/components/common/magic-card";
import { OpenInSpot } from "@/components/common/open-in-spot";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { DetailResources } from "@/components/topic/detail-resources";
import { DetailTask } from "@/components/topic/detail-task";
import { AnimatedList } from "@/components/ui/animated-list";
import { useDetailCourse, useDetailTopic } from "@/lib/spot/api";

export function Topic({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) {
  const topicNumber = useSearchParams().get("t");
  const {
    data: course,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
    refetch: refetchCourse,
  } = useDetailCourse(courseId);
  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
    error: topicError,
    refetch: refetchTopic,
  } = useDetailTopic(courseId, topicId, !!course);

  if (isCourseError) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <ErrorCard
          title="Failed to load course"
          description={
            courseError?.message ?? "There was an error loading the course"
          }
          retry={() => refetchCourse()}
        />
      </div>
    );
  }

  if (isTopicError) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <ErrorCard
          title="Failed to load topic"
          description={
            topicError?.message ?? "There was an error loading the topic"
          }
          retry={() => refetchTopic()}
        />
      </div>
    );
  }

  const renderLoading = () => {
    if (isCourseLoading || isTopicLoading)
      return (
        <div className="w-full py-2">
          <ScrapingLoadingCard
            text={
              isCourseLoading ? "Scraping course..." : "Extracting topic..."
            }
          />
        </div>
      );
  };

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

          {renderLoading()}
        </div>
      </MagicCard>

      <MagicCard
        className="items-start justify-start p-4"
        childrenClassName="w-full"
      >
        <div className="w-full space-y-2">
          <div className="flex justify-between gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Resources
            </h2>

            <OpenInSpot href={`/mhs/materi/${courseId}/${topicId}`} />
          </div>

          {topic?.contents?.length === 0 ? (
            <EmptyMessage message="Resources not found, check again later! 😞" />
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
          <div className="flex justify-between gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Tasks
            </h2>

            <OpenInSpot href={`/mhs/tugas/${courseId}/${topicId}`} />
          </div>

          {topic?.tasks?.length === 0 ? (
            <EmptyMessage message="No tasks for this topic, hooray! 😁" />
          ) : (
            <div className="w-full">
              {topic?.tasks?.length && (
                <AnimatedList storageKey={`tasks`} className="space-y-6">
                  {topic?.tasks?.map((task, index) => (
                    <DetailTask key={task?.id} task={task} index={index} />
                  ))}
                </AnimatedList>
              )}
            </div>
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
