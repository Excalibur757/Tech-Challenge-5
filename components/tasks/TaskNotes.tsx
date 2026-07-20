// components/tasks/TaskNotes.tsx
"use client";

interface TaskNotesProps {
  taskId: string;
  notes?: string;
  onUpdateNotes: (taskId: string, notes: string) => void;
}

export function TaskNotes({ taskId, notes = "", onUpdateNotes }: TaskNotesProps) {
  return (
    <div className="mt-3 ml-10">
      <textarea
        placeholder="📝 Adicione notas aqui..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        rows={3}
        value={notes}
        onChange={(e) => onUpdateNotes(taskId, e.target.value)}
      />
    </div>
  );
}