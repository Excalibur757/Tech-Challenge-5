// components/tasks/QuickActions.tsx
"use client";

interface QuickActionsProps {
  tasksLength: number;
  onMarkAllComplete: () => void;
  onClearCompleted: () => void;
}

export function QuickActions({
  tasksLength,
  onMarkAllComplete,
  onClearCompleted,
}: QuickActionsProps) {
  if (tasksLength === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={onMarkAllComplete}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        title="Marcar todas as tarefas como concluídas de uma vez"
      >
        ✓ Concluir Todas
      </button>
      <button
        onClick={onClearCompleted}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        title="Remover todas as tarefas já concluídas"
      >
        🗑️ Limpar Concluídas
      </button>
    </div>
  );
}