"use client";

import { motion } from "motion/react";
import uniqolor from "uniqolor";

import { ErrorCard } from "@/components/common/error-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { CardTopic } from "@/components/topic/card-topic";
import { AnimatedList } from "@/components/ui/animated-list";
import {
  useCourses,
  useDetailTopic,
  useQueriesDetailCourse,
} from "@/lib/spot/api";
import { cn } from "@/lib/utils";
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
      <div className="pb-2">
        <ScrapingLoadingCard text={"Hunting for recent topics..."} />
      </div>
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
      <AnimatedList storageKey="recent-topics">
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
              courseAcronym={course?.acronym ?? ""}
              courseName={course?.name ?? ""}
              topicId={recentTopic.id ?? ""}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative overflow-hidden rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-zinc-500/10 via-zinc-500/30 to-zinc-500/10",
          )}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-transparent via-zinc-500/10 to-transparent",
          )}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Recent Topics
            </h2>
          </div>

          <div className="relative space-y-4">
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

            {!isFetching &&
              !isError &&
              (detailCourseQueries.length === 0
                ? renderEmptyState()
                : renderRecentTopics())}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RecentTopic({
  courseId,
  topicId,
  color,
  courseAcronym,
  courseName,
  index,
}: {
  courseId: string;
  topicId: string;
  color: string;
  courseAcronym: string;
  courseName: string;
  index: number;
}) {
  const { data: topic } = useDetailTopic(courseId, topicId);

  return (
    <CardTopic
      key={courseId}
      href={`/dashboard/courses/${courseId}/topics/${topicId}?t=${index}`}
      color={color}
      name={`${courseAcronym} - Topic ${index}`}
      description={`${courseName} - ${textContentParser(
        topic?.contents?.[0]?.rawHtml ?? "No description",
      )}`}
      icon="📄"
      time={
        topic?.accessTime
          ? formatAccessTime(topic.accessTime, { relative: true, detail: true })
          : "No access time"
      }
    />
  );
}
