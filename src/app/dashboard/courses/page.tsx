import { Sidebar } from "@/components/common/sidebar";
import { Courses } from "@/components/course/courses";
import { Header } from "@/components/dashboard/header";

export default function CoursesPage() {
  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Mata Kuliah" />

        <Courses />
      </main>
    </div>
  );
}
