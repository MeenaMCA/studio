"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { AddTaskDialog } from "@/components/app/add-task-dialog";
import { TaskList } from "@/components/app/task-list";
import { AppHeader } from "@/components/app/header";
import { DailyAffirmation } from "@/components/app/daily-affirmation";
import { prioritizeTasks } from "@/ai/flows/smart-task-prioritization";
import { useToast } from "@/hooks/use-toast";

const initialTasks: Task[] = [
  { id: "1", name: "Design the new app icon", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), category: "work", completed: false },
  { id: "2", name: "Book a yoga class", dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), category: "personal", completed: false },
  { id: "3", name: "Read Chapter 5 of Psychology book", dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), category: "study", completed: true },
  { id: "4", name: "Weekly team meeting", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), category: "work", completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoadingPriority, setIsLoadingPriority] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks((prev) => [...prev, newTask].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity)));
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handlePrioritize = async () => {
    setIsLoadingPriority(true);
    const incompleteTasks = tasks.filter(task => !task.completed);
    
    if (incompleteTasks.length < 2) {
        toast({ title: "Not enough tasks", description: "You need at least two tasks to prioritize."});
        setIsLoadingPriority(false);
        return;
    }

    try {
        const aiInput = {
            tasks: incompleteTasks.map(t => ({
                name: t.name,
                dueDate: t.dueDate?.toISOString() || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Provide a far-future date if undefined
                category: t.category,
            }))
        };
        const prioritizedResult = await prioritizeTasks(aiInput);

        const tasksWithPriorities = new Map(prioritizedResult.map(p => [p.name, p]));
        
        const updatedTasks = tasks.map(task => {
            const priorityInfo = tasksWithPriorities.get(task.name);
            if (priorityInfo) {
                return { ...task, priority: priorityInfo.priority };
            }
            return { ...task, priority: task.completed ? undefined : task.priority }; // Keep priority for incomplete, clear for completed
        });

        updatedTasks.sort((a, b) => {
            if(a.completed !== b.completed) return a.completed ? 1 : -1;
            const priorityA = a.priority ?? Infinity;
            const priorityB = b.priority ?? Infinity;
            if(priorityA !== priorityB) return priorityA - priorityB;
            if(a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
            return 0;
        });

        setTasks(updatedTasks);
        toast({
            title: "Tasks Prioritized! ✨",
            description: "Your tasks have been magically sorted for you.",
        });
    } catch (error) {
        console.error("Failed to prioritize tasks:", error);
        toast({
            variant: "destructive",
            title: "Oh no! Something went wrong.",
            description: "Could not prioritize tasks. Please try again later.",
        });
    } finally {
        setIsLoadingPriority(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <DailyAffirmation />
          <TaskList 
            tasks={tasks} 
            onToggle={handleToggleTask} 
            onPrioritize={handlePrioritize}
            isLoadingPriority={isLoadingPriority}
          />
        </div>
      </main>
      <AddTaskDialog onAddTask={handleAddTask} />
    </div>
  );
}
