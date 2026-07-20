// components/tasks/TaskActions.tsx
"use client";

interface TaskActionsProps {
  taskId: string;
  mode: "simplificado" | "completo";
  editingId: string | null;
  onShowSubtasks: (taskId: string) => void;
  onShowNotes: (taskId: string) => void;
  onStartEdit: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  taskText: string;
}

export function TaskActions({
  taskId,
  mode,
  editingId,
  onShowSubtasks,
  onShowNotes,
  onStartEdit,
  onDeleteTask,
  taskText,
}: TaskActionsProps) {
  return (
    <div className="flex gap-1 shrink-0">
      {mode === "completo" && !editingId && (
        <>
          <button
            onClick={() => onShowSubtasks(taskId)}
            className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors"
            title="Gerenciar subtarefas"
          >
            📋
          </button>
          <button
            onClick={() => onShowNotes(taskId)}
            className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
            title="Adicionar notas"
          >
            📝
          </button>
          <button
            onClick={() => onStartEdit(taskId, taskText)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Editar tarefa"
          >
            ✏️
          </button>
        </>
      )}
      <button
        onClick={() => onDeleteTask(taskId)}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
        title="Excluir tarefa"
      >
        🗑️
      </button>
    </div>
  );
}