import { redirect } from "next/navigation";

import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/common/sidebar";
import { Courses } from "@/components/common/courses";
import { Header } from "@/components/dashboard/header";
import { ProfileTask } from "@/components/dashboard/profile-task";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  const session = await getServerSession(searchParams.data);

  if (!session) {
    return redirect("/start");
  }

  return (
    <HydrateClient>
      <div className="flex gap-x-3 p-6">
        <Sidebar />
        <main className="min-h-screen basis-full">
          <Header />

          <ProfileTask session={session} />

          <Courses />
        </main>
      </div>
    </HydrateClient>
  );
}
