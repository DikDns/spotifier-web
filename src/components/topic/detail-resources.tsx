import { ReactParser } from "@/lib/react-parser";
import { YouTubeEmbed } from "@next/third-parties/google";

export function DetailResources({
  resources,
}: {
  resources: {
    id: string;
    youtubeId: string | undefined;
    rawHtml: string;
  }[];
}) {
  return resources.map((resource) => {
    return (
      <div
        key={resource.id}
        className="prose w-full max-w-full text-wrap pb-6 dark:prose-invert"
      >
        {ReactParser(resource.rawHtml)}

        {resource.youtubeId && (
          <YouTubeEmbed videoid={resource.youtubeId} width={512} height={288} />
        )}
      </div>
    );
  });
}
