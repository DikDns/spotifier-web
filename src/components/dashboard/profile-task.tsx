"use client";

import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { Profile } from "@/components/dashboard/profile";

export function ProfileTask() {
  return (
    <div className="flex gap-4 p-4 pb-0">
      <section className="w-7/12">
        <Profile />
      </section>

      <section className="w-5/12">
        <PendingTasks />
      </section>
    </div>
  );
}
