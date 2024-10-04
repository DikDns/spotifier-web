"use client";

import type { Session } from "@/server/auth";
import { Profile } from "@/components/dashboard/profile";
import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { MagicCard } from "@/components/common/magic-card";

export function ProfileTask({ session }: { session: Session }) {
  const user = session.user;

  return (
    <div className="flex gap-4 p-4">
      <section className="w-1/2">
        <MagicCard
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <Profile
            name={user.name ?? "Undefined Person"}
            nim={user.nim ?? "Invalid NIM"}
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
