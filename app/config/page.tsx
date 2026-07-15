// app/configuracoes/page.tsx
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
  const {
    settings,
    isLoading,
    isSaved,
    showSavedMessage,
    isDefaultSettings,
    hasUnsavedChanges, // Nova prop
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
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <ConfigHeader 
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <SavedMessage visible={showSavedMessage} />

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

        <PreviewSection settings={settings} />

        <ActionButtons
          onSave={handleSaveSettings}
          onReset={resetToDefaults}
        />

        <StatusBar
          isSaved={isSaved}
          isDefaultSettings={isDefaultSettings}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </main>
  );
}