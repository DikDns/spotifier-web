"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTimeout } from "@/lib/fetch-timeout";
import { env } from "@/env";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export async function getCourses() {
  try {
    const response = await fetch(BASE_URL + "/mhs");

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const rawHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");
    const tbody = doc.querySelector("table tbody");

    if (!tbody) {
      throw new Error("Element tbody not found from spot/mhs");
    }

    const tr = tbody.querySelectorAll("tr");

    const courses = [];

    for (const row of tr) {
      const td = row.querySelectorAll("td");

      const href = td[1]?.querySelector("a")?.href;

      if (!href) {
        continue;
      }

      // Extract only the path from the href
      const path = new URL(href).pathname;

      if (!td[0] || !td[1] || !td[2] || !td[3] || !td[4]) {
        continue;
      }

      const id = path.split("/").pop();

      const course = {
        id,
        code: td[0]?.textContent ?? "",
        name: td[1]?.textContent ?? "",
        credits: Number(td[2]?.textContent) || 0,
        lecturer: td[3]?.textContent ?? "",
        academicYear: td[4]?.textContent ?? "",
        href: path,
      };

      courses.push(course);
    }

    return courses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDetailCourse(href: string) {
  try {
    const response = await fetch(BASE_URL + href);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const rawHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    const courseTitle = doc
      .querySelector(".media.bg-primary .media-body")
      ?.textContent?.trim();
    const courseClass = courseTitle?.split(" : ")[1]?.trim();
    const courseWarningElement = doc.querySelector(".white-box.bg-warning");

    if (courseWarningElement) {
      return {
        class: courseClass,
        isSetByLecturer: false,
        rps: {
          id: null,
          href: null,
        },
        description: "Course not yet set by lecturer",
        topics: [],
      };
    }

    const courseDescription = doc
      .querySelector(".white-box p:nth-child(1)")
      ?.textContent?.trim();
    const courseRPS = doc.querySelector(".white-box p:nth-child(2)");
    const courseRPSHref = courseRPS?.querySelector("a")?.href;
    const courseRPSPath = courseRPSHref
      ? new URL(courseRPSHref).pathname
      : null;
    const courseRPSId = courseRPSPath ? courseRPSPath.split("/").pop() : null;

    const courseTopics = doc.querySelectorAll(".container-fluid .block4");

    const topics = Array.from(courseTopics).map((topic) => {
      const panelBodyChildren = topic.querySelectorAll(".panel-body div div");

      const topicAnchorElement = panelBodyChildren[1]?.querySelector("a");
      const topicAccessTimeStringRaw = panelBodyChildren[0]?.textContent
        ?.replace("Waktu Akses: ", "")
        ?.trim();

      // Convert the date format from DD:MM:YYYY hh:mm:ss to YYYY-MM-DDTHH:mm:ss
      const [day, month, yearTime] = topicAccessTimeStringRaw?.split("-") ?? [];
      const [year, time] = yearTime?.split(" ") ?? [];
      const topicAccessTimeString = `${year}-${month}-${day}T${time}`;
      const topicAccessTime = topicAccessTimeString
        ? new Date(topicAccessTimeString)
        : null;

      if (topicAnchorElement?.classList.contains("btn-danger")) {
        return {
          id: null,
          accessTime: topicAccessTime,
          isAccessable: false,
          href: null,
        };
      }

      const topicHref = topicAnchorElement?.href
        ? new URL(topicAnchorElement.href).pathname
        : null;

      const topicId = topicHref ? topicHref.split("/").pop() : null;

      return {
        id: topicId,
        accessTime: topicAccessTime,
        isAccessable: true,
        href: topicHref,
      };
    });

    return {
      class: courseClass,
      isSetByLecturer: true,
      rps: {
        id: courseRPSId,
        href: courseRPSPath,
      },
      description: courseDescription,
      topics: topics,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function getDetailTopic(href: string, course?: string) {
  try {
    const response = await fetch(BASE_URL + href);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const rawHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    const tabContent = doc.querySelector(".tab-content");

    const dashboard = tabContent?.querySelector("#dashboard div");
    const topicDescription = dashboard?.textContent?.trim();

    const subject = tabContent?.querySelector("#materi");
    const subjectRows = subject?.querySelectorAll(".row .col-lg-12");

    console.log("\n[]======================[]");
    console.log("Course: ", course);
    console.log("\n[]======================[]\n");

    const mappedSugjectRows: {
      id: string;
      youtubeId: string | undefined;
      rawHtml: string;
    }[] = [];
    if (subjectRows) {
      let index = 0;
      for (const subjectRow of subjectRows) {
        const children = subjectRow.children;
        const subjectRowObject: {
          id: string;
          youtubeId: string | undefined;
          rawHtml: string;
        } = {
          id: index.toString(),
          youtubeId: undefined,
          rawHtml: "",
        };
        index++;

        for (const child of children) {
          const grandChildren = child.children;
          if (child.tagName === "P" && grandChildren[0]?.tagName === "BUTTON") {
            console.log("\n[]======================[]");
            console.log("CHILD THAT SHOULD REMOVED: ", child);
            console.log("\n[]======================[]\n");
            continue;
          }

          if (child.classList.contains("modal")) {
            const iframe = child.querySelector("iframe");
            const iframeSrc = iframe?.src;
            console.log("\n[]======================[]");
            console.log("iframe: ", child);
            console.log("\n[]======================[]\n");
            subjectRowObject.youtubeId = iframeSrc?.split("embed/").pop();
            continue;
          }

          console.log("\n[]======================[]");
          console.log("Child: ", child);
          console.log("\n[]======================[]\n");

          subjectRowObject.rawHtml += child.outerHTML;
        }

        mappedSugjectRows.push(subjectRowObject);
      }
    }

    console.log("\n[]======================[]");
    console.log("mappedSugjectRows: ", mappedSugjectRows);
    console.log("\n[]======================[]\n");

    return {
      description: topicDescription,
      subjects: mappedSugjectRows,
    };
  } catch (error) {
    console.error(error);
  }
}

export const useCourses = () => {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const courses = await getCourses();
      const detailCoursePromises = Promise.all(
        courses.map(async (course) => {
          const detailCourse = await getDetailCourse(course.href);
          const detailTopicsPromises = detailCourse?.topics?.map(
            async (topic) => {
              if (!topic.isAccessable) return topic;
              if (!topic.href) return topic;

              const detailTopic = await getDetailTopic(topic.href, course.name);

              return {
                ...topic,
                ...detailTopic,
              };
            },
          );
          const detailTopics = await Promise.all(detailTopicsPromises ?? []);

          return {
            ...course,
            ...detailCourse,
            topics: detailTopics,
          };
        }),
      );
      return detailCoursePromises;
    },
  });

  return query;
};

export async function getTasks() {
  try {
    const response = await fetchTimeout(BASE_URL);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const rawHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");
    const tbody = doc.querySelector("table tbody");

    if (!tbody) {
      throw new Error("Element tbody not found from spot/mhs");
    }

    return [];
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to fetch tasks",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
