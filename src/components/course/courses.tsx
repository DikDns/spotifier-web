"use client";

import uniqolor from "uniqolor";

import { ErrorCard } from "@/components/common/error-card";
import { MagicCard } from "@/components/common/magic-card";
import { ScrapingLoadingCard } from "@/components/common/scraping-loading-card";
import { CardCourse } from "@/components/course/card-course";
import { AnimatedList } from "@/components/ui/animated-list";
import { useCourses } from "@/lib/spot/api";

export function Courses() {
  const { data: courses, isFetching, isError, error, refetch } = useCourses();

  const renderLoading = () =>
    isFetching && (
      <div className="pb-2">
        <ScrapingLoadingCard text={"Scraping SPOT's courses..."} />
      </div>
    );

  const renderEmptyState = () => (
    <div className="flex min-h-32 items-center justify-center">
      <p className="font-medium text-accent-foreground/75 md:text-lg">
        No courses found
      </p>
    </div>
  );

  const renderTasks = () => (
    <div className="w-full">
      <AnimatedList storageKey="courses">
        {courses?.map((course) => {
          const color = uniqolor(course.name, {
            format: "hex",
          });

          return (
            <CardCourse
              key={course.id}
              href={`/dashboard/courses/${course.id}`}
              color={color.color}
              name={course.name}
              description={course.lecturer}
              icon="📄"
              time={course.code}
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
              Courses
            </h2>
          </div>

          {renderLoading()}

          {isError && (
            <ErrorCard
              title="Failed to load courses"
              description={
                error?.message || "There was an error loading your courses"
              }
              retry={() => refetch()}
            />
          )}

          {courses?.length === 0 ? renderEmptyState() : renderTasks()}
        </div>
      </MagicCard>
    </div>
  );
}
