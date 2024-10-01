"use client";

import { FaIdCard } from "react-icons/fa6";

export function Profile({ name, nim }: { name: string; nim: string }) {
  return (
    <div className="space-y-2">
      <div className="pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Profile
        </h2>
      </div>
      <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {name}
      </p>
      <p className="flex scroll-m-20 items-center text-xl font-semibold tracking-tight">
        <FaIdCard className="mr-2" />
        {nim}
      </p>
    </div>
  );
}
