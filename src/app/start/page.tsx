import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function StartPage() {
  const session = await getServerSession();

  console.log("Start\n", session);

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Start</h1>
        <Link href="https://spot.upi.edu/mhs">
          <Button>Login with SPOT</Button>
        </Link>
      </main>
    </HydrateClient>
  );
}
