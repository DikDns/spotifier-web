"use client";

import { useEffect, useState } from "react";

import { Courses } from "@/components/common/courses";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { ProfileTask } from "@/components/dashboard/profile-task";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Dashboard" />
        <ProfileTask />
        <Courses />
      </main>
    </div>
  );
}
