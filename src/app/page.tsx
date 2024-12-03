import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
      <Link href="/start">
        <Button>Start</Button>
      </Link>
    </main>
  );
}
