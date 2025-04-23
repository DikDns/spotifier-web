"use client";

import { useParams } from "next/navigation";

import { Sidebar } from "@/components/common/sidebar";
import { DetailCourse } from "@/components/course/detail-course";
import { Header } from "@/components/dashboard/header";
import { useLocale } from "@/lib/locale-utils";

export default function CoursePage() {
  const { translations } = useLocale();
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title={translations.dashboard.courses} />

        <DetailCourse courseId={courseId} />
      </main>
    </div>
  );
}
