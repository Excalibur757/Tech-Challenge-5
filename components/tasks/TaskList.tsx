// components/tasks/TaskList.tsx
"use client";

import { TaskItem } from "./TaskItem";
import { TaskEmptyState } from "./TaskEmptyState";

interface TaskSubtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: "baixa" | "media" | "alta";
  dueDate?: string;
  tags?: string[];
  notes?: string;
  subtasks?: TaskSubtask[];
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  searchTerm: string;
  filter: string;
  mode: "simplificado" | "completo";
  editingId: string | null;
  editText: string;
  onEditTextChange: (value: string) => void;
  onSaveEdit: (taskId: string) => void;
  onCancelEdit: () => void;
  onToggleTask: (taskId: string) => void;
  onStartEdit: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onAddSubtask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  showSubtasks: string | null;
  setShowSubtasks: (taskId: string | null) => void;
  showNotes: string | null;
  setShowNotes: (taskId: string | null) => void;
  newSubtask: string;
  setNewSubtask: (value: string) => void;
  editingPriority: string | null;
  setEditingPriority: (taskId: string | null) => void;
  onChangePriority: (taskId: string, priority: "baixa" | "media" | "alta") => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function TaskList({
  tasks,
  filteredTasks,
  searchTerm,
  filter,
  mode,
  editingId,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onToggleTask,
  onStartEdit,
  onDeleteTask,
  onUpdateNotes,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  showSubtasks,
  setShowSubtasks,
  showNotes,
  setShowNotes,
  newSubtask,
  setNewSubtask,
  editingPriority,
  setEditingPriority,
  onChangePriority,
  onKeyPress,
}: TaskListProps) {
  if (filteredTasks.length === 0) {
    return <TaskEmptyState searchTerm={searchTerm} filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          mode={mode}
          editingId={editingId}
          editText={editText}
          onEditTextChange={onEditTextChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onToggleTask={onToggleTask}
          onStartEdit={onStartEdit}
          onDeleteTask={onDeleteTask}
          onUpdateNotes={onUpdateNotes}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          showSubtasks={showSubtasks}
          setShowSubtasks={setShowSubtasks}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
          newSubtask={newSubtask}
          setNewSubtask={setNewSubtask}
          editingPriority={editingPriority}
          setEditingPriority={setEditingPriority}
          onChangePriority={onChangePriority}
          onKeyPress={onKeyPress}
        />
      ))}
    </div>
  );
}