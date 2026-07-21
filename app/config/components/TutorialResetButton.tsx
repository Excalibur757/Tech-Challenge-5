// components/settings/TutorialResetButton.tsx
"use client";

import { useState } from 'react';
import { tutorialService } from '@/services/tutorial.service';
import Modal from '@/utils/modal';

export function TutorialResetButton() {
  const [showModal, setShowModal] = useState(false);

  const handleReset = () => {
    setShowModal(true);
  };

  const confirmReset = () => {
    tutorialService.resetTutorial();
    setShowModal(false);
    // Usar o Alarme para mostrar sucesso (se tiver)
    // Ou simplesmente fechar o modal
  };

  const cancelReset = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
      >
        🔄 Reiniciar Tutorial
      </button>

      <Modal
        visible={showModal}
        title="Reiniciar Tutorial"
        description="Tem certeza que deseja reiniciar o tutorial? Ele aparecerá na próxima vez que você acessar a página inicial."
        confirmLabel="Sim, reiniciar"
        cancelLabel="Cancelar"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </>
  );
}