// components/tasks/TaskSubtasks.tsx
"use client";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskSubtasksProps {
  taskId: string;
  subtasks: Subtask[];
  newSubtask: string;
  onNewSubtaskChange: (value: string) => void;
  onAddSubtask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function TaskSubtasks({
  taskId,
  subtasks,
  // newSubtask,
  // onNewSubtaskChange,
  // onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  // onKeyPress,
}: TaskSubtasksProps) {
  if (!subtasks || subtasks.length === 0) return null;

  return (
    <div className="mt-3 ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <button
              onClick={() => onToggleSubtask(taskId, subtask.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                subtask.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              title={subtask.completed ? "Marcar como pendente" : "Marcar como concluída"}
            >
              {subtask.completed && "✓"}
            </button>
            <span className={`text-sm ${
              subtask.completed ? "line-through text-gray-500" : "text-gray-700 dark:text-gray-300"
            }`}>
              {subtask.text}
            </span>
            <button
              onClick={() => onDeleteSubtask(taskId, subtask.id)}
              className="text-red-500 hover:text-red-700 text-sm"
              title="Excluir subtarefa"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}