"use client";

import { MagicCard } from "@/components/common/magic-card";
import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { Profile } from "@/components/dashboard/profile";
import { useUserQuery } from "@/lib/hooks/use-user-query";

export function ProfileTask() {
  const { data: user } = useUserQuery();

  return (
    <div className="flex gap-4 p-4">
      <section className="w-1/2">
        <MagicCard
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <Profile
            name={user?.name ?? "Undefined Person"}
            nim={user?.nim ?? "Invalid NIM"}
          />
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
