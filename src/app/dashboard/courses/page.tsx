import { redirect } from "next/navigation";

import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/common/sidebar";
import { Courses } from "@/components/common/courses";

export default async function CoursesPage() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/start");
  }

  return (
    <HydrateClient>
      <div className="flex gap-x-3 p-6">
        <Sidebar />
        <main className="min-h-screen basis-full">
          <Courses />
        </main>
      </div>
    </HydrateClient>
  );
}
