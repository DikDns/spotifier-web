"use client";

import { Sidebar } from "@/components/common/sidebar";
import { Courses } from "@/components/course/courses";
import { Header } from "@/components/dashboard/header";
import { useLocale } from "@/lib/locale-utils";

export default function CoursesPage() {
  const { translations } = useLocale();
  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title={translations.dashboard.courses} />

        <Courses />
      </main>
    </div>
  );
}
