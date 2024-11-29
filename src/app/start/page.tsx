"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function StartPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const spotLoginUrl = new URL("https://spot.upi.edu/mhs");
  if (callbackUrl) {
    spotLoginUrl.searchParams.set("callbackUrl", callbackUrl);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Start</h1>
      <Link href={spotLoginUrl.toString()}>
        <Button>Login with SPOT</Button>
      </Link>
    </main>
  );
}
