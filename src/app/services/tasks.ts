"use server";

import { Task, TaskDto } from "../types/articles";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_TASKS_API_URL}/tasks`);
  return res.json();
}

export async function createTask(taskDetails: TaskDto): Promise<Task> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_TASKS_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskDetails),
  });
  return res.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_TASKS_API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
}
