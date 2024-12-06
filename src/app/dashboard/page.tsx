import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { ProfileTask } from "@/components/dashboard/profile-task";
import { RecentTopics } from "@/components/topic/recent-topics";

export default function DashboardPage() {
  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Dashboard" />
        <ProfileTask />
        <RecentTopics />
      </main>
    </div>
  );
}
