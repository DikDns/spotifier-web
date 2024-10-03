"use client";

import type { Session } from "@/server/auth";
import { Profile } from "@/components/dashboard/profile";
import { PendingTasks } from "@/components/dashboard/pending-tasks";
import { Card } from "@/components/dashboard/card";

export function Main({ session }: { session: Session }) {
  const user = session.user;

  return (
    <div className="flex gap-4 p-4">
      <section className="basis-1/2">
        <Card
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <Profile
            name={user.name ?? "Undefined Person"}
            nim={user.nim ?? "Invalid NIM"}
          />
        </Card>
      </section>

      <section className="basis-1/2">
        <Card
          className="items-start justify-start p-4"
          childrenClassName="w-full"
        >
          <PendingTasks />
        </Card>
      </section>
    </div>
  );
}
