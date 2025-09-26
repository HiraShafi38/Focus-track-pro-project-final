import { api } from "../lib/api";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export async function createTask(input: Partial<Task> & { title: string }) {
  const res = await api("/api/tasks", { method: "POST", body: input });
  return res.task as Task;
}

export async function listTasks(params?: { page?: number; limit?: number; status?: Task["status"]; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const res = await api(`/api/tasks${qs.toString() ? "?" + qs.toString() : ""}`);
  return res as { items: Task[]; page: number; total: number; pages: number };
}

export async function getTask(id: string) {
  const res = await api(`/api/tasks/${id}`);
  return res.task as Task;
}

export async function updateTask(id: string, patch: Partial<Task>) {
  const res = await api(`/api/tasks/${id}`, { method: "PATCH", body: patch });
  return res.task as Task;
}

export async function deleteTask(id: string) {
  const res = await api(`/api/tasks/${id}`, { method: "DELETE" });
  return res.ok as boolean;
}
