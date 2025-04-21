"use client";

import uniqolor from "uniqolor";

import { CardTopic } from "@/components/topic/card-topic";
import { type Topic } from "@/lib/spot";
import { formatAccessTime, textContentParser } from "@/lib/utils";

export function DetailTopic({
  courseId,
  topic,
  index,
}: {
  courseId: string;
  topic: Topic;
  index: number;
}) {
  const color = uniqolor(courseId, {
    format: "hex",
  });

  return (
    <CardTopic
      key={topic?.id}
      href={`/dashboard/courses/${courseId}/topics/${topic?.id}?t=${index + 1}`}
      disabled={!topic?.id}
      color={color.color}
      name={`Pertemuan ${index + 1}`}
      description={textContentParser(
        topic?.contents?.[0]?.rawHtml ?? "Tidak ada deskripsi",
      )}
      icon={`${index + 1}`}
      time={
        topic?.accessTime
          ? formatAccessTime(topic.accessTime)
          : "Tidak ada waktu akses"
      }
    />
  );
}
