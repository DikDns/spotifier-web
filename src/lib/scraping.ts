"use client";

import { fetchTimeout } from "@/lib/fetch-timeout";
import { env } from "@/env";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy/mhs";

export async function getCourses() {
  try {
    const response = await fetchTimeout(BASE_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
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

      const course = {
        id: td[0]?.textContent ?? "",
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
// export async function getTasks(session: Session) {
//   try {
//     const url = env.NEXT_PUBLIC_SPOT_URL + "/mhs";
//     const response = await fetch();

//     return [];
//   } catch (error) {
//     console.error(error);
//     return {
//       error: "Failed to fetch tasks",
//       message: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }
