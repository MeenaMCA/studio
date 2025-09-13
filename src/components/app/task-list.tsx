"use client";

import React from "react";
import { Wand2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onPrioritize: () => Promise<void>;
  isLoadingPriority: boolean;
  isLoading: boolean;
};

export function TaskList({ tasks, onToggle, onPrioritize, isLoadingPriority, isLoading }: TaskListProps) {
  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const TaskLoader = () => (
    <div className="space-y-3">
        <Skeleton className="h-[88px] w-full rounded-lg" />
        <Skeleton className="h-[88px] w-full rounded-lg" />
        <Skeleton className="h-[88px] w-full rounded-lg" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-headline font-semibold">To-Do</h2>
          <Button onClick={onPrioritize} disabled={isLoadingPriority || incompleteTasks.length < 2}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoadingPriority ? "Prioritizing..." : "Prioritize with AI"}
          </Button>
        </div>
        <div className="space-y-3">
          {isLoading ? <TaskLoader /> : (
            <>
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={onToggle} />
                ))
              ) : (
                <div className="text-center py-10 px-4 rounded-lg bg-card/50">
                  <p className="text-muted-foreground">All clear! No tasks to do. ✨</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <Separator className="my-8" />
          <h2 className="text-2xl font-headline font-semibold mb-4">Completed</h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
