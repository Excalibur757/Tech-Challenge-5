// components/tasks/TaskItem.tsx
"use client";

import { TaskNotes } from "./TaskNotes";
import { TaskSubtasks } from "./TaskSubtasks";
import { TaskActions } from "./TaskActions";
import { Task } from "@/hooks/useTasks";

interface TaskItemProps {
  task: Task;
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

export function TaskItem({
  task,
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
}: TaskItemProps) {
  const handleShowSubtasks = () => {
    setShowSubtasks(showSubtasks === task.id ? null : task.id);
  };

  const handleShowNotes = () => {
    setShowNotes(showNotes === task.id ? null : task.id);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Botão de toggle */}
        <button
          onClick={() => onToggleTask(task.id)}
          className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
          }`}
          aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
          title={task.completed ? "Clique para reabrir a tarefa" : "Clique para concluir a tarefa"}
        >
          {task.completed && <span className="text-lg">✓</span>}
        </button>

        {/* Conteúdo da tarefa */}
        <div className="flex-1 min-w-0">
          {editingId === task.id ? (
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") onSaveEdit(task.id);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                autoFocus
              />
              <button
                onClick={() => onSaveEdit(task.id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Salvar alterações na tarefa"
              >
                Salvar
              </button>
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors cursor-pointer"
                title="Cancelar edição e descartar alterações"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <p className={`text-gray-800 dark:text-gray-200 text-lg wrap-break-word ${
                  task.completed ? "line-through text-gray-500 dark:text-gray-500" : ""
                }`}>
                  {task.text}
                </p>
                {mode === "simplificado" && task.priority && (
                  <span className="text-lg" title={`Prioridade ${task.priority}`}>
                    {task.priority === "alta" && "🔴"}
                    {task.priority === "media" && "🟡"}
                    {task.priority === "baixa" && "🟢"}
                  </span>
                )}
              </div>
              
              {/* Detalhes extras - modo completo */}
              {mode === "completo" && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.priority && (
                    <div className="relative">
                      {editingPriority === task.id ? (
                        <div className="flex flex-wrap gap-1">
                          {["baixa", "media", "alta"].map((p) => (
                            <button
                              key={p}
                              onClick={() => onChangePriority(task.id, p as "baixa" | "media" | "alta")}
                              className={`text-xs px-2 py-1 rounded-full transition-colors cursor-pointer ${
                                task.priority === p
                                  ? p === "alta" 
                                    ? "bg-red-600 text-white"
                                    : p === "media"
                                      ? "bg-yellow-600 text-white"
                                      : "bg-green-600 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                              }`}
                              title={`Definir prioridade como ${p === 'alta' ? 'alta' : p === 'media' ? 'média' : 'baixa'}`}
                            >
                              {p === "alta" && "🔴"} {p === "media" && "🟡"} {p === "baixa" && "🟢"} {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                          <button
                            onClick={() => setEditingPriority(null)}
                            className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
                            title="Cancelar edição de prioridade"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span 
                          onClick={() => setEditingPriority(task.id)}
                          className={`text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 ${
                            task.priority === "alta" 
                              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              : task.priority === "media"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          }`}
                          title={`Prioridade ${task.priority === 'alta' ? 'alta' : task.priority === 'media' ? 'média' : 'baixa'} - Clique para alterar`}
                        >
                          {task.priority === "alta" && "🔴"}
                          {task.priority === "media" && "🟡"}
                          {task.priority === "baixa" && "🟢"}
                          {" "}{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          <span className="ml-1 text-xs opacity-50">✎</span>
                        </span>
                      )}
                    </div>
                  )}
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(task.dueDate) < new Date() && !task.completed
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    }`}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                      🏷️ {task.tags.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtarefas existentes */}
          {mode === "completo" && task.subtasks && task.subtasks.length > 0 && (
            <TaskSubtasks
              taskId={task.id}
              subtasks={task.subtasks}
              newSubtask={newSubtask}
              onNewSubtaskChange={setNewSubtask}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onKeyPress={onKeyPress}
            />
          )}
        </div>

        {/* Ações */}
        <TaskActions
          taskId={task.id}
          mode={mode}
          editingId={editingId}
          onShowSubtasks={handleShowSubtasks}
          onShowNotes={handleShowNotes}
          onStartEdit={onStartEdit}
          onDeleteTask={onDeleteTask}
          taskText={task.text}
        />
      </div>

      {/* Adicionar subtarefa - modo completo */}
      {mode === "completo" && showSubtasks === task.id && (
        <div className="mt-3 ml-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") onAddSubtask(task.id);
              }}
              placeholder="➕ Nova subtarefa..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            />
            <button
              onClick={() => onAddSubtask(task.id)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm cursor-pointer"
              title="Adicionar uma subtarefa a esta tarefa"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Notas - modo completo */}
      {mode === "completo" && showNotes === task.id && (
        <TaskNotes
          taskId={task.id}
          notes={task.notes}
          onUpdateNotes={onUpdateNotes}
        />
      )}

      {/* Data de criação - modo completo */}
      {mode === "completo" && (
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex flex-wrap gap-4">
          <span>🕐 Criado: {task.createdAt.toLocaleDateString()} às {task.createdAt.toLocaleTimeString()}</span>
          {task.completed && <span>✅ Concluída</span>}
        </div>
      )}
    </div>
  );
}