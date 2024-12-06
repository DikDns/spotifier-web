"use client";

import { env } from "@/env";
import { getCourses } from "@/lib/spot/courses";
import { getDetailCourse } from "@/lib/spot/detail-course";
import { getDetailTopic, type Topic } from "@/lib/spot/detail-topic";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export type Task = {
  id: string;
  courseId: string;
  topicId: string;
  token: string;
  title: string;
  description: string;
  file: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  status: "pending" | "submitted" | "graded" | "notSubmitted";
  answer: Answer | null;
};

export type Answer = {
  id: string;
  content: string;
  fileHref: string;
  isGraded: boolean;
  lecturerNotes: string;
  score: number;
  dateSubmitted: Date;
};

export type GenericTaskData = {
  courseId: string;
  topicId: string;
  taskId: string;
};

export type PostTaskData = {
  courseId: string;
  topicId: string;
  task: {
    id: string;
    token: string;
    description: string;
    file: File;
  };
};

export async function deleteTask({
  courseId,
  topicId,
  answerId,
}: {
  courseId: string;
  topicId: string;
  answerId: string;
}) {
  try {
    const path = `/mhs/tugas_del/${courseId}/${topicId}/${answerId}`;
    const response = await fetch(BASE_URL + path);

    if (!response.ok) {
      throw new Error("SPOT might have some issues, please try again later");
    }

    if (response.status === 302) {
      throw new Error("SPOT session expired, please login again");
    }

    return {
      id: answerId,
    };
  } catch (error) {
    console.error(error);
  }
}

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

export async function getDetailTask({
  courseId,
  topicId,
  taskId,
}: GenericTaskData) {
  try {
    const detailTopic = await getDetailTopic(courseId, topicId);

    const task = detailTopic?.tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    console.error(error);
  }
}

export async function getTasks(setLoadingText: (text: string) => void) {
  try {
    setLoadingText("Getting courses...");
    const courses = await getCourses();
    setLoadingText("Recieving detail courses...");
    const detailCourses = await Promise.all(
      courses.map((course) => getDetailCourse(course.id)),
    );

    setLoadingText("Recieving detail topics...");
    const detailTopics: Topic[] = [];
    for (const detailCourse of detailCourses) {
      if (!detailCourse) continue;
      for (const topic of detailCourse.topics) {
        if (!topic?.id) continue;
        const detailTopic = await getDetailTopic(detailCourse.id, topic.id);
        detailTopics.push(detailTopic);
      }
    }

    const tasks: Task[] = [];

    setLoadingText("Recieving tasks...");
    for (const detailTopic of detailTopics) {
      if (!detailTopic) continue;
      tasks.push(...detailTopic.tasks);
    }

    const mappedTasks = tasks.map((task) => ({
      ...task,
      course: detailCourses.find((course) => course?.id === task.courseId),
      topic: detailTopics.find((topic) => topic?.id === task.topicId),
    }));

    return mappedTasks;
  } catch (error) {
    console.error(error);
  }
}

export type GetTasksResponse = Awaited<ReturnType<typeof getTasks>>;
