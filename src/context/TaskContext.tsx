
import React, { createContext, useContext, useState } from "react";

// Define types for tasks
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  category?: string;
  createdAt: Date;
}

// Define context type
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample tasks for demonstration
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Complete React Assignment",
    description: "Finish the to-do app project for web development class",
    completed: false,
    priority: "high",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    category: "School",
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits",
    completed: false,
    priority: "medium",
    category: "Personal",
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Gym workout",
    completed: true,
    priority: "low",
    category: "Health",
    createdAt: new Date(Date.now() - 86400000), // Yesterday
  },
];

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [categories, setCategories] = useState<string[]>(["School", "Work", "Personal", "Health"]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        categories,
        addCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
