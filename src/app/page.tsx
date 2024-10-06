import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getServerSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Home</h1>
        <Link href="/start">
          {session ? <Button>Go to Dashboard</Button> : <Button>Start</Button>}
        </Link>
      </main>
    </HydrateClient>
  );
}
