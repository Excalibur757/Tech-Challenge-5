// hooks/useTaskModal.ts
"use client";

import { useMemo, useCallback } from "react";

type ModalAction = "delete" | "deleteSubtask" | "edit" | "complete" | "clear" | null;

interface UseTaskModalProps {
  modalAction: ModalAction;
  modalTaskName: string;
  confirmDelete: () => void;
  confirmDeleteSubtask: () => void;
  confirmEdit: () => void;
  confirmCompleteAll: () => void;
  confirmClearCompleted: () => void;
  closeModal: () => void;
}

export function useTaskModal({
  modalAction,
  modalTaskName,
  confirmDelete,
  confirmDeleteSubtask,
  confirmEdit,
  confirmCompleteAll,
  confirmClearCompleted,
  closeModal,
}: UseTaskModalProps) {
  const modalConfig = useMemo(() => {
    switch (modalAction) {
      case "delete":
        return {
          title: "Confirmar exclusão",
          description: `Tem certeza que deseja excluir a tarefa "${modalTaskName}"?`,
          confirmLabel: "Sim, excluir",
        };
      case "deleteSubtask":
        return {
          title: "Confirmar exclusão",
          description: `Tem certeza que deseja excluir a subtarefa "${modalTaskName}"?`,
          confirmLabel: "Sim, excluir",
        };
      case "edit":
        return {
          title: "Confirmar edição",
          description: `Deseja editar a tarefa "${modalTaskName}"?`,
          confirmLabel: "Sim, editar",
        };
      case "complete":
        return {
          title: "Confirmar ação",
          description: "Tem certeza que deseja marcar todas as tarefas como concluídas?",
          confirmLabel: "Sim, concluir todas",
        };
      case "clear":
        return {
          title: "Confirmar limpeza",
          description: `Tem certeza que deseja remover todas as tarefas concluídas? (${modalTaskName})`,
          confirmLabel: "Sim, remover",
        };
      default:
        return {
          title: "Confirmar",
          description: "Tem certeza que deseja realizar esta ação?",
          confirmLabel: "Confirmar",
        };
    }
  }, [modalAction, modalTaskName]);

  const handleModalConfirm = useCallback(() => {
    switch (modalAction) {
      case "delete":
        confirmDelete();
        break;
      case "deleteSubtask":
        confirmDeleteSubtask();
        break;
      case "edit":
        confirmEdit();
        break;
      case "complete":
        confirmCompleteAll();
        break;
      case "clear":
        confirmClearCompleted();
        break;
      default:
        closeModal();
    }
  }, [modalAction, confirmDelete, confirmDeleteSubtask, confirmEdit, confirmCompleteAll, confirmClearCompleted, closeModal]);

  return {
    modalConfig,
    handleModalConfirm,
  };
}