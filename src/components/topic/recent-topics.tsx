"use client";

import uniqolor from "uniqolor";

import { ErrorCard } from "@/components/common/error-card";
import { MagicCard } from "@/components/common/magic-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { CardTopic } from "@/components/topic/card-topic";
import { AnimatedList } from "@/components/ui/animated-list";
import {
  useCourses,
  useDetailTopic,
  useQueriesDetailCourse,
} from "@/lib/spot/api";
import { formatAccessTime, textContentParser } from "@/lib/utils";

export function RecentTopics() {
  const { data: courses, isFetching, isError, error, refetch } = useCourses();
  const detailCourseQueries = useQueriesDetailCourse(
    courses?.map((course) => course.id) ?? [],
    !!courses,
  );

  const renderLoading = () =>
    isFetching ||
    (detailCourseQueries.some((query) => query.isFetching) && (
      <ScrapingLoadingCard text={"Hunting for recent topics..."} />
    ));

  const renderEmptyState = () => (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        No recent topics found
      </p>
    </div>
  );

  const renderRecentTopics = () => (
    <div className="w-full">
      <AnimatedList storageKey="courses">
        {detailCourseQueries?.map((query) => {
          const course = query.data;
          const color = uniqolor(course?.name ?? "", {
            format: "hex",
          });

          const recentTopic = course?.topics
            .filter((topic) => topic.isAccessable)
            ?.at(-1);

          const recentTopicIndex = course?.topics.findIndex(
            (topic) => topic.id === recentTopic?.id,
          );

          if (!recentTopic || !recentTopicIndex) return null;

          return (
            <RecentTopic
              key={course?.id}
              courseId={course?.id ?? ""}
              topicId={recentTopic.id ?? ""}
              courseAcronym={""}
              color={color.color}
              index={recentTopicIndex + 1}
            />
          );
        })}
      </AnimatedList>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <MagicCard
        className="items-start justify-start p-4"
        childrenClassName="w-full"
      >
        <div className="space-y-2">
          <div className="flex gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Recent Topics
            </h2>
          </div>

          {renderLoading()}

          {isError && (
            <ErrorCard
              title="Failed to load recent topics"
              description={
                error?.message ??
                "There was an error loading your recent topics"
              }
              retry={() => refetch()}
            />
          )}

          {detailCourseQueries.length === 0 && !isError
            ? renderEmptyState()
            : renderRecentTopics()}
        </div>
      </MagicCard>
    </div>
  );
}

function RecentTopic({
  courseId,
  topicId,
  color,
  courseAcronym,
  index,
}: {
  courseId: string;
  topicId: string;
  color: string;
  courseAcronym: string;
  index: number;
}) {
  const { data: topic } = useDetailTopic(courseId, topicId);

  return (
    <CardTopic
      key={courseId}
      href={`/dashboard/courses/${courseId}/topics/${topicId}?t=${index}`}
      color={color}
      name={`${courseAcronym} - Topic ${index}`}
      description={textContentParser(
        topic?.contents?.[0]?.rawHtml ?? "No description",
      )}
      icon="📄"
      time={
        topic?.accessTime
          ? formatAccessTime(topic.accessTime, { relative: true, detail: true })
          : "No access time"
      }
    />
  );
}
