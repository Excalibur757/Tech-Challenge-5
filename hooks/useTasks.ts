// hooks/useTasks.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { notificationService } from '@/services/notification.service';
import { reminderService } from '@/services/reminder.service';
import { historyService } from '@/services/history.service';

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

type TaskData = Omit<Task, 'createdAt' | 'reminder'> & {
  createdAt: string;
  reminder?: string | null;
};

export function useTasks(extraConfirmation: boolean, isLoading: boolean) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baixa" | "media" | "alta">("media");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showSubtasks, setShowSubtasks] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

  // Estados para o Alarme
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info" | "warning">("success");

  // Estados para o Modal
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "complete" | "clear" | "edit" | "deleteSubtask" | null>(null);
  const [modalTaskId, setModalTaskId] = useState<string | null>(null);
  const [modalTaskName, setModalTaskName] = useState("");
  const [modalSubtaskId, setModalSubtaskId] = useState<string | null>(null);

  // Carregar tarefas dos cookies
  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = Cookies.get("tasks");
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          const loadedTasks = parsed.map((t: TaskData) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            dueDate: t.dueDate,
            reminder: t.reminder ? new Date(t.reminder) : undefined
          }));
          setTasks(loadedTasks);
          
          setTimeout(() => {
            reminderService.checkReminders(loadedTasks);
          }, 3000);
        } catch (error) {
          console.error("Erro ao carregar tarefas:", error);
        }
      }
    };

    loadTasks();
  }, []);

  // Salvar tarefas nos cookies
  useEffect(() => {
    if (!isLoading) {
      Cookies.set("tasks", JSON.stringify(tasks), { expires: 365 });
    }
  }, [tasks, isLoading]);

  // Verificar lembretes periodicamente
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      const interval = setInterval(() => {
        reminderService.checkReminders(tasks);
      }, 1000 * 60 * 60);

      return () => clearInterval(interval);
    }
  }, [tasks, isLoading]);

  // Função para mostrar alertas
  const showAlertMessage = useCallback((message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  }, []);

  // Função para fechar alerta
  const closeAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  // Função para abrir modal de confirmação
  const openModal = useCallback((
    action: "delete" | "complete" | "clear" | "edit" | "deleteSubtask", 
    taskId: string | null, 
    taskName: string,
    subtaskId?: string | null
  ) => {
    setModalAction(action);
    setModalTaskId(taskId);
    setModalTaskName(taskName);
    setModalSubtaskId(subtaskId || null);
    setShowModal(true);
  }, []);

  // Função para fechar modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalAction(null);
    setModalTaskId(null);
    setModalTaskName("");
    setModalSubtaskId(null);
  }, []);

  const shouldConfirm = () => extraConfirmation === true;

  // ADICIONAR TAREFA
  const addTask = () => {
    if (newTask.trim() === "") {
      showAlertMessage("Por favor, digite uma tarefa antes de adicionar.", "warning");
      return;
    }
    
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
    
    // 📝 Adicionar ao histórico
    historyService.addEntry(
      "add",
      task.text,
      task.id,
      `Prioridade: ${task.priority}`
    );
    
    // Notificação
    notificationService.addNotification(
      "📝 Nova tarefa",
      `"${task.text}" foi adicionada`,
      "notification",
      task.id
    );
    
    showAlertMessage("Tarefa adicionada com sucesso!", "success");
  };

  // DELETAR TAREFA
  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (shouldConfirm()) {
      openModal("delete", id, task.text);
    } else {
      // 📝 Adicionar ao histórico ANTES de deletar
      historyService.addEntry(
        "delete",
        task.text,
        task.id,
        "Tarefa removida"
      );
      
      setTasks(tasks.filter(task => task.id !== id));
      notificationService.addNotification(
        "🗑️ Tarefa removida",
        `"${task.text}" foi removida`,
        "notification",
        task.id
      );
      showAlertMessage(`Tarefa "${task.text}" excluída com sucesso!`, "success");
    }
  };

  const confirmDelete = () => {
    if (modalTaskId) {
      const taskName = tasks.find(t => t.id === modalTaskId)?.text || "tarefa";
      
      // 📝 Adicionar ao histórico ANTES de deletar
      historyService.addEntry(
        "delete",
        taskName,
        modalTaskId,
        "Tarefa removida"
      );
      
      setTasks(tasks.filter(task => task.id !== modalTaskId));
      notificationService.addNotification(
        "🗑️ Tarefa removida",
        `"${taskName}" foi removida`,
        "notification",
        modalTaskId
      );
      showAlertMessage(`Tarefa "${taskName}" excluída com sucesso!`, "success");
    }
    closeModal();
  };

  // ALTERNAR TAREFA (Concluir/Reabrir)
  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newStatus } : t
      ));
      
      if (newStatus) {
        // 📝 Adicionar ao histórico
        historyService.addEntry(
          "complete",
          task.text,
          task.id,
          "Tarefa concluída"
        );
        
        notificationService.addNotification(
          "🎉 Tarefa concluída!",
          `"${task.text}" foi concluída`,
          "notification",
          task.id
        );
        showAlertMessage(`Tarefa "${task.text}" concluída! 🎉`, "success");
      } else {
        // 📝 Adicionar ao histórico
        historyService.addEntry(
          "reopen",
          task.text,
          task.id,
          "Tarefa reaberta"
        );
        
        notificationService.addNotification(
          "🔄 Tarefa reaberta",
          `"${task.text}" foi reaberta`,
          "notification",
          task.id
        );
        showAlertMessage(`Tarefa "${task.text}" reaberta!`, "info");
      }
    }
  };

  // EDITAR TAREFA
  const startEdit = (id: string, text: string) => {
    if (shouldConfirm()) {
      openModal("edit", id, text);
    } else {
      setEditingId(id);
      setEditText(text);
    }
  };

  const confirmEdit = () => {
    if (modalTaskId) {
      setEditingId(modalTaskId);
      setEditText(modalTaskName);
    }
    closeModal();
  };

  const saveEdit = (id: string) => {
    if (editText.trim() === "") {
      showAlertMessage("O texto da tarefa não pode estar vazio.", "warning");
      return;
    }
    const task = tasks.find(t => t.id === id);
    const oldText = task?.text || "";
    
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText("");
    
    // 📝 Adicionar ao histórico se houve mudança
    if (oldText !== editText.trim()) {
      historyService.addEntry(
        "edit",
        editText.trim(),
        task?.id,
        `Antigo: "${oldText}"`
      );
    }
    
    notificationService.addNotification(
      "✏️ Tarefa editada",
      `"${task?.text}" foi atualizada`,
      "notification",
      task?.id
    );
    showAlertMessage(`Tarefa "${task?.text}" atualizada!`, "success");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // ALTERAR PRIORIDADE
  const changePriority = (id: string, priority: "baixa" | "media" | "alta") => {
    const task = tasks.find(t => t.id === id);
    const oldPriority = task?.priority || "media";
    
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
    setEditingPriority(null);
    
    // 📝 Adicionar ao histórico se houve mudança
    if (oldPriority !== priority) {
      historyService.addEntry(
        "priority_change",
        task?.text || "Tarefa",
        task?.id,
        `Prioridade: ${oldPriority} → ${priority}`
      );
    }
    
    notificationService.addNotification(
      "🏷️ Prioridade alterada",
      `"${task?.text}" agora é prioridade ${priority}`,
      "notification",
      task?.id
    );
    showAlertMessage(`Prioridade alterada para ${priority}!`, "info");
  };

  // SUBTAREFAS
  const addSubtask = (taskId: string) => {
    if (newSubtask.trim() === "") {
      showAlertMessage("Digite o texto da subtarefa.", "warning");
      return;
    }
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.map(task =>
      task.id === taskId ? {
        ...task,
        subtasks: [
          ...(task.subtasks || []),
          { id: Date.now().toString(), text: newSubtask.trim(), completed: false }
        ]
      } : task
    ));
    
    // 📝 Adicionar ao histórico
    historyService.addEntry(
      "subtask_add",
      newSubtask.trim(),
      taskId,
      `Subtarefa de "${task?.text}"`
    );
    
    setNewSubtask("");
    notificationService.addNotification(
      "📋 Subtarefa adicionada",
      `"${newSubtask.trim()}" adicionada a "${task?.text}"`,
      "notification",
      task?.id
    );
    showAlertMessage("Subtarefa adicionada!", "success");
  };

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

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(st => st.id === subtaskId);
    
    if (subtask && task) {
      if (shouldConfirm()) {
        openModal("deleteSubtask", taskId, subtask.text, subtaskId);
      } else {
        // 📝 Adicionar ao histórico ANTES de deletar
        historyService.addEntry(
          "subtask_delete",
          subtask.text,
          taskId,
          `Subtarefa removida de "${task.text}"`
        );
        
        setTasks(tasks.map(t =>
          t.id === taskId ? {
            ...t,
            subtasks: t.subtasks?.filter(st => st.id !== subtaskId)
          } : t
        ));
        notificationService.addNotification(
          "🗑️ Subtarefa removida",
          `"${subtask.text}" foi removida`,
          "notification",
          task.id
        );
        showAlertMessage(`Subtarefa "${subtask.text}" excluída!`, "success");
      }
    }
  };

  const confirmDeleteSubtask = () => {
    if (modalTaskId && modalSubtaskId) {
      const task = tasks.find(t => t.id === modalTaskId);
      // const subtask = task?.subtasks?.find(st => st.id === modalSubtaskId);
      
      // 📝 Adicionar ao histórico ANTES de deletar
      historyService.addEntry(
        "subtask_delete",
        modalTaskName,
        modalTaskId,
        `Subtarefa removida de "${task?.text}"`
      );
      
      setTasks(tasks.map(t =>
        t.id === modalTaskId ? {
          ...t,
          subtasks: t.subtasks?.filter(st => st.id !== modalSubtaskId)
        } : t
      ));
      
      notificationService.addNotification(
        "🗑️ Subtarefa removida",
        `"${modalTaskName}" foi removida`,
        "notification",
        modalTaskId
      );
      showAlertMessage(`Subtarefa "${modalTaskName}" excluída!`, "success");
    }
    closeModal();
  };

  // NOTAS
  const updateTaskNotes = (taskId: string, notes: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, notes } : task
    ));
  };

  // AÇÕES EM MASSA
  const markAllComplete = () => {
    if (tasks.length === 0) {
      showAlertMessage("Não há tarefas para concluir.", "warning");
      return;
    }

    if (shouldConfirm()) {
      openModal("complete", null, "todas as tarefas");
    } else {
      // 📝 Adicionar ao histórico
      const pendingCount = tasks.filter(t => !t.completed).length;
      historyService.addEntry(
        "complete_all",
        `${pendingCount} tarefas`,
        undefined,
        "Todas as tarefas concluídas"
      );
      
      setTasks(tasks.map(t => ({ ...t, completed: true })));
      notificationService.addNotification(
        "✅ Todas concluídas!",
        "Todas as tarefas foram concluídas",
        "notification"
      );
      showAlertMessage("Todas as tarefas foram concluídas! 🎉", "success");
    }
  };

  const confirmCompleteAll = () => {
    const pendingCount = tasks.filter(t => !t.completed).length;
    
    // 📝 Adicionar ao histórico
    historyService.addEntry(
      "complete_all",
      `${pendingCount} tarefas`,
      undefined,
      "Todas as tarefas concluídas"
    );
    
    setTasks(tasks.map(t => ({ ...t, completed: true })));
    notificationService.addNotification(
      "✅ Todas concluídas!",
      "Todas as tarefas foram concluídas",
      "notification"
    );
    showAlertMessage("Todas as tarefas foram concluídas! 🎉", "success");
    closeModal();
  };

  const clearCompleted = () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
      showAlertMessage("Não há tarefas concluídas para limpar.", "warning");
      return;
    }

    if (shouldConfirm()) {
      openModal("clear", null, `${completedTasks.length} tarefas concluídas`);
    } else {
      // 📝 Adicionar ao histórico
      historyService.addEntry(
        "clear_completed",
        `${completedTasks.length} tarefas`,
        undefined,
        "Tarefas concluídas removidas"
      );
      
      setTasks(tasks.filter(t => !t.completed));
      notificationService.addNotification(
        "🧹 Tarefas removidas",
        `${completedTasks.length} tarefas concluídas foram removidas`,
        "notification"
      );
      showAlertMessage(`${completedTasks.length} tarefas concluídas foram removidas!`, "success");
    }
  };

  const confirmClearCompleted = () => {
    const count = tasks.filter(t => t.completed).length;
    
    // 📝 Adicionar ao histórico
    historyService.addEntry(
      "clear_completed",
      `${count} tarefas`,
      undefined,
      "Tarefas concluídas removidas"
    );
    
    setTasks(tasks.filter(t => !t.completed));
    notificationService.addNotification(
      "🧹 Tarefas removidas",
      `${count} tarefas concluídas foram removidas`,
      "notification"
    );
    showAlertMessage(`${count} tarefas concluídas foram removidas!`, "success");
    closeModal();
  };

  return {
    tasks,
    setTasks,
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
    // Estados do Alarme
    showAlert,
    alertMessage,
    alertType,
    closeAlert,
    // Estados do Modal
    showModal,
    modalAction,
    modalTaskName,
    // Funções
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
    // Confirmações
    confirmDelete,
    confirmEdit,
    confirmCompleteAll,
    confirmClearCompleted,
    confirmDeleteSubtask,
    closeModal,
  };
}