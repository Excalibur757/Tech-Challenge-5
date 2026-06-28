"use client";

import Header from "@/components/header";
import { useAccessibilitySettings } from "./hooks/useAccessibilitySettings";
import LoadingScreen from "./components/LoadingScreen";
import ConfigHeader from "./components/ConfigHeader";
import SavedMessage from "./components/SavedMessage";
import TextSettings from "./components/TextSettings";
import ExperienceSettings from "./components/ExperienceSettings";
import PreviewSection from "./components/PreviewSection";
import ActionButtons from "./components/ActionButtons";
import StatusBar from "./components/StatusBar";


export default function Home() {
  // Estados para os controles
  const {
  settings,

  isLoading,
  isSaved,
  showSavedMessage,
  isDefaultSettings,

  handleSaveSettings,
  resetToDefaults,

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
    <main className="min-h-screen dark:bg-black">
      <Header />
      
      {/* // Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
      <ConfigHeader /* Header para as configurações */
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
      />

      <SavedMessage /* Mensagem de configurações salvas */
          visible={showSavedMessage}
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