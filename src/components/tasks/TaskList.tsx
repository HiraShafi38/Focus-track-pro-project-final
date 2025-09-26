
import React, { useState, useMemo } from "react";
import { useTaskContext, Task } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import EmptyState from "../ui/EmptyState";

interface TaskListProps {
  category: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ category }) => {
  const { tasks } = useTaskContext();
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  // Filter tasks based on selected category
  const filteredTasks = useMemo(() => {
    let filtered: Task[] = [];
    
    if (category === null) {
      filtered = tasks; // All tasks
    } else if (category === "completed") {
      filtered = tasks.filter((task) => task.completed);
    } else if (category === "uncategorized") {
      filtered = tasks.filter((task) => !task.category);
    } else {
      filtered = tasks.filter((task) => task.category === category);
    }
    
    // Sort tasks
    return [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "priority") {
        const priorityMap: Record<string, number> = {
          high: 3,
          medium: 2,
          low: 1,
        };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      return 0;
    });
  }, [tasks, category, sortBy]);

  // If no tasks match the filter, show empty state
  if (filteredTasks.length === 0) {
    return (
      <EmptyState 
        title="No tasks found"
        description={
          category === "completed" 
            ? "You haven't completed any tasks yet."
            : "Create your first task to get started!"
        }
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {category === null
            ? "All Tasks"
            : category === "completed"
            ? "Completed Tasks"
            : category === "uncategorized"
            ? "Uncategorized Tasks"
            : `${category} Tasks`}
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/70">Sort by:</span>
          <select
            className="text-sm bg-transparent border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "priority")}
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
