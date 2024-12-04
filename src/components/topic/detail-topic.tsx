"use client";

import moment from "moment";
import uniqolor from "uniqolor";

import { CardTopic } from "@/components/topic/card-topic";
import { type Topic } from "@/lib/spot";
import { textContentParser } from "@/lib/utils";

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
      name={`Topic ${index + 1}`}
      description={textContentParser(
        topic?.contents?.[0]?.rawHtml ?? "No description",
      )}
      icon={`${index + 1}`}
      time={`${moment(topic?.accessTime).format("MMM DD YYYY")}`}
    />
  );
}
