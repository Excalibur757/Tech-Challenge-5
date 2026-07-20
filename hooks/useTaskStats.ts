// app/hooks/useTaskStats.ts
"use client";

import { useMemo } from "react";
import { Task } from "@/hooks/useTasks";

export function useTaskStats(tasks: Task[]) {
  return useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
    };
  }, [tasks]);
}