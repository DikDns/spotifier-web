import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function CoursesPage() {
  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Courses" />

        <Courses />
      </main>
    </div>
  );
}
