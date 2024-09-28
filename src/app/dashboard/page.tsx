import { HydrateClient } from "@/trpc/server";
import { getServerSession } from "@/server/auth";
import { redirect } from "next/navigation";

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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <h3 className="text-xl font-bold">Welcome, {session.user.name}</h3>
        <p>{session.user.nim}</p>
        <p>You are logged in with SPOT. You can now use the app.</p>
      </main>
    </HydrateClient>
  );
}
