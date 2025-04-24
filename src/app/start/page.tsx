"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

function CallbackUrlButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const spotLoginUrl = new URL("https://spot.upi.edu/mhs");

  if (callbackUrl) {
    spotLoginUrl.searchParams.set("callbackUrl", callbackUrl);
  }

  return (
    <Link href={spotLoginUrl.toString()}>
      <Button>Login with SPOT</Button>
    </Link>
  );
}

export default function StartPage() {
  return (
    <Suspense>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
        <h1 className="mb-2 text-3xl font-bold">Welcome to SPOTifier</h1>
        <section className="flex w-full max-w-xl flex-col gap-4 rounded-lg border border-zinc-200 bg-white/80 p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
          <h2 className="mb-2 text-xl font-semibold">Getting Started</h2>
          <ol className="list-inside list-decimal space-y-2 text-base">
            <li>
              <span className="font-medium">Download and Install:</span> Unduh
              dan pasang ekstensi SPOTifier untuk browser Anda:
              <ul className="ml-5 mt-1 list-inside list-disc space-y-1 text-sm">
                <li>
                  <a
                    href="https://github.com/DikDns/spotifier-chrome-extension/releases/latest"
                    className="text-blue-500"
                  >
                    Chrome Extension
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/DikDns/spotifier-firefox-extension/releases/latest"
                    className="text-blue-500"
                  >
                    Firefox Extension
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Open SPOT-UPI:</span> Buka SPOT-UPI
              di browser Anda dan klik tombol{" "}
              <span className="font-semibold">Go to SPOTifier</span> untuk
              memulai.
            </li>
          </ol>
          <div className="mt-4 flex justify-center">
            <CallbackUrlButton />
          </div>
        </section>
      </main>
    </Suspense>
  );
}
