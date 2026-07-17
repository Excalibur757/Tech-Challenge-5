// components/tasks/TaskEmptyState.tsx
"use client";

interface TaskEmptyStateProps {
  searchTerm: string;
  filter: string;
}

export function TaskEmptyState({ searchTerm, filter }: TaskEmptyStateProps) {
  let message = "";
  
  if (searchTerm) {
    message = "🔍 Nenhuma tarefa encontrada para sua busca.";
  } else if (filter === "todas") {
    message = "🎉 Nenhuma tarefa ainda. Adicione uma acima!";
  } else if (filter === "ativas") {
    message = "✅ Todas as tarefas foram concluídas!";
  } else {
    message = "📋 Nenhuma tarefa concluída ainda.";
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}