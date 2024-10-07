import { redirect } from "next/navigation";

import { Course } from "@/components/common/course";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession();
  const { courseId } = params;

  if (!session) {
    return redirect("/start");
  }

  if (session.status === "error") {
    return redirect("/start?errorMsg=" + session.message);
  }

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
