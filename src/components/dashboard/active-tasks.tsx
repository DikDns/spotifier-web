"use client";

import type { Session } from "@/server/auth";
import { useEffect } from "react";

export function ActiveTasks({ session }: { session: Session }) {
  useEffect(() => {
    console.log("session", session);
  }, [session]);

  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Active Tasks
        </h2>
      </div>
    </div>
  );
}
