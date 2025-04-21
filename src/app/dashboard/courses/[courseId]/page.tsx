import { Sidebar } from "@/components/common/sidebar";
import { DetailCourse } from "@/components/course/detail-course";
import { Header } from "@/components/dashboard/header";

export default async function CoursePage(props: {
  params: Promise<{ courseId: string }>;
}) {
  const params = await props.params;
  const { courseId } = params;

  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Mata Kuliah" />

        <DetailCourse courseId={courseId} />
      </main>
    </div>
  );
}
