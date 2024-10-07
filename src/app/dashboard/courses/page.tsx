import { redirect } from "next/navigation";

import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { getServerSession } from "@/server/auth";

export default async function CoursesPage() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/start");
  }

  if (session.status === "error") {
    return redirect("/start?errorMsg=" + session.message);
  }

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
