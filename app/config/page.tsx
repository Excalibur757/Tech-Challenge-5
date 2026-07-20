// app/configuracoes/page.tsx
"use client";

import Header from "@/components/header";
import { useAccessibilitySettings } from "./hooks/useAccessibilitySettings";
import LoadingScreen from "../../components/LoadingScreen";
import ConfigHeader from "./components/ConfigHeader";
import TextSettings from "./components/TextSettings";
import Alarme from "@/utils/alarme";
import ExperienceSettings from "./components/ExperienceSettings";
import PreviewSection from "./components/PreviewSection";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";
import Botao from "@/utils/botao";
import Modal from "@/utils/modal";
import { TutorialConfig } from "./components/TutorialConfig";

export default function ConfiguracoesPage() {
  const {
    settings,
    isLoading,
    isSaved,
    showSavedMessage,
    alertMessage,
    alertType,
    isDefaultSettings,
    showConfirmModal,
    pendingAction,
    handleSaveSettings,
    resetToDefaults,
    hideAlert,
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
    attemptSave,
    attemptReset,
    handleConfirmAction,
    handleCancelAction,
    goToHome,
  } = useAccessibilitySettings();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-start">
          <Botao
            onClick={goToHome}
            title="Apertando este botão, você voltará para a home"
          >
            <span className="text-lg">←</span>
            <span>Voltar</span>
          </Botao>
        </div>

        <ConfigHeader
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
        />

        <Alarme
          visible={showSavedMessage}
          message={alertMessage}
          type={alertType}
          onClose={hideAlert}
        />

        <TextSettings
          settings={settings}
          handleFontSizeChange={handleFontSizeChange}
          handleLineHeightChange={handleLineHeightChange}
          handleLetterSpacingChange={handleLetterSpacingChange}
        />

        <ExperienceSettings
          settings={settings}
          handleContrastChange={handleContrastChange}
          handleNavigationModeChange={handleNavigationModeChange}
          handleExtraConfirmationChange={handleExtraConfirmationChange}
          handleNotificationPreferenceChange={handleNotificationPreferenceChange}
        />

        <TutorialConfig />

        <PreviewSection settings={settings} />

        <ActionButtons
          onSave={attemptSave}
          onReset={attemptReset}
        />

        <StatusBar
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