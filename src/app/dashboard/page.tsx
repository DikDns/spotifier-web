import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { ProfileTask } from "@/components/dashboard/profile-task";
import { HydrateClient } from "@/trpc/server";

export default async function DashboardPage() {
  return (
    <HydrateClient>
      <div className="flex gap-x-3 p-6">
        <Sidebar />
        <main className="min-h-screen basis-full">
          <Header title="Dashboard" />
          <ProfileTask />
          <Courses />
        </main>
      </div>
    </HydrateClient>
  );
}
