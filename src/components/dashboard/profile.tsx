"use client";

import { useEffect, useState } from "react";
import { FaIdCard } from "react-icons/fa6";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/hooks/use-user-query";

export function Profile() {
  const user = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return loading skeleton during server-side render and initial mount
  if (!mounted) {
    return (
      <div className="space-y-2">
        <div className="pb-2">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            Profile
          </h2>
        </div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Profile
        </h2>
      </div>
      <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {user?.name ?? "Guest User"}
      </p>
      <p className="flex scroll-m-20 items-center text-xl font-semibold tracking-tight">
        <FaIdCard className="mr-2" />
        {user?.nim ?? "No NIM"}
      </p>
    </div>
  );
}
