import { Course } from "@/components/common/course";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { HydrateClient } from "@/trpc/server";

export default async function CoursePage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const params = await props.params;
  const { courseId } = params;

  return (
    <HydrateClient>
      <div className="flex gap-x-3 p-6">
        <Sidebar />
        <main className="min-h-screen basis-full">
          <Header title="Course" />

          <Course courseId={courseId} />
        </main>
      </div>
    </HydrateClient>
  );
}
