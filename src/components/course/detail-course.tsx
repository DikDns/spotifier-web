"use client";

import Link from "next/link";

import { ErrorCard } from "@/components/common/error-card";
import { MagicCard } from "@/components/common/magic-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { DetailTopic } from "@/components/topic/detail-topic";
import { AnimatedList } from "@/components/ui/animated-list";
import { buttonVariants } from "@/components/ui/button";
import { useDetailCourse } from "@/lib/spot/api";
import { useTopics } from "@/lib/spot/api/use-topics";

export function DetailCourse({ courseId }: { courseId: string }) {
  const { data: course, isError, error, refetch } = useDetailCourse(courseId);

  if (isError) {
    return (
      <ErrorCard
        title="Failed to load course details"
        description={
          error?.message || "There was an error loading the course details"
        }
        retry={() => refetch()}
      />
    );
  }

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

              <p className="text-wrap text-sm text-accent-foreground/75">
                {course?.code}
              </p>
            </div>

            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`https://spot.upi.edu${course?.rps.href}`}
              target="_blank"
            >
              RPS
            </Link>
          </div>
          <p className="text-wrap text-sm text-accent-foreground/75">
            {course?.lecturer}
          </p>
          <p className="text-wrap text-sm text-accent-foreground/75">
            {course?.description}
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
              Topics
            </h2>
          </div>
          {course?.topics?.length === 0 ? (
            <EmptyTopics />
          ) : (
            <DetailTopics
              courseId={course?.id ?? ""}
              topicIds={
                course?.topics
                  ?.filter((topic) => topic.isAccessable)
                  .map((topic) => topic.id ?? "") ?? []
              }
            />
          )}
        </div>
      </MagicCard>
    </div>
  );
}

function EmptyTopics() {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        No topics found
      </p>
    </div>
  );
}

function DetailTopics({
  courseId,
  topicIds,
}: {
  courseId: string;
  topicIds: string[];
}) {
  const { data: topics, isFetching: isTopicsLoading } = useTopics(
    courseId,
    topicIds,
  );

  return (
    <div className="w-full space-y-4">
      {isTopicsLoading && (
        <ScrapingLoadingCard text={"Scraping SPOT's topics..."} />
      )}

      {topics?.length && (
        <AnimatedList storageKey={`topics-${courseId}`}>
          {topics?.map((topic, index) => (
            <DetailTopic
              courseId={courseId}
              key={topic?.id}
              index={index}
              topic={topic}
            />
          ))}
        </AnimatedList>
      )}
    </div>
  );
}
