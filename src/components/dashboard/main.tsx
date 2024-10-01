"use client";

import type { Session } from "@/server/auth";
import { Profile } from "@/components/dashboard/profile";
import { ActiveTasks } from "@/components/dashboard/active-tasks";
import { Card } from "@/components/dashboard/card";

export function Main({ session }: { session: Session }) {
  const user = session.user;

  return (
    <div className="flex gap-4 p-4">
      <section className="flex-1">
        <Card className="items-start justify-start p-4">
          <Profile
            name={user.name ?? "Undefined Person"}
            nim={user.nim ?? "Invalid NIM"}
          />
        </Card>
      </section>

      <section className="flex-1">
        <Card className="items-start justify-start p-4">
          <ActiveTasks session={session} />
        </Card>
      </section>
    </div>
  );
}
