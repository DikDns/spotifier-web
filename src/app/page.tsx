"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUserQuery } from "@/lib/hooks/use-user-query";

export default function HomePage() {
  const { data: user } = useUserQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <Link href="/start">
        {user ? <Button>Go to Dashboard</Button> : <Button>Start</Button>}
      </Link>
    </main>
  );
}
