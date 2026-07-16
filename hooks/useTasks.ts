// app/hooks/useTasks.ts
"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface Task {
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

  const shouldConfirm = () => extraConfirmation === true;

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

  const deleteTask = (id: string) => {
    const taskName = tasks.find(t => t.id === id)?.text || "esta tarefa";
    
    if (shouldConfirm()) {
      if (confirm(`Tem certeza que deseja excluir "${taskName}"?`)) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: newStatus } : t
      ));
    }
  };

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

  const saveEdit = (id: string) => {
    if (editText.trim() === "") return;
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText("");
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
  };

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

  const markAllComplete = () => {
    if (shouldConfirm()) {
      if (confirm("Marcar todas as tarefas como concluídas?")) {
        setTasks(tasks.map(t => ({ ...t, completed: true })));
      }
    } else {
      setTasks(tasks.map(t => ({ ...t, completed: true })));
    }
  };

  const clearCompleted = () => {
    if (shouldConfirm()) {
      if (confirm("Remover todas as tarefas concluídas?")) {
        setTasks(tasks.filter(t => !t.completed));
      }
    } else {
      setTasks(tasks.filter(t => !t.completed));
    }
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
  setTasks(tasks.map(task =>
    task.id === taskId ? { ...task, notes } : task
  ));
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
  };
}