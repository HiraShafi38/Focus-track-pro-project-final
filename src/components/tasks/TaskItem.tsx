
import React from "react";
import { format } from "date-fns";
import { Task, Priority, useTaskContext } from "@/context/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();

  // Format date function
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return format(date, "MMM d, yyyy");
  };

  // Get priority class
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  // Check if due date is overdue or soon (within 24 hours)
  const getDueDateClass = (dueDate?: Date) => {
    if (!dueDate) return "";
    
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);
    
    if (diff < 0) return "due-date-overdue";
    if (hoursRemaining <= 24) return "due-date-soon";
    return "";
  };

  return (
    <div 
      className={cn(
        "task-item",
        getPriorityClass(task.priority),
        task.completed && "completed"
      )}
    >
      <div className="flex items-center pl-7">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => toggleComplete(task.id)}
          className="task-checkbox"
        />
        
        <div className="flex-1 ml-2">
          <div className="flex justify-between items-start">
            <h3 
              className={cn(
                "font-medium text-lg transition-all",
                task.completed && "line-through text-foreground/70"
              )}
            >
              {task.title}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-foreground/50 hover:text-foreground"
              onClick={() => deleteTask(task.id)}
            >
              ×
            </Button>
          </div>
          
          {task.description && (
            <p className="text-sm text-foreground/70 mt-1">{task.description}</p>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2 items-center text-xs text-foreground/60">
            {task.category && (
              <span className="bg-accent px-2 py-1 rounded-md">
                {task.category}
              </span>
            )}
            
            {task.dueDate && (
              <span className={cn("ml-auto", getDueDateClass(task.dueDate))}>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
