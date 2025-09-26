
import React, { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className, 
  onSelectCategory,
  selectedCategory
}) => {
  const { categories, tasks } = useTaskContext();
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Count tasks per category
  const categoryCount = categories.reduce((acc, category) => {
    acc[category] = tasks.filter(task => task.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Count tasks without category
  const uncategorizedCount = tasks.filter(task => !task.category).length;
  
  // Count completed tasks
  const completedCount = tasks.filter(task => task.completed).length;
  
  // Count all tasks
  const allTasksCount = tasks.length;

  return (
    <div className={cn("py-4 px-2 flex flex-col h-full", className)}>
      <div className="mb-2 px-3 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Tasks</h2>
      </div>

      <div className="space-y-1 mt-2">
        <Button 
          variant={selectedCategory === null ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onSelectCategory(null)}
        >
          <span className="mr-auto">All Tasks</span>
          <span className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
            {allTasksCount}
          </span>
        </Button>
        
        <Button 
          variant={selectedCategory === "completed" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onSelectCategory("completed")}
        >
          <span className="mr-auto">Completed</span>
          <span className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
            {completedCount}
          </span>
        </Button>
      </div>

      <div className="mt-6 mb-2 px-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Categories</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
          >
            +
          </Button>
        </div>
      </div>

      {isAddingCategory && (
        <div className="px-3 mb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newCategory.trim()) {
                // This would call the actual addCategory function from context
                console.log("Add category:", newCategory);
                setNewCategory("");
                setIsAddingCategory(false);
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            />
            <Button type="submit" size="sm">Add</Button>
          </form>
        </div>
      )}

      <div className="space-y-1">
        {categories.map((category) => (
          <Button 
            key={category} 
            variant={selectedCategory === category ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => onSelectCategory(category)}
          >
            <span className="mr-auto truncate">{category}</span>
            {categoryCount[category] > 0 && (
              <span className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
                {categoryCount[category]}
              </span>
            )}
          </Button>
        ))}
        
        {uncategorizedCount > 0 && (
          <Button 
            variant={selectedCategory === "uncategorized" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => onSelectCategory("uncategorized")}
          >
            <span className="mr-auto">Uncategorized</span>
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
              {uncategorizedCount}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
