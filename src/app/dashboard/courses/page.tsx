import { redirect } from "next/navigation";

import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { getServerSession } from "@/server/auth";

export default async function CoursesPage() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/start");
  }

  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Courses />
      </main>
    </div>
  );
}
