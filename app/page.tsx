// app/page.tsx
"use client";

import Header from "@/components/header";
import { useTasks } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { useTaskStats } from "@/hooks/useTaskStats";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export default function Home() {
  const {
    extraConfirmation,
    isLoading,
    mode,
    toggleMode,
  } = useAccessibilitySettings();

  const {
    tasks,
    newTask,
    setNewTask,
    newTaskPriority,
    setNewTaskPriority,
    editingId,
    editText,
    setEditText,
    showSubtasks,
    setShowSubtasks,
    newSubtask,
    setNewSubtask,
    showNotes,
    setShowNotes,
    editingPriority,
    setEditingPriority,
    addTask,
    deleteTask,
    toggleTask,
    startEdit,
    saveEdit,
    cancelEdit,
    changePriority,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    markAllComplete,
    clearCompleted,
    updateTaskNotes,
  } = useTasks(extraConfirmation, isLoading);

  const {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredTasks,
  } = useTaskFilters(tasks);

  const stats = useTaskStats(tasks);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Header com controle de modo e busca */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                📋 Lista de Tarefas
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mode === "simplificado" ? "🔹 Modo Simplificado" : "🔸 Modo Completo"}
              </p>
              <div className="mt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${extraConfirmation ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {extraConfirmation ? '✅ Confirmação ativada' : '❌ Confirmação desativada'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {mode === "completo" && (
                <input
                  type="text"
                  placeholder="🔍 Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              )}
              <button
                onClick={toggleMode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                title={mode === "simplificado" ? "Ativar modo completo com mais recursos" : "Voltar ao modo simplificado mais focado"}
              >
                <span>{mode === "simplificado" ? "🔧" : "🧊"}</span>
                {mode === "simplificado" ? "Completo" : "Simplificado"}
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.activeTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Concluídas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Progresso</div>
          </div>
        </div>

        {/* Input para nova tarefa */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={mode === "simplificado" 
                  ? "✏️ Digite sua tarefa..." 
                  : "✏️ Digite sua tarefa..."
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-lg"
              />
              <button
                onClick={addTask}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-lg"
              >
                Adicionar
              </button>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade:</span>
              <div className="flex gap-2">
                {[
                  { value: "baixa", label: "🟢 Baixa" },
                  { value: "media", label: "🟡 Média" },
                  { value: "alta", label: "🔴 Alta" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewTaskPriority(option.value as "baixa" | "media" | "alta")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      newTaskPriority === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    title={`Prioridade ${option.value}`}
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
                {["todas", "ativas", "concluidas"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === f
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="criado">Ordenar por: Data</option>
                <option value="prioridade">Ordenar por: Prioridade</option>
                <option value="alfabetica">Ordenar por: A-Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm ? "🔍 Nenhuma tarefa encontrada para sua busca." :
                  filter === "todas" 
                    ? "🎉 Nenhuma tarefa ainda. Adicione uma acima!" 
                    : filter === "ativas" 
                      ? "✅ Todas as tarefas foram concluídas!" 
                      : "📋 Nenhuma tarefa concluída ainda."}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all hover:shadow-lg ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                    }`}
                    aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                    title={task.completed ? "Clique para reabrir a tarefa" : "Clique para concluir a tarefa"}
                  >
                    {task.completed && <span className="text-lg">✓</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveEdit(task.id);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors"
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
                                        onClick={() => changePriority(task.id, p as "baixa" | "media" | "alta")}
                                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                                          task.priority === p
                                            ? p === "alta" 
                                              ? "bg-red-600 text-white"
                                              : p === "media"
                                                ? "bg-yellow-600 text-white"
                                                : "bg-green-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }`}
                                      >
                                        {p === "alta" && "🔴"} {p === "media" && "🟡"} {p === "baixa" && "🟢"} {p.charAt(0).toUpperCase() + p.slice(1)}
                                      </button>
                                    ))}
                                    <button
                                      onClick={() => setEditingPriority(null)}
                                      className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded-full"
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
                                    title="Clique para alterar a prioridade"
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

                    {/* Subtarefas - modo completo */}
                    {mode === "completo" && task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-3 ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                        <div className="space-y-2">
                          {task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSubtask(task.id, subtask.id)}
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
                                onClick={() => deleteSubtask(task.id, subtask.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                title="Excluir subtarefa"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-1 shrink-0">
                    {mode === "completo" && !editingId && (
                      <>
                        <button
                          onClick={() => setShowSubtasks(showSubtasks === task.id ? null : task.id)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors"
                          title="Gerenciar subtarefas"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => setShowNotes(showNotes === task.id ? null : task.id)}
                          className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                          title="Adicionar notas"
                        >
                          📝
                        </button>
                        <button
                          onClick={() => startEdit(task.id, task.text)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Editar tarefa"
                        >
                          ✏️
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Excluir tarefa"
                    >
                      🗑️
                    </button>
                  </div>
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
                          if (e.key === "Enter") addSubtask(task.id);
                        }}
                        placeholder="➕ Nova subtarefa..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => addSubtask(task.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}

                {/* Notas - modo completo */}
                {mode === "completo" && showNotes === task.id && (
                  <div className="mt-3 ml-10">
                    <textarea
                      placeholder="📝 Adicione notas aqui..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      rows={3}
                      value={task.notes || ""}
                      onChange={(e) => {
                        updateTaskNotes(task.id, e.target.value);
                      }}
                    />
                  </div>
                )}

                {/* Data de criação - modo completo */}
                {mode === "completo" && (
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex flex-wrap gap-4">
                    <span>🕐 Criado: {task.createdAt.toLocaleDateString()} às {task.createdAt.toLocaleTimeString()}</span>
                    {task.completed && (
                      <span>✅ Concluída</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Dicas de acessibilidade */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2">
            💡 Dica: 
            {mode === "simplificado" 
              ? "O modo simplificado mantém o foco no essencial: adicionar, concluir e excluir tarefas. Perfeito para uso rápido e intuitivo!"
              : "O modo completo oferece todas as ferramentas para organizar sua vida: subtarefas, notas, filtros, prioridades e muito mais!"}
          </p>
        </div>

        {/* Ações rápidas - modo simplificado */}
        {mode === "simplificado" && tasks.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={markAllComplete}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Marcar todas as tarefas como concluídas de uma vez"
            >
              ✓ Concluir Todas
            </button>
            <button
              onClick={clearCompleted}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Remover todas as tarefas já concluídas"
            >
              🗑️ Limpar Concluídas
            </button>
          </div>
        )}
      </main>
    </div>
  );
}