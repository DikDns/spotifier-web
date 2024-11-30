"use client";

import { env } from "@/env";
import { dateParser } from "@/lib/spot/date-parser";
import { domParser } from "@/lib/spot/dom-parser";
import { type Answer, type Task } from "@/lib/spot/tasks";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

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
    const doc = domParser(rawHtml);

    const topicAccessTimeStringRaw = doc
      .querySelector(".panel-heading p")
      ?.textContent?.replace("Waktu Akses: ", "")
      ?.trim();

    // Convert the date format from DD:MM:YYYY hh:mm:ss to YYYY-MM-DDTHH:mm:ss
    const topicAccessTime = topicAccessTimeStringRaw
      ? dateParser(topicAccessTimeStringRaw)
      : null;

    const tabContent = doc.querySelector(".tab-content");

    const dashboard = tabContent?.querySelector("#dashboard div");
    const topicDescription = dashboard?.textContent?.trim();

    const subject = tabContent?.querySelector("#materi");
    const subjectRows = subject?.querySelectorAll(".row .col-lg-12");

    // Map subject rows to object
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
            subjectRowObject.youtubeId = iframeSrc
              ?.split("embed/")
              .pop()
              ?.split("?")[0];
            continue;
          }

          subjectRowObject.rawHtml += child.outerHTML;
        }

        mappedSugjectRows.push(subjectRowObject);
      }
    }

    // Map task rows to object
    const tasks: Task[] = [];
    const taskElement = tabContent?.querySelector("#tugas");
    const taskInstructionTables =
      taskElement?.querySelectorAll(".table-striped");
    const taskFormModals = taskElement?.querySelectorAll(".modal");

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
          courseId,
          topicId,
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
            const href = td2?.querySelector("a")?.href ?? null;
            const path = href ? new URL(href).pathname : null;
            const isEmpty = Number(path?.split("/").length) <= 4;
            taskObj.file = isEmpty ? null : path;
          }

          if (td1.textContent === "Waktu Pengumpulan") {
            const bList = td2?.querySelectorAll("b");
            const startDateString = bList.item(0).textContent?.trim();
            const dueDateString = bList.item(1).textContent?.trim();

            taskObj.startDate = startDateString
              ? dateParser(startDateString)
              : null;
            taskObj.dueDate = dueDateString ? dateParser(dueDateString) : null;
          }
        }

        if (taskObj.startDate && taskObj.dueDate) {
          const currentDate = new Date();

          if (taskObj.dueDate < currentDate) {
            taskObj.status = "notSubmitted";
          }
        }

        const siblingElement = taskInstructionTable.nextElementSibling;
        if (siblingElement?.classList.contains("panel-info")) {
          taskObj.status = "submitted";
          const answerObj: Answer = {
            fileHref: "",
            content: "",
            isGraded: false,
            lecturerNotes: "",
            score: 0,
            dateSubmitted: new Date(),
          };

          const panelBodyElement = siblingElement.querySelector(".panel-body");
          const anchorElement = panelBodyElement?.querySelector("a");
          const href = anchorElement?.href;
          const path = href ? new URL(href).pathname : null;
          const isEmpty = Number(path?.split("/").length) <= 4;
          const fixedPath = isEmpty
            ? undefined
            : path?.split("/tugas/mhs").join("tugas");

          answerObj.fileHref = fixedPath ?? "";

          const content = panelBodyElement?.childNodes;
          let rawHtml = ""; // Initialize rawHtml string

          if (content) {
            for (const child of content) {
              if (child.nodeType === Node.ELEMENT_NODE) {
                const element = child as HTMLElement;
                if (element.classList.contains("fa-paperclip")) {
                  break; // Stop when we reach the fa-paperclip element
                } else {
                  rawHtml += element.outerHTML; // Append the outer HTML of the current element
                }
              } else if (child.nodeType === Node.TEXT_NODE) {
                // Append text content if it's not just whitespace
                const textContent = (child as Text).textContent?.trim();
                if (textContent) {
                  rawHtml += textContent;
                }
              }
            }
          }

          answerObj.content = rawHtml;

          const trCollection = siblingElement.querySelectorAll("tr");

          if (trCollection) {
            for (const tr of trCollection) {
              const tdCollection = tr.children;

              const td1 = tdCollection[0];
              const td2 = tdCollection[1];

              if (!td1 || !td2) {
                continue;
              }

              if (td1.textContent === "Waktu Pengumpulan") {
                const dateSubmittedString =
                  td2.textContent?.replace(": ", "") ?? "";
                answerObj.dateSubmitted = new Date(
                  dateSubmittedString.split(" ").join("T"),
                );
              }

              if (td1.textContent === "Nilai") {
                answerObj.score = Number(td2?.textContent);
                answerObj.isGraded = true;
                taskObj.status = "graded";
              }

              if (td1.textContent === "Catatan") {
                answerObj.lecturerNotes = td2.textContent ?? "";
              }
            }
          }

          taskObj.answer = answerObj;
        }

        tasks.push(taskObj);
      }
    }

    if (taskFormModals) {
      let index = 0;
      for (const taskFormModal of taskFormModals) {
        const currentTask = tasks?.at(index);
        if (!currentTask) {
          continue;
        }

        const form = taskFormModal.querySelector("form");
        const tokenInput = form?.querySelector<HTMLInputElement>(
          "input[name='_token']",
        );

        if (tokenInput) {
          currentTask.token = tokenInput.value;
        }

        const idTaskInput = form?.querySelector<HTMLInputElement>(
          "input[name='id_tg']",
        );

        if (idTaskInput) {
          currentTask.id = idTaskInput.value;
        }

        index++;
      }
    }

    return {
      id: topicId,
      accessTime: topicAccessTime,
      isAccessable: topicAccessTime ? topicAccessTime <= new Date() : true,
      href: path,
      description: topicDescription,
      contents: mappedSugjectRows,
      tasks,
    };
  } catch (error) {
    console.error(error);
  }
}

export type DetailTopic = Awaited<ReturnType<typeof getDetailTopic>>;
