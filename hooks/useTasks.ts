// hooks/useTasks.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { notificationService } from '@/services/notification.service';

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
  const [modalSubtaskId, setModalSubtaskId] = useState<string | null>(null); // Para subtarefas

  // Carregar tarefas dos cookies
  useEffect(() => {
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
  }, []);

  // Salvar tarefas nos cookies
  useEffect(() => {
    if (!isLoading) {
      Cookies.set("tasks", JSON.stringify(tasks), { expires: 365 });
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

  // const addTask = () => {
  //   if (newTask.trim() === "") {
  //     showAlertMessage("Por favor, digite uma tarefa antes de adicionar.", "warning");
  //     return;
  //   }
    
  //   const task: Task = {
  //     id: Date.now().toString(),
  //     text: newTask.trim(),
  //     completed: false,
  //     createdAt: new Date(),
  //     priority: newTaskPriority,
  //     subtasks: [],
  //   };
    
  //   setTasks([task, ...tasks]);
  //   setNewTask("");
  //   setNewTaskPriority("media");
  //   showAlertMessage("Tarefa adicionada com sucesso!", "success");
  // };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (shouldConfirm()) {
      openModal("delete", id, task.text);
    } else {
      setTasks(tasks.filter(task => task.id !== id));
      showAlertMessage(`Tarefa "${task.text}" excluída com sucesso!`, "success");
    }
  };

  const confirmDelete = () => {
    if (modalTaskId) {
      const taskName = tasks.find(t => t.id === modalTaskId)?.text || "tarefa";
      setTasks(tasks.filter(task => task.id !== modalTaskId));
      showAlertMessage(`Tarefa "${taskName}" excluída com sucesso!`, "success");
    }
    closeModal();
  };

  // const toggleTask = (id: string) => {
  //   const task = tasks.find(t => t.id === id);
  //   if (task) {
  //     const newStatus = !task.completed;
  //     setTasks(tasks.map(t =>
  //       t.id === id ? { ...t, completed: newStatus } : t
  //     ));
  //     showAlertMessage(
  //       newStatus ? `Tarefa "${task.text}" concluída! 🎉` : `Tarefa "${task.text}" reaberta!`,
  //       newStatus ? "success" : "info"
  //     );
  //   }
  // };

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
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText("");
    showAlertMessage(`Tarefa "${task?.text}" atualizada!`, "success");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const changePriority = (id: string, priority: "baixa" | "media" | "alta") => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
    setEditingPriority(null);
    showAlertMessage(`Prioridade alterada para ${priority}!`, "info");
  };

  const addSubtask = (taskId: string) => {
    if (newSubtask.trim() === "") {
      showAlertMessage("Digite o texto da subtarefa.", "warning");
      return;
    }
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

  // Função para deletar subtarefa (atualizada)
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(st => st.id === subtaskId);
    
    if (subtask && task) {
      if (shouldConfirm()) {
        openModal("deleteSubtask", taskId, subtask.text, subtaskId);
      } else {
        setTasks(tasks.map(t =>
          t.id === taskId ? {
            ...t,
            subtasks: t.subtasks?.filter(st => st.id !== subtaskId)
          } : t
        ));
        showAlertMessage(`Subtarefa "${subtask.text}" excluída!`, "success");
      }
    }
  };

  // Confirmar exclusão de subtarefa
  const confirmDeleteSubtask = () => {
    if (modalTaskId && modalSubtaskId) {
      const task = tasks.find(t => t.id === modalTaskId);
      const subtask = task?.subtasks?.find(st => st.id === modalSubtaskId);
      
      setTasks(tasks.map(t =>
        t.id === modalTaskId ? {
          ...t,
          subtasks: t.subtasks?.filter(st => st.id !== modalSubtaskId)
        } : t
      ));
      
      showAlertMessage(`Subtarefa "${modalTaskName}" excluída!`, "success");
    }
    closeModal();
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, notes } : task
    ));
  };

  const markAllComplete = () => {
    if (tasks.length === 0) {
      showAlertMessage("Não há tarefas para concluir.", "warning");
      return;
    }

    if (shouldConfirm()) {
      openModal("complete", null, "todas as tarefas");
    } else {
      setTasks(tasks.map(t => ({ ...t, completed: true })));
      showAlertMessage("Todas as tarefas foram concluídas! 🎉", "success");
    }
  };

  const confirmCompleteAll = () => {
    setTasks(tasks.map(t => ({ ...t, completed: true })));
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
      setTasks(tasks.filter(t => !t.completed));
      showAlertMessage(`${completedTasks.length} tarefas concluídas foram removidas!`, "success");
    }
  };

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
    
    // Notificação
    notificationService.addNotification(
      "📝 Nova tarefa",
      `"${task.text}" foi adicionada`,
      "notification",
      task.id
    );
    
    showAlertMessage("Tarefa adicionada com sucesso!", "success");
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newStatus } : t
      ));
      
      if (newStatus) {
        notificationService.addNotification(
          "🎉 Tarefa concluída!",
          `"${task.text}" foi concluída`,
          "notification",
          task.id
        );
        showAlertMessage(`Tarefa "${task.text}" concluída! 🎉`, "success");
      } else {
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

  // Verificar lembretes de tarefas com data
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        
        // Se vence amanhã
        if (dueDate.toDateString() === tomorrow.toDateString()) {
          notificationService.addNotification(
            "⏰ Tarefa vence amanhã!",
            `"${task.text}" precisa ser concluída até amanhã`,
            "reminder",
            task.id
          );
        }
        
        // Se já passou da data
        if (dueDate < now && !task.completed) {
          notificationService.addNotification(
            "⚠️ Tarefa atrasada!",
            `"${task.text}" está atrasada!`,
            "reminder",
            task.id
          );
        }
      }
    });
  }, [tasks]);

  const confirmClearCompleted = () => {
    const count = tasks.filter(t => t.completed).length;
    setTasks(tasks.filter(t => !t.completed));
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
    confirmDeleteSubtask, // Nova
    closeModal,
  };
}