
import React, { useState } from "react";
import { useTaskContext, Priority } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskForm: React.FC = () => {
  const { addTask, categories } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title at minimum
    if (!title.trim()) return;
    
    addTask({
      title,
      description: description || undefined,
      completed: false,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory(undefined);
    setDueDate("");
    setIsExpanded(false);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
            onFocus={() => setIsExpanded(true)}
          />
          <Button type="submit" className="bg-todo-primary hover:bg-todo-primary/90">
            Add
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskForm;
