// services/reminder.service.ts
"use client";

import { notificationService } from './notification.service';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority?: "baixa" | "media" | "alta";
  dueDate?: string;
  notes?: string;
  subtasks?: { id: string; text: string; completed: boolean }[];
}

class ReminderService {
  private static instance: ReminderService;
  private checkedTasks = new Set<string>();
  private lastCheck: Date | null = null;

  private constructor() {}

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  /**
   * Verifica e dispara lembretes baseados em regras
   */
  checkReminders(tasks: Task[]) {
    const now = new Date();
    
    // Verificar a cada 6 horas
    if (this.lastCheck) {
      const hoursDiff = (now.getTime() - this.lastCheck.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 6) return;
    }
    
    this.lastCheck = now;
    const pendingTasks = tasks.filter(t => !t.completed);

    // 1. Tarefas antigas (mais de 3 dias)
    this.checkOldTasks(pendingTasks, now);
    
    // 2. Tarefas de alta prioridade paradas (2 dias)
    this.checkHighPriorityTasks(pendingTasks, now);
    
    // 3. Tarefas abandonadas (sem subtarefas por 5 dias)
    this.checkAbandonedTasks(pendingTasks, now);
    
    // 4. Progresso geral
    this.checkProgress(tasks);

    // Limpar cache
    this.checkedTasks.clear();
  }

  /**
   * Tarefas antigas não concluídas (3+ dias)
   */
  private checkOldTasks(tasks: Task[], now: Date) {
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      if (taskDate < threeDaysAgo && !this.checkedTasks.has(task.id)) {
        notificationService.addNotification(
          "⏰ Tarefa antiga!",
          `"${task.text}" está pendente há mais de 3 dias`,
          "reminder",
          task.id
        );
        this.checkedTasks.add(task.id);
      }
    });
  }

  /**
   * Tarefas de alta prioridade paradas (2+ dias)
   */
  private checkHighPriorityTasks(tasks: Task[], now: Date) {
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    tasks.forEach(task => {
      if (task.priority === "alta") {
        const taskDate = new Date(task.createdAt);
        if (taskDate < twoDaysAgo && !this.checkedTasks.has(task.id)) {
          notificationService.addNotification(
            "🔴 Tarefa prioritária parada!",
            `"${task.text}" é alta prioridade e está parada há 2 dias`,
            "reminder",
            task.id
          );
          this.checkedTasks.add(task.id);
        }
      }
    });
  }

  /**
   * Tarefas abandonadas (5+ dias sem interação)
   */
  private checkAbandonedTasks(tasks: Task[], now: Date) {
    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      if (taskDate < fiveDaysAgo && !this.checkedTasks.has(task.id)) {
        // Verificar se tem subtarefas
        const hasSubtasks = task.subtasks && task.subtasks.length > 0;
        const allSubtasksDone = task.subtasks?.every(st => st.completed) ?? false;
        
        // Se não tem subtarefas ou todas estão concluídas mas a principal não
        if (!hasSubtasks || allSubtasksDone) {
          notificationService.addNotification(
            "📌 Tarefa abandonada!",
            `"${task.text}" está parada há 5 dias. Que tal dar atenção a ela?`,
            "reminder",
            task.id
          );
          this.checkedTasks.add(task.id);
        }
      }
    });
  }

  /**
   * Verificar progresso geral
   */
  private checkProgress(tasks: Task[]) {
    if (tasks.length === 0) return;

    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percentage = Math.round((completed / total) * 100);

    // Metas de progresso
    if (percentage === 100) {
      notificationService.addNotification(
        "🎉 Todas as tarefas concluídas!",
        `Parabéns! Você concluiu todas as ${total} tarefas!`,
        "reminder"
      );
    } else if (percentage >= 75 && percentage < 80) {
      notificationService.addNotification(
        "🚀 Quase lá!",
        `Você já concluiu ${percentage}% das tarefas. Continue assim!`,
        "reminder"
      );
    }
  }

  /**
   * Reset do último check (útil para testes)
   */
  resetCheck() {
    this.lastCheck = null;
    this.checkedTasks.clear();
  }
}

export const reminderService = ReminderService.getInstance();

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // @ts-ignore
  window.__reminderService = reminderService;
  console.log('🔔 reminderService disponível em window.__reminderService');
}