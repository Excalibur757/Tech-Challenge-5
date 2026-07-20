// app/hooks/useTaskFilters.ts
"use client";

import { useState, useMemo } from "react";
import { Task } from "./useTasks";

export function useTaskFilters(tasks: Task[]) {
  const [filter, setFilter] = useState<"todas" | "ativas" | "concluidas">("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"criado" | "prioridade" | "alfabetica">("criado");

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === "ativas") return !task.completed;
        if (filter === "concluidas") return task.completed;
        return true;
      })
      .filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "criado") return b.createdAt.getTime() - a.createdAt.getTime();
        if (sortBy === "prioridade") {
          const priorityOrder = { alta: 0, media: 1, baixa: 2 };
          return (priorityOrder[a.priority || "media"] || 1) - (priorityOrder[b.priority || "media"] || 1);
        }
        if (sortBy === "alfabetica") return a.text.localeCompare(b.text);
        return 0;
      });
  }, [tasks, filter, searchTerm, sortBy]);

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredTasks,
  };
}