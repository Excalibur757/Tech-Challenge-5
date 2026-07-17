"use client";

import { useState } from "react";
import Header from "@/components/header";
import { useAccessibilitySettings } from "./hooks/useAccessibilitySettings";
import LoadingScreen from "./components/LoadingScreen";
import ConfigHeader from "./components/ConfigHeader";
import TextSettings from "./components/TextSettings";
import Alarme from "@/utils/alarme";
import ExperienceSettings from "./components/ExperienceSettings";
import PreviewSection from "./components/PreviewSection";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";
import Botao from "@/utils/botao";
import Modal from "@/utils/modal";

export default function Home() {
  // Estados para os controles
  const {
    settings,

    isLoading,
    isSaved,
    showSavedMessage,
    alertMessage,
    alertType,
    isDefaultSettings,

    handleSaveSettings,
    resetToDefaults,
    hideAlert,
    showWarning,

    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,

    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
  } = useAccessibilitySettings();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null);

  const performSave = () => {
    handleSaveSettings();
  };

  const performReset = () => {
    if (isSaved && isDefaultSettings) {
      showWarning("Não há alterações para serem restauradas");
      return;
    }

    resetToDefaults();
  };

  const attemptSave = () => {
    setPendingAction("save");
    setShowConfirmModal(true);
  };

  const attemptReset = () => {
    setPendingAction("reset");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);

    if (pendingAction === "save") {
      performSave();
    } else if (pendingAction === "reset") {
      performReset();
    }

    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* // Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-start">
          <Botao
            onClick={() => (window.location.href = "/")}
            title="Apertando este botão, você voltará para a home"
          >
            <span className="text-lg">←</span>
            <span>Voltar</span>
          </Botao>
        </div>

      <ConfigHeader /* Header para as configurações */
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
      />

      <Alarme
          visible={showSavedMessage}
          message={alertMessage}
          type={alertType}
          onClose={hideAlert}
      />

      <TextSettings /* Configurações de texto */
          settings={settings}
          handleFontSizeChange={handleFontSizeChange}
          handleLineHeightChange={handleLineHeightChange}
          handleLetterSpacingChange={handleLetterSpacingChange}
      />

      <ExperienceSettings /* Configurações de experiência */
          settings={settings}
          handleContrastChange={handleContrastChange}
          handleNavigationModeChange={handleNavigationModeChange}
          handleExtraConfirmationChange={handleExtraConfirmationChange}
          handleNotificationPreferenceChange={
            handleNotificationPreferenceChange
          }
          />
        {/* Seção de pré-visualização */}
        <PreviewSection settings={settings} /> 

        {/* Botões de Ação */}
        <ActionButtons
          onSave={attemptSave}
          onReset={attemptReset}
        />

        <StatusBar /* Barra de status */
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
        />
      </div>

      <Modal
        visible={showConfirmModal}
        title={pendingAction === "save" ? "Confirmar salvamento" : "Confirmar restauração"}
        description={
          pendingAction === "save"
            ? "Tem certeza de que deseja salvar as alterações nas configurações?"
            : "Tem certeza de que deseja restaurar as configurações para os padrões?"
        }
        confirmLabel={pendingAction === "save" ? "Sim, salvar" : "Sim, restaurar"}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </main>
  );
}