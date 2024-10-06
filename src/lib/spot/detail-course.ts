"use client";

import { env } from "@/env";
import { type Course, getCourses } from "@/lib/spot/courses";
import { dateParser } from "@/lib/spot/date-parser";
import { domParser } from "@/lib/spot/dom-parser";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export async function getDetailCourse(id: string) {
  try {
    const coursesPromise = getCourses();
    const detailCourseHtmlPromise = fetchDetailCourse(id);

    const [courses, rawHtml] = await Promise.all([
      coursesPromise,
      detailCourseHtmlPromise,
    ]);
    const currentCourse = courses.find((course) => course.id === id);

    if (!currentCourse) {
      throw new Error("Course not found");
    }

    return parseCourseDetails(rawHtml, currentCourse);
  } catch (error) {
    console.error(error);
  }
}

async function fetchDetailCourse(id: string) {
  const path = "/mhs/dashboard/" + id;
  const response = await fetch(BASE_URL + path);

  if (!response.ok) {
    throw new Error("SPOT might have some issues, please try again later");
  }

  if (response.status === 302) {
    throw new Error("SPOT session expired, please login again");
  }

  return response.text();
}

function parseCourseDetails(rawHtml: string, currentCourse: Course) {
  const doc = domParser(rawHtml);
  const courseTitle = doc
    .querySelector(".media.bg-primary .media-body")
    ?.textContent?.trim();
  const courseClass = courseTitle?.split(" : ")[1]?.trim();
  const courseWarningElement = doc.querySelector(".white-box.bg-warning");

  if (courseWarningElement) {
    return {
      ...currentCourse,
      class: courseClass,
      isSetByLecturer: false,
      rps: { id: null, href: null },
      description: "Course not yet set by lecturer",
      topics: [],
    };
  }

  const courseDescription = doc
    .querySelector(".white-box p:nth-child(1)")
    ?.textContent?.trim();
  const courseRPS = doc.querySelector(".white-box p:nth-child(2)");
  const courseRPSHref = courseRPS?.querySelector("a")?.href;
  const courseRPSPath = courseRPSHref ? new URL(courseRPSHref).pathname : null;
  const courseRPSId = courseRPSPath ? courseRPSPath.split("/").pop() : null;

  const topics = parseCourseTopics(doc);

  return {
    ...currentCourse,
    class: courseClass,
    isSetByLecturer: true,
    rps: { id: courseRPSId, href: courseRPSPath },
    description: courseDescription,
    topics: topics,
  };
}

function parseCourseTopics(doc: Document) {
  const courseTopics = doc.querySelectorAll(".container-fluid .block4");
  let currentTopicId = 0;

  return Array.from(courseTopics).map((topic, index) => {
    const panelBodyChildren = topic.querySelectorAll(".panel-body div div");
    const topicAnchorElement = panelBodyChildren[1]?.querySelector("a");
    const topicAccessTimeStringRaw = panelBodyChildren[0]?.textContent
      ?.replace("Waktu Akses: ", "")
      ?.trim();
    const topicAccessTime = topicAccessTimeStringRaw
      ? dateParser(topicAccessTimeStringRaw)
      : null;

    if (topicAnchorElement?.classList.contains("btn-danger")) {
      return {
        id: (currentTopicId + index).toString(),
        accessTime: topicAccessTime,
        isAccessable: false,
        href: null,
      };
    }

    const topicHref = topicAnchorElement?.href
      ? new URL(topicAnchorElement.href).pathname
      : null;
    const topicId = topicHref ? topicHref.split("/").pop() : null;
    currentTopicId = Number(topicId);

    return {
      id: topicId,
      accessTime: topicAccessTime,
      isAccessable: true,
      href: topicHref,
    };
  });
}
