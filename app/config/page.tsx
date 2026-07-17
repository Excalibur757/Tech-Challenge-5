"use client";

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

  handleFontSizeChange,
  handleLineHeightChange,
  handleLetterSpacingChange,

  handleContrastChange,
  handleNavigationModeChange,
  handleExtraConfirmationChange,
  handleNotificationPreferenceChange,
} = useAccessibilitySettings();
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
          onSave={handleSaveSettings}
          onReset={resetToDefaults}
        />

        <StatusBar /* Barra de status */
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
        />
      </div>
    </main>
  );
}