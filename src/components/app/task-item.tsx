"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task, TaskCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SparkleAnimation } from "./sparkle-animation";
import { CalendarDays, Star } from "lucide-react";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
};

const categoryStyles: Record<TaskCategory, string> = {
  personal: "bg-pink-300/80 border-pink-400/90 text-pink-900 hover:bg-pink-300",
  work: "bg-purple-300/80 border-purple-400/90 text-purple-900 hover:bg-purple-300",
  study: "bg-sky-300/80 border-sky-400/90 text-sky-900 hover:bg-sky-300",
};

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const [showSparkles, setShowSparkles] = useState(false);

  const handleToggle = () => {
    onToggle(task.id);
    if (!task.completed) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }
  };

  return (
    <Card
      className={cn(
        "p-4 flex items-start gap-4 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-lg",
        task.completed && "bg-card/50 opacity-60"
      )}
    >
      <div className="flex items-center h-full pt-1">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggle}
          className="h-6 w-6 rounded-full"
          aria-label={`Mark ${task.name} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "font-medium text-lg leading-tight cursor-pointer",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.name}
        </label>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-muted-foreground text-sm">
          <Badge
            variant="outline"
            className={cn("text-xs capitalize", categoryStyles[task.category])}
          >
            {task.category}
          </Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>{format(task.dueDate, "MMM d")}</span>
            </div>
          )}
          {task.priority && !task.completed && (
             <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span>Priority #{task.priority}</span>
            </div>
          )}
        </div>
      </div>
      <SparkleAnimation visible={showSparkles} />
    </Card>
  );
}
