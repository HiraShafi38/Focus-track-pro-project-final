import { useCallback, useEffect, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask, Task } from "../services/tasks";

export function useTasks() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await listTasks({ page: 1, limit: 50 });
      setItems(res.items);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function addTask(title: string, description = "") {
    if (!title.trim()) return;
    await createTask({ title, description });
    await refresh();
  }

  async function markDone(id: string) {
    await updateTask(id, { status: "done" });
    await refresh();
  }

  async function removeTask(id: string) {
    await deleteTask(id);
    await refresh();
  }

  return { items, loading, error, refresh, addTask, markDone, removeTask };
}
