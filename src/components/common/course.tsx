"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import moment from "moment";
import uniqolor from "uniqolor";

import { CourseItem } from "@/components/common/course-item";
import { MagicCard } from "@/components/common/magic-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetailCourse, useDetailTopic } from "@/lib/spot/api";
import { useTopics } from "@/lib/spot/api/use-topics";
import { textContentParser } from "@/lib/utils";

export function Course({ courseId }: { courseId: string }) {
  const { data: course, isLoading } = useDetailCourse(courseId);

  if (isLoading) return <Skeleton className="h-4 w-32" />;

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
  const { data: topics, isLoading: isTopicsLoading } = useTopics(
    courseId,
    topicIds,
  );

  return (
    <div className="w-full">
      {isTopicsLoading && (
        <ScrapingLoadingCard text={"Scraping SPOT's topics..."} />
      )}

      {topics?.length && (
        <AnimatedList>
          {topics?.map((topic, index) => (
            <DetailTopic
              key={topic?.id}
              topicId={topic?.id ?? ""}
              courseId={courseId}
              index={index}
            />
          ))}
        </AnimatedList>
      )}
    </div>
  );
}

function DetailTopic({
  topicId,
  courseId,
  index,
}: {
  topicId: string;
  courseId: string;
  index: number;
}) {
  const color = uniqolor(courseId, {
    format: "hex",
  });

  const router = useRouter();
  const { data: topic } = useDetailTopic(courseId, topicId);

  return (
    <CourseItem
      key={topic?.id}
      onClick={() => {
        router.push(`/dashboard/courses/${courseId}/topics/${topic?.id}`);
      }}
      color={color.color}
      name={`Topic ${index + 1}`}
      description={textContentParser(
        topic?.contents?.[0]?.rawHtml ?? "No description",
      )}
      icon={`${index + 1}`}
      time={`${moment(topic?.accessTime).format("MMM DD YYYY")}`}
    />
  );
}
