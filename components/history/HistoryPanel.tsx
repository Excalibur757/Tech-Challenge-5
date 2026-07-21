/* eslint-disable */
"use client";

import { useState, useEffect } from 'react';
import { historyService, HistoryEntry } from '@/services/history.service';
import Modal from '@/utils/modal';

export function HistoryPanel() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<HistoryEntry["action"] | "all">("all");
  const [stats, setStats] = useState({ total: 0, todayActivities: 0 });
  
  // Estado para o Modal de confirmação
  const [showClearModal, setShowClearModal] = useState(false);

  // components/history/HistoryPanel.tsx
  useEffect(() => {
    const loadHistory = () => {
      setHistory(historyService.getHistory());
      setStats(historyService.getStats());
    };

    loadHistory();

    const unsubscribe = historyService.subscribe((newHistory) => {
      setHistory(newHistory);
      setStats(historyService.getStats());
    });

    return () => unsubscribe();
  }, []);

  const getActionIcon = (action: HistoryEntry["action"]) => {
    const icons = {
      add: "📝",
      complete: "✅",
      reopen: "🔄",
      delete: "🗑️",
      edit: "✏️",
      priority_change: "🏷️",
      subtask_add: "📋",
      subtask_delete: "🗑️",
      clear_completed: "🧹",
      complete_all: "🎉"
    };
    return icons[action] || "📌";
  };

  const getActionLabel = (action: HistoryEntry["action"]) => {
    const labels = {
      add: "Adicionou",
      complete: "Concluiu",
      reopen: "Reabriu",
      delete: "Removeu",
      edit: "Editou",
      priority_change: "Mudou prioridade",
      subtask_add: "Adicionou subtarefa",
      subtask_delete: "Removeu subtarefa",
      clear_completed: "Removeu concluídas",
      complete_all: "Concluiu todas"
    };
    return labels[action] || action;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const filteredHistory = filter === "all" 
    ? history 
    : history.filter(entry => entry.action === filter);

  const actions = ["all", "add", "complete", "reopen", "delete", "edit", "priority_change"];

  // Função para abrir o modal de confirmação
  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  // Função para confirmar a limpeza
  const confirmClearHistory = () => {
    historyService.clearHistory();
    setShowClearModal(false);
  };

  // Função para cancelar a limpeza
  const cancelClearHistory = () => {
    setShowClearModal(false);
  };

  return (
    <div className="relative">
      {/* Botão do Histórico */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Histórico"
      >
        <span className="text-xl sm:text-2xl">📜</span>
        {history.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] sm:text-xs font-bold rounded-full min-w-4.5 sm:min-w-5 h-4.5 sm:h-5 px-1 flex items-center justify-center">
            {history.length > 99 ? '99+' : history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsOpen(false)}/>

          {/* Painel do Histórico */}
          <div
            className="
                fixed
                left-1/2
                -translate-x-1/2
                w-[calc(100vw-2rem)]
                max-w-md
                bg-white
                dark:bg-gray-800
                rounded-lg
                shadow-xl
                border
                border-gray-200
                dark:border-gray-700
                z-50
                max-h-[85vh]
                overflow-hidden

                sm:absolute
                sm:top-auto
                sm:left-auto
                sm:right-0
                sm:mt-2
                sm:translate-x-0
                sm:translate-y-0
                sm:w-95
                md:w-112.5
                sm:max-w-112.5
                sm:max-h-150
            "
            >      
            {/* Cabeçalho */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <span>📜 Histórico</span>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    {history.length} atividades
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Hoje: {stats.todayActivities}
                  </span>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline whitespace-nowrap"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              {/* Filtros - Scroll horizontal em mobile */}
              <div className="flex flex-nowrap sm:flex-wrap gap-1 mt-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {actions.map((action) => (
                  <button
                    key={action}
                    onClick={() => setFilter(action as any)}
                    className={`px-2 py-0.5 rounded text-[10px] sm:text-xs transition-colors whitespace-nowrap shrink-0 ${
                      filter === action
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {action === "all" ? "Todas" : getActionLabel(action as HistoryEntry["action"])}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de histórico */}
            <div className="overflow-y-auto max-h-[calc(80vh-160px)] sm:max-h-100">
              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <span className="text-4xl block mb-2">📭</span>
                  <p className="text-sm">Nenhuma atividade registrada</p>
                </div>
              ) : (
                filteredHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl shrink-0 mt-0.5">
                        {getActionIcon(entry.action)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                            {getActionLabel(entry.action)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {entry.taskName}
                          </span>
                        </div>
                        {entry.details && (
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {entry.details}
                          </p>
                        )}
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 w-full sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmação para limpar histórico */}
      <Modal
        visible={showClearModal}
        title="Limpar Histórico"
        description="Tem certeza que deseja limpar todo o histórico de atividades? Esta ação não pode ser desfeita."
        confirmLabel="Sim, limpar tudo"
        cancelLabel="Cancelar"
        onConfirm={confirmClearHistory}
        onCancel={cancelClearHistory}
      />
    </div>
  );
}