"use client";

import type { Session } from "@/server/auth";

export function ActiveTasks({ session }: { session: Session }) {
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
