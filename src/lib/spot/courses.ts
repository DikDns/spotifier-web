"use client";

import { domParser } from "@/lib/spot/dom-parser";
import { env } from "@/env";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  academicYear: string;
  href: string;
};

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
    const doc = domParser(rawHtml);
    const tbody = doc.querySelector("table tbody");

    if (!tbody) {
      throw new Error("Element tbody not found from spot/mhs");
    }

    const tr = tbody.querySelectorAll("tr");
    const courses = [];

    for (const row of tr) {
      const td = row.querySelectorAll("td");
      const courseData = extractCourseData(td);
      if (courseData) {
        courses.push(courseData);
      }
    }

    return courses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function extractCourseData(td: NodeListOf<Element>) {
  const href = td[1]?.querySelector("a")?.href;
  if (!href || !td[0] || !td[1] || !td[2] || !td[3] || !td[4]) {
    return null;
  }

  const path = new URL(href).pathname;
  const id = path.split("/").pop();

  return {
    id: id ?? "",
    code: td[0]?.textContent ?? "",
    name: td[1]?.textContent ?? "",
    credits: Number(td[2]?.textContent) || 0,
    lecturer: td[3]?.textContent ?? "",
    academicYear: td[4]?.textContent ?? "",
    href: path,
  };
}
