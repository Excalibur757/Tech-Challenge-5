// components/tasks/TaskInput.tsx
"use client";

import { FilterType, SortType } from "@/types/tasks";

interface TaskInputProps {
  newTask: string;
  onNewTaskChange: (value: string) => void;
  newTaskPriority: "baixa" | "media" | "alta";
  onPriorityChange: (priority: "baixa" | "media" | "alta") => void;
  onAddTask: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  mode: "simplificado" | "completo";
  filter: FilterType;
  sortBy: SortType;
  onFilterChange: (filter: FilterType) => void; // <-- Tipo mais específico
  onSortChange: (sort: SortType) => void; // <-- Tipo mais específico
}

export function TaskInput({
  newTask,
  onNewTaskChange,
  newTaskPriority,
  onPriorityChange,
  onAddTask,
  onKeyPress,
  mode,
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
}: TaskInputProps) {
  const priorityOptions = [
    { value: "baixa", label: "🟢 Baixa" },
    { value: "media", label: "🟡 Média" },
    { value: "alta", label: "🔴 Alta" }
  ];

  const filterOptions: FilterType[] = ["todas", "ativas", "concluidas"];
  const sortOptions: SortType[] = ["criado", "prioridade", "alfabetica"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => onNewTaskChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="✏️ Digite sua tarefa..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-lg"
          />
          <button
            onClick={onAddTask}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-lg cursor-pointer"
            title="Adicionar nova tarefa à lista"
          >
            Adicionar
          </button>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade:</span>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPriorityChange(option.value as "baixa" | "media" | "alta")}
                className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                  newTaskPriority === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                title={`Selecionar prioridade ${option.value === 'baixa' ? 'baixa' : option.value === 'media' ? 'média' : 'alta'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros e ordenação - modo completo */}
      {mode === "completo" && (
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                title={`Filtrar tarefas ${f === 'todas' ? 'todas' : f === 'ativas' ? 'ativas' : 'concluídas'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white cursor-pointer"
            title="Ordenar tarefas por data, prioridade ou ordem alfabética"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Ordenar por: {option === "criado" ? "Data" : option === "prioridade" ? "Prioridade" : "A-Z"}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}