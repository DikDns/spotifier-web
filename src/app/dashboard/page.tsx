import { redirect } from "next/navigation";

import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

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
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen w-full">
          <Header />

          <section>
            {/* <h3 className="text-xl font-bold">Welcome, {session.user.name}</h3>
            <p>{session.user.nim}</p>
            <p>You are logged in with SPOT. You can now use the app.</p> */}
          </section>
        </main>
      </div>
    </HydrateClient>
  );
}
