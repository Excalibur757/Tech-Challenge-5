// components/tasks/TaskFeedback.tsx
"use client";

import Alarme from "@/utils/alarme";
import Modal from "@/utils/modal";

type ModalAction = "delete" | "deleteSubtask" | "edit" | "complete" | "clear" | null;

interface TaskFeedbackProps {
  // Alarme
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error" | "info" | "warning";
  closeAlert: () => void;
  
  // Modal
  showModal: boolean;
  modalAction: ModalAction;
  modalTaskName: string;
  closeModal: () => void;
  
  // Confirm handlers
  confirmDelete: () => void;
  confirmDeleteSubtask: () => void;
  confirmEdit: () => void;
  confirmCompleteAll: () => void;
  confirmClearCompleted: () => void;
}

export function TaskFeedback({
  showAlert,
  alertMessage,
  alertType,
  closeAlert,
  showModal,
  modalAction,
  modalTaskName,
  closeModal,
  confirmDelete,
  confirmDeleteSubtask,
  confirmEdit,
  confirmCompleteAll,
  confirmClearCompleted,
}: TaskFeedbackProps) {
  // Configurar título e descrição do modal baseado na ação
  const getModalConfig = () => {
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
  };

  // Função para lidar com a confirmação do modal
  const handleModalConfirm = () => {
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
  };

  const modalConfig = getModalConfig();

  return (
    <>
      <Alarme
        visible={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={closeAlert}
        autoHideMs={4000}
      />

      <Modal
        visible={showModal}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmLabel={modalConfig.confirmLabel}
        cancelLabel="Cancelar"
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
      />
    </>
  );
}