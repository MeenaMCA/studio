"use client";

import { useState, useEffect } from "react";
import type { Task } from "@/lib/types";
import { AddTaskDialog } from "@/components/app/add-task-dialog";
import { TaskList } from "@/components/app/task-list";
import { AppHeader } from "@/components/app/header";
import { DailyAffirmation } from "@/components/app/daily-affirmation";
import { prioritizeTasks } from "@/ai/flows/smart-task-prioritization";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPriority, setIsLoadingPriority] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        } as Task;
      });
      tasksData.sort((a, b) => {
            if(a.completed !== b.completed) return a.completed ? 1 : -1;
            const priorityA = a.priority ?? Infinity;
            const priorityB = b.priority ?? Infinity;
            if(priorityA !== priorityB) return priorityA - priorityB;
            if(a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
            return 0;
        });
      setTasks(tasksData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, "tasks"), {
        ...newTaskData,
        completed: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding task: ", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Could not add task. Please try again later.",
      });
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling task: ", error);
    }
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
                dueDate: t.dueDate?.toISOString() || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                category: t.category,
            }))
        };
        const prioritizedResult = await prioritizeTasks(aiInput);

        const batch = writeBatch(db);
        const priorities = new Map(prioritizedResult.map(p => [p.name, p.priority]));

        tasks.forEach(task => {
            const taskRef = doc(db, "tasks", task.id);
            if (!task.completed && priorities.has(task.name)) {
                batch.update(taskRef, { priority: priorities.get(task.name) });
            } else {
                 batch.update(taskRef, { priority: null });
            }
        });
        
        await batch.commit();

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
            isLoading={isLoading}
          />
        </div>
      </main>
      <AddTaskDialog onAddTask={handleAddTask} />
    </div>
  );
}
