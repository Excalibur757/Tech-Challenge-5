// services/history.service.ts
"use client";

export interface HistoryEntry {
  id: string;
  action: "add" | "complete" | "reopen" | "delete" | "edit" | "priority_change" | "subtask_add" | "subtask_delete" | "clear_completed" | "complete_all";
  taskId?: string;
  taskName: string;
  details?: string;
  timestamp: Date;
}

class HistoryService {
  private static instance: HistoryService;
  private history: HistoryEntry[] = [];
  private listeners: ((history: HistoryEntry[]) => void)[] = [];
  private readonly MAX_HISTORY = 100; // Limitar a 100 itens

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadHistory();
    }
  }

  static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  private loadHistory() {
    try {
      const saved = localStorage.getItem("taskHistory");
      if (saved) {
        this.history = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }

  private saveHistory() {
    try {
      localStorage.setItem("taskHistory", JSON.stringify(this.history));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getHistory()));
  }

  // Adicionar entrada ao histórico
  addEntry(
    action: HistoryEntry["action"],
    taskName: string,
    taskId?: string,
    details?: string
  ) {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      action,
      taskId,
      taskName,
      details,
      timestamp: new Date()
    };

    this.history.unshift(entry); // Adicionar no início

    // Limitar tamanho do histórico
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(0, this.MAX_HISTORY);
    }

    this.saveHistory();
    this.notifyListeners();
    return entry;
  }

  // Obter histórico completo
  getHistory(): HistoryEntry[] {
    return this.history;
  }

  // Obter histórico filtrado por ação
  getHistoryByAction(action: HistoryEntry["action"]): HistoryEntry[] {
    return this.history.filter(entry => entry.action === action);
  }

  // Obter histórico de uma tarefa específica
  getHistoryByTask(taskId: string): HistoryEntry[] {
    return this.history.filter(entry => entry.taskId === taskId);
  }

  // Limpar histórico
  clearHistory() {
    this.history = [];
    this.saveHistory();
    this.notifyListeners();
  }

  // Remover entrada específica
  removeEntry(id: string) {
    this.history = this.history.filter(entry => entry.id !== id);
    this.saveHistory();
    this.notifyListeners();
  }

  // Inscrever para atualizações
  subscribe(listener: (history: HistoryEntry[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Obter estatísticas do histórico
  getStats() {
    const total = this.history.length;
    const actions = this.history.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivities = this.history.filter(entry => 
      entry.timestamp >= today
    ).length;

    return {
      total,
      todayActivities,
      actions,
      mostCommonAction: Object.entries(actions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhuma'
    };
  }
}

export const historyService = HistoryService.getInstance();