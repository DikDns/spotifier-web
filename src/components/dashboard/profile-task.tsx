"use client";

import { MagicCard } from "@/components/common/magic-card";
import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { Profile } from "@/components/dashboard/profile";

export function ProfileTask() {
  return (
    <div className="flex gap-4 p-4">
      <section className="w-1/2">
        <MagicCard
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <Profile />
        </MagicCard>
      </section>

      <section className="w-1/2">
        <MagicCard
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <PendingTasks />
        </MagicCard>
      </section>
    </div>
  );
}
