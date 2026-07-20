// components/tasks/QuickActions.tsx
"use client";

import Botao from "@/utils/botao";

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
      <Botao
        onClick={onMarkAllComplete}
        title="Marcar todas as tarefas como concluídas de uma vez"
      >
        ✓ Concluir Todas
      </Botao>
      <Botao
        onClick={onClearCompleted}
        title="Remover todas as tarefas já concluídas"
      >
        🗑️ Limpar Concluídas
      </Botao>
    </div>
  );
}