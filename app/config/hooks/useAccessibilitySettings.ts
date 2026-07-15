"use client";

import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS } from "../../../constants/defaultSettings";
import type { Settings } from "../../../types/settings";

import {
  applySettings,
  clearSettings,
  loadSettings,
  saveSettings,
} from "../../../services/accessibility.service";

export function useAccessibilitySettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true); // Começa como true
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setInitialSettings(loadedSettings); // Salva as configurações iniciais
    setIsSaved(true); // Configurações carregadas estão salvas
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      applySettings(settings);
    }
  }, [settings, isLoading]);

  const handleSaveSettings = () => {
    const success = saveSettings(settings);

    if (!success) {
      alert("Erro ao salvar.");
      return;
    }

    setIsSaved(true);
    setInitialSettings(settings); // Atualiza as configurações iniciais
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  const resetToDefaults = () => {
    clearSettings();

    setSettings(DEFAULT_SETTINGS);
    setInitialSettings(DEFAULT_SETTINGS);
    setIsSaved(true); // Resetado para default, está salvo
  };

  const handleFontSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Number(e.target.value),
    }));

    setIsSaved(false);
  };

  const handleLineHeightChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      lineHeight: Number(e.target.value),
    }));

    setIsSaved(false);
  };

  const handleLetterSpacingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      letterSpacing: Number(e.target.value),
    }));

    setIsSaved(false);
  };

  const handleContrastChange = (
    value: Settings["contrastLevel"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      contrastLevel: value,
    }));

    setIsSaved(false);
  };

  const handleNavigationModeChange = (
    value: Settings["navigationMode"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      navigationMode: value,
    }));

    setIsSaved(false);
  };

  const handleExtraConfirmationChange = (
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      extraConfirmation: value,
    }));

    setIsSaved(false);
  };

  const handleNotificationPreferenceChange = (
    value: Settings["notificationPreference"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notificationPreference: value,
    }));

    setIsSaved(false);
  };

  // Verifica se as configurações atuais são diferentes das iniciais (não salvas)
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
  
  // Verifica se as configurações atuais são iguais ao default
  const isDefaultSettings = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);

  return {
    settings,

    isLoading,
    isSaved,
    showSavedMessage,
    isDefaultSettings,
    hasUnsavedChanges, // Novo: indica se há mudanças não salvas

    handleSaveSettings,
    resetToDefaults,

    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,

    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,
  };
}