"use client";

import { useQuery } from "@tanstack/react-query";
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

export async function getDetailCourse(id: string) {
  try {
    const coursesPromise = getCourses();
    const detailCoursePromise = fetch(BASE_URL + "/mhs/dashboard/" + id);

    const [courses, detailCourseResponse] = await Promise.all([
      coursesPromise,
      detailCoursePromise,
    ]);

    if (!detailCourseResponse.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (detailCourseResponse.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const currentCourse = courses.find((course) => course.id === id);
    const rawHtml = await detailCourseResponse.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

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

    let currentTopicId = 0;
    const topics = Array.from(courseTopics).map((topic, index) => {
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

    return {
      ...currentCourse,
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

type Task = {
  id: string;
  token: string;
  title: string;
  description: string;
  file: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  status: "pending" | "submitted" | "graded" | "notSubmitted";
  answer: Answer | null;
};

type Answer = {
  description: string;
  fileHref: string;
  isGraded: boolean;
  lecturerNotes: string;
  dateSubmitted: Date;
};

export async function getDetailTopic(courseId: string, topicId: string) {
  try {
    const path = `/mhs/topik/${courseId}/${topicId}`;
    const response = await fetch(BASE_URL + path);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    const rawHtml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    const topicAccessTimeStringRaw = doc
      .querySelector(".panel-heading p")
      ?.textContent?.replace("Waktu Akses: ", "")
      ?.trim();

    // Convert the date format from DD:MM:YYYY hh:mm:ss to YYYY-MM-DDTHH:mm:ss
    const [day, month, yearTime] = topicAccessTimeStringRaw?.split("-") ?? [];
    const [year, time] = yearTime?.split(" ") ?? [];
    const topicAccessTimeString = `${year}-${month}-${day}T${time}`;
    const topicAccessTime = topicAccessTimeString
      ? new Date(topicAccessTimeString)
      : null;

    const tabContent = doc.querySelector(".tab-content");

    const dashboard = tabContent?.querySelector("#dashboard div");
    const topicDescription = dashboard?.textContent?.trim();

    const subject = tabContent?.querySelector("#materi");
    const subjectRows = subject?.querySelectorAll(".row .col-lg-12");

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
            continue;
          }

          if (child.classList.contains("modal")) {
            const iframe = child.querySelector("iframe");
            const iframeSrc = iframe?.src;
            subjectRowObject.youtubeId = iframeSrc?.split("embed/").pop();
            continue;
          }

          subjectRowObject.rawHtml += child.outerHTML;
        }

        mappedSugjectRows.push(subjectRowObject);
      }
    }

    const tasks: Task[] = [];

    const taskElement = tabContent?.querySelector("#tugas");

    const taskInstructionTables =
      taskElement?.querySelectorAll(".table-striped");
    const taskAnswerTables = taskElement?.querySelectorAll(".panel-info");
    const taskFormModal = taskElement?.querySelector(".modal");

    if (taskInstructionTables) {
      for (const taskInstructionTable of taskInstructionTables) {
        const trCollection =
          taskInstructionTable.querySelector("tbody")?.children;

        if (!trCollection) {
          continue;
        }

        const taskObj: Task = {
          id: "",
          token: "",
          title: "",
          status: "pending",
          description: "",
          file: null,
          startDate: null,
          dueDate: null,
          answer: null,
        };

        for (const tr of trCollection) {
          const tdCollection = tr.children;

          const td1 = tdCollection[0];
          const td2 = tdCollection[1];
          if (!td1 || !td2) {
            continue;
          }

          if (td1.textContent === "Judul") {
            taskObj.title = td2?.textContent?.replace(": ", "") ?? "";
          }

          if (td1.textContent === "Deskripsi") {
            taskObj.description = td2?.textContent?.replace(": ", "") ?? "";
          }

          if (td1.textContent === "File") {
            taskObj.file = td2?.querySelector("a")?.href ?? null;
          }

          if (td1.textContent === "Waktu Pengumpulan") {
            const bList = td2?.querySelectorAll("b");
            const startDateString = bList.item(0).textContent?.trim();
            const dueDateString = bList.item(1).textContent?.trim();

            taskObj.startDate = startDateString
              ? parseDate(startDateString)
              : null;
            taskObj.dueDate = dueDateString ? parseDate(dueDateString) : null;
          }
        }

        tasks.push(taskObj);
      }
    }

    return {
      id: topicId,
      accessTime: topicAccessTime,
      isAccessable: true,
      href: path,
      description: topicDescription,
      contents: mappedSugjectRows,
    };
  } catch (error) {
    console.error(error);
  }
}

type DeleteTaskData = {
  courseId: string;
  topicId: string;
  taskId: string;
};

export async function deleteTask({
  courseId,
  topicId,
  taskId,
}: DeleteTaskData) {
  try {
    const path = `/mhs/tugas_del/${courseId}/${topicId}/${taskId}`;
    const response = await fetch(BASE_URL + path);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    return {
      id: taskId,
    };
  } catch (error) {
    console.error(error);
  }
}

type PostTaskData = {
  courseId: string;
  topicId: string;
  task: {
    id: string;
    token: string;
    description: string;
    file: File;
  };
};

export async function postTask(data: PostTaskData) {
  try {
    const path = "/mhs/tugas_store";

    const formData = new FormData();
    formData.append("_token", data.task.token);
    formData.append("id_pn", data.courseId);
    formData.append("id_pt", data.topicId);
    formData.append("id_tg", data.task.id);
    formData.append("isi", data.task.description);
    formData.append("filename", data.task.file);

    const response = await fetch(BASE_URL + path, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    return {
      id: data.task.id,
      token: data.task.token,
      description: data.task.description,
      file: data.task.file,
    };
  } catch (error) {
    console.error(error);
  }
}
export async function getTasks() {
  try {
    const response = await fetch(BASE_URL);

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

export const useCourses = () => {
  const query = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return query;
};

// async () => {
//   const courses = await getCourses();
//   const detailCoursePromises = Promise.all(
//     courses.map(async (course) => {
//       const detailCourse = await getDetailCourse(course.href);
//       const detailTopicsPromises = detailCourse?.topics?.map(
//         async (topic) => {
//           if (!topic.isAccessable) return topic;
//           if (!topic.href) return topic;

//           const detailTopic = await getDetailTopic(topic.href);

//           return {
//             ...topic,
//             ...detailTopic,
//           };
//         },
//       );
//       const detailTopics = await Promise.all(detailTopicsPromises ?? []);

//       return {
//         ...course,
//         ...detailCourse,
//         topics: detailTopics,
//       };
//     }),
//   );
//   return detailCoursePromises;
// },

// /courses/{id}/topics/{id}

function parseDate(dateString: string) {
  const [day, month, yearTime] = dateString?.split("-") ?? [];
  const [year, time] = yearTime?.split(" ") ?? [];
  if (!time) {
    const date = `${year}-${month}-${day}T00:00:00`;
    return new Date(date);
  }

  const formattedTime = time?.length === 5 ? `${time}:00` : time;
  const date = `${year}-${month}-${day}T${formattedTime}`;
  return new Date(date);
}
