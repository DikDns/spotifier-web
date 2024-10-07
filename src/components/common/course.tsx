"use client";

import { useRouter } from "next/navigation";
import moment from "moment";
import uniqolor from "uniqolor";

import { CourseItem } from "@/components/common/course-item";
import { MagicCard } from "@/components/common/magic-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { useDetailCourse, useDetailTopic } from "@/lib/spot/api";
import { textContentParser } from "@/lib/utils";

export function Course({ courseId }: { courseId: string }) {
  const { data: course, isLoading } = useDetailCourse(courseId);

  const renderLoading = () =>
    isLoading && <ScrapingLoadingCard text={"Scraping SPOT's courses..."} />;

  const renderEmptyState = () => (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        No topics found
      </p>
    </div>
  );

  const renderTopics = () => (
    <div className="w-full">
      <AnimatedList>
        {course?.topics?.map(
          (topic, index) =>
            topic.isAccessable && (
              <DetailTopic
                key={topic.id}
                topicId={topic.id ?? ""}
                courseId={course.id ?? ""}
                index={index}
              />
            ),
        )}
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
          <div className="flex items-center gap-x-2 pb-2">
            <h2 className="scroll-m-20 text-wrap text-3xl font-semibold tracking-tight first:mt-0">
              {course?.name}
            </h2>

            <p className="text-wrap text-sm text-accent-foreground/75">
              {course?.code}
            </p>
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

          {renderLoading()}

          {course?.topics?.length === 0 ? renderEmptyState() : renderTopics()}
        </div>
      </MagicCard>
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

  const { data: topic, isLoading } = useDetailTopic(courseId, topicId);

  if (!topic || isLoading) return null;

  console.log(topic);

  return (
    <CourseItem
      key={topic.id}
      onClick={() => {
        router.push(`/dashboard/courses/${courseId}/topics/${topic.id}`);
      }}
      color={color.color}
      name={`Topic ${index + 1}`}
      description={textContentParser(
        topic.contents?.[0]?.rawHtml ?? "No description",
      )}
      icon={`${index + 1}`}
      time={`${moment(topic.accessTime).format("MMM DD YYYY")}`}
    />
  );
}
