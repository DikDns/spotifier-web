import { redirect } from "next/navigation";

import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { ProfileTask } from "@/components/dashboard/profile-task";
import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function DashboardPage(
  props: {
    searchParams: Promise<{ data?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(searchParams.data);

  if (!session?.session) {
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
          <Header title="Dashboard" />

          <ProfileTask session={session} />

          <Courses />
        </main>
      </div>
    </HydrateClient>
  );
}
