import React, { useEffect, useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import { useTaskContext } from "@/context/TaskContext";
import Sidebar from "@/components/layout/Sidebar";

// (optional server sync; keeps your context-driven UI intact)
import { listTasks } from "@/services/tasks";
import type { Task } from "@/services/tasks";

const Dashboard = () => {
  const {
    tasks,
    // optional setters if your TaskContext exposes them:
    setTasks, replaceTasks, loadFromServer,
  } = useTaskContext() as any;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ---------- SERVER SYNC (safe, no visual changes) ----------
  useEffect(() => {
    (async () => {
      try {
        if (typeof loadFromServer === "function") {
          await loadFromServer();
          return;
        }
        const res = await listTasks({ page: 1, limit: 100 });
        const items: Task[] = res.items || [];
        (replaceTasks ?? setTasks)?.(items);
      } catch (e) {
        console.warn("[tasks] initial load failed:", e);
      }
    })();
  }, []);

  // ---------- STATS (unchanged) ----------
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-full">
      {/* Mobile header / toggle (unchanged) */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen((s) => !s)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* -------------- LAYOUT: sidebar + main -------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Desktop sidebar (fixed on md+) */}
        <aside className="hidden md:block md:col-span-3">
          <Sidebar
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </aside>

        {/* Main content */}
        <main className="md:col-span-9">
          {/* Stats (unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-foreground/70">Total Tasks</h3>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-foreground/70">Completed</h3>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-foreground/70">Progress</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{completionPercentage}%</p>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-todo-primary h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Task form + list (unchanged) */}
          <TaskForm />
          <div className="flex-1">
            <TaskList category={selectedCategory} />
          </div>
        </main>
      </div>

      {/* Mobile slide-over sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r shadow-lg p-4">
            <Sidebar
              onSelectCategory={(c) => {
                setSelectedCategory(c);
                setIsSidebarOpen(false);
              }}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
