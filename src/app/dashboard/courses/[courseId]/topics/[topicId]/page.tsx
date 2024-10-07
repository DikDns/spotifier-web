import { redirect } from "next/navigation";

import { Sidebar } from "@/components/common/sidebar";
import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function TopicPage({
  params,
}: {
  params: { courseId: string; topicId: string };
}) {
  const session = await getServerSession();
  const { courseId, topicId } = params;

  if (!session) {
    return redirect("/start");
  }

  return (
    <HydrateClient>
      <div className="flex gap-x-3 p-6">
        <Sidebar />
        <main className="min-h-screen basis-full"></main>
      </div>
    </HydrateClient>
  );
}
