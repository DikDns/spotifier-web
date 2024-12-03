import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/dashboard/header";
import { Topic } from "@/components/topic/topic";

export default async function TopicPage(props: {
  params: Promise<{ courseId: string; topicId: string }>;
}) {
  const params = await props.params;
  const { courseId, topicId } = params;

  return (
    <div className="flex gap-x-3 p-6">
      <Sidebar />
      <main className="min-h-screen basis-full">
        <Header title="Topic" />

        <Topic courseId={courseId} topicId={topicId} />
      </main>
    </div>
  );
}
