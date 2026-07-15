"use client";

import Header from "@/components/header";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority?: "baixa" | "media" | "alta";
  dueDate?: string;
  notes?: string;
  subtasks?: { id: string; text: string; completed: boolean }[];
  reminder?: Date;
  tags?: string[];
}

export default function Home() {
  // Estado local para a confirmação extra - lido diretamente dos cookies
  const [extraConfirmation, setExtraConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baixa" | "media" | "alta">("media");
  const [mode, setMode] = useState<"simplificado" | "completo">("simplificado");
  const [filter, setFilter] = useState<"todas" | "ativas" | "concluidas">("todas");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"criado" | "prioridade" | "alfabetica">("criado");
  const [showSubtasks, setShowSubtasks] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

  // Carregar todas as configurações ao iniciar
  useEffect(() => {
    // 💡 Dica: As configurações de acessibilidade são carregadas dos cookies
    // para manter as preferências do usuário entre as páginas
    try {
      const savedSettings = Cookies.get("accessibilitySettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setExtraConfirmation(parsed.extraConfirmation || false);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }

    // 💡 Dica: Suas tarefas são salvas automaticamente no navegador
    // Você pode acessá-las mesmo após fechar e reabrir a página
    const savedTasks = Cookies.get("tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          dueDate: t.dueDate,
          reminder: t.reminder ? new Date(t.reminder) : undefined
        })));
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    }

    // 💡 Dica: O modo de visualização (simplificado ou completo) é lembrado
    // para oferecer a melhor experiência para você
    const savedMode = Cookies.get("todoMode");
    if (savedMode === "simplificado" || savedMode === "completo") {
      setMode(savedMode);
    }

    setIsLoading(false);
  }, []);

  // Salvar tarefas e modo nos cookies
  useEffect(() => {
    if (!isLoading) {
      Cookies.set("tasks", JSON.stringify(tasks), { expires: 365 });
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      Cookies.set("todoMode", mode, { expires: 365 });
    }
  }, [mode, isLoading]);

  // 💡 Dica: Esta função verifica se você ativou a confirmação extra
  // nas configurações de acessibilidade. Quando ativada, você será
  // perguntado antes de excluir ou editar tarefas, evitando erros.
  const shouldConfirm = () => {
    return extraConfirmation === true;
  };

  // 💡 Dica: Adicione suas tarefas aqui. Você pode definir a prioridade
  // antes de adicionar - use 🔴 Alta para tarefas urgentes,
  // 🟡 Média para tarefas importantes e 🟢 Baixa para tarefas simples.
  const addTask = () => {
    if (newTask.trim() === "") return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      priority: newTaskPriority,
      subtasks: [],
    };
    
    setTasks([task, ...tasks]);
    setNewTask("");
    setNewTaskPriority("media");
  };

  // 💡 Dica: Ao excluir uma tarefa, você será perguntado se tem certeza
  // (se a confirmação extra estiver ativada). Isso ajuda a evitar
  // exclusões acidentais.
  const deleteTask = (id: string) => {
    const taskName = tasks.find(t => t.id === id)?.text || "esta tarefa";
    
    if (shouldConfirm()) {
      if (mode === "simplificado") {
        if (confirm(`Tem certeza que deseja excluir "${taskName}"?`)) {
          setTasks(tasks.filter(task => task.id !== id));
        }
      } else {
        if (confirm(`Tem certeza que deseja excluir a tarefa "${taskName}"?`)) {
          setTasks(tasks.filter(task => task.id !== id));
        }
      }
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  // 💡 Dica: Clique no círculo ao lado da tarefa para marcar como concluída
  // ou pendente. Tarefas concluídas ficam com um risco no texto.
  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newStatus } : t
      ));
    }
  };

  // 💡 Dica: Para editar uma tarefa no modo completo, clique no lápis ✏️
  // Se a confirmação extra estiver ativada, você será perguntado antes de editar.
  const startEdit = (id: string, text: string) => {
    if (shouldConfirm()) {
      if (confirm(`Deseja editar a tarefa "${text}"?`)) {
        setEditingId(id);
        setEditText(text);
      }
    } else {
      setEditingId(id);
      setEditText(text);
    }
  };

  // Salvar edição
  const saveEdit = (id: string) => {
    if (editText.trim() === "") return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText("");
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // 💡 Dica: No modo completo, você pode clicar na prioridade da tarefa
  // para alterá-la rapidamente entre Baixa, Média ou Alta.
  const changePriority = (id: string, priority: "baixa" | "media" | "alta") => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
    setEditingPriority(null);
  };

  // 💡 Dica: No modo completo, você pode adicionar subtarefas para
  // dividir tarefas grandes em etapas menores e mais fáceis de gerenciar.
  const addSubtask = (taskId: string) => {
    if (newSubtask.trim() === "") return;
    setTasks(tasks.map(task =>
      task.id === taskId ? {
        ...task,
        subtasks: [
          ...(task.subtasks || []),
          { id: Date.now().toString(), text: newSubtask.trim(), completed: false }
        ]
      } : task
    ));
    setNewSubtask("");
  };

  // Toggle subtarefa
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? {
        ...task,
        subtasks: task.subtasks?.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      } : task
    ));
  };

  // Remover subtarefa
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const subtask = tasks
      .find(t => t.id === taskId)
      ?.subtasks?.find(st => st.id === subtaskId);
    
    if (subtask) {
      if (shouldConfirm()) {
        if (confirm(`Tem certeza que deseja excluir a subtarefa "${subtask.text}"?`)) {
          setTasks(tasks.map(task =>
            task.id === taskId ? {
              ...task,
              subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
            } : task
          ));
        }
      } else {
        setTasks(tasks.map(task =>
          task.id === taskId ? {
            ...task,
            subtasks: task.subtasks?.filter(st => st.id !== subtaskId)
          } : task
        ));
      }
    }
  };

  // Filtrar tarefas
  const filteredTasks = tasks
    .filter(task => {
      if (filter === "ativas") return !task.completed;
      if (filter === "concluidas") return task.completed;
      return true;
    })
    .filter(task =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "criado") return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "prioridade") {
        const priorityOrder = { alta: 0, media: 1, baixa: 2 };
        return (priorityOrder[a.priority || "media"] || 1) - (priorityOrder[b.priority || "media"] || 1);
      }
      if (sortBy === "alfabetica") return a.text.localeCompare(b.text);
      return 0;
    });

  // 💡 Dica: Alterne entre o modo Simplificado (foco no essencial)
  // e o modo Completo (com todas as funcionalidades) clicando no botão.
  // O modo escolhido será lembrado para a próxima visita.
  const toggleMode = () => {
    const newMode = mode === "simplificado" ? "completo" : "simplificado";
    setMode(newMode);
  };

  // Estatísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tecla Enter para adicionar
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Mostrar loading enquanto carrega
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
              {/* 💡 Dica: Este indicador mostra se a confirmação extra está ativada */}
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

        {/* 💡 Dica: Acompanhe seu progresso com as estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-yellow-600">{activeTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Concluídas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
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
            
            {/* 💡 Dica: Escolha a prioridade da sua tarefa antes de adicionar */}
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
                  {/* 💡 Dica: Clique no círculo para marcar como concluída */}
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

                  {/* Conteúdo da tarefa */}
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
                          {/* 💡 Dica: Ícones de prioridade no modo simplificado */}
                          {mode === "simplificado" && task.priority && (
                            <span className="text-lg" title={`Prioridade ${task.priority}`}>
                              {task.priority === "alta" && "🔴"}
                              {task.priority === "media" && "🟡"}
                              {task.priority === "baixa" && "🟢"}
                            </span>
                          )}
                        </div>
                        
                        {/* Detalhes extras - apenas no modo completo */}
                        {mode === "completo" && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {/* 💡 Dica: Clique na prioridade para alterá-la */}
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
                        {/* 💡 Dica: Botão para gerenciar subtarefas */}
                        <button
                          onClick={() => setShowSubtasks(showSubtasks === task.id ? null : task.id)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors"
                          title="Gerenciar subtarefas"
                        >
                          📋
                        </button>
                        {/* 💡 Dica: Botão para adicionar notas */}
                        <button
                          onClick={() => setShowNotes(showNotes === task.id ? null : task.id)}
                          className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                          title="Adicionar notas"
                        >
                          📝
                        </button>
                        {/* 💡 Dica: Botão para editar a tarefa */}
                        <button
                          onClick={() => startEdit(task.id, task.text)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Editar tarefa"
                        >
                          ✏️
                        </button>
                      </>
                    )}
                    {/* 💡 Dica: Botão para excluir a tarefa */}
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
                        setTasks(tasks.map(t =>
                          t.id === task.id ? { ...t, notes: e.target.value } : t
                        ));
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
              onClick={() => {
                if (shouldConfirm()) {
                  if (confirm("Marcar todas as tarefas como concluídas?")) {
                    setTasks(tasks.map(t => ({ ...t, completed: true })));
                  }
                } else {
                  setTasks(tasks.map(t => ({ ...t, completed: true })));
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Marcar todas as tarefas como concluídas de uma vez"
            >
              ✓ Concluir Todas
            </button>
            <button
              onClick={() => {
                if (shouldConfirm()) {
                  if (confirm("Remover todas as tarefas concluídas?")) {
                    setTasks(tasks.filter(t => !t.completed));
                  }
                } else {
                  setTasks(tasks.filter(t => !t.completed));
                }
              }}
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