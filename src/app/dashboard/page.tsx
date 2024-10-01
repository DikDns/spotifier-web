import { redirect } from "next/navigation";

import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Main } from "@/components/dashboard/main";

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

          <Main session={session} />
        </main>
      </div>
    </HydrateClient>
  );
}
