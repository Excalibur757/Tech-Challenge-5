// app/hooks/useAccessibilitySettings.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SETTINGS } from "../../../constants/defaultSettings";
import type { Settings } from "../../../types/settings";
import {
  applySettings,
  clearSettings,
  loadSettings,
  saveSettings,
} from "../../../services/accessibility.service";

interface UseAccessibilitySettingsReturn {
  // Estados
  settings: Settings;
  isLoading: boolean;
  isSaved: boolean;
  showSavedMessage: boolean;
  alertMessage: string;
  alertType: "success" | "error" | "info" | "warning";
  isDefaultSettings: boolean;
  showConfirmModal: boolean;
  pendingAction: "save" | "reset" | null;

  // Ações
  handleSaveSettings: () => void;
  resetToDefaults: () => void;
  hideAlert: () => void;
  showWarning: (message: string) => void;
  
  // Handlers de mudança
  handleFontSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLineHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLetterSpacingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContrastChange: (value: Settings["contrastLevel"]) => void;
  handleNavigationModeChange: (value: Settings["navigationMode"]) => void;
  handleExtraConfirmationChange: (value: boolean) => void;
  handleNotificationPreferenceChange: (value: Settings["notificationPreference"]) => void;

  // Ações do modal
  attemptSave: () => void;
  attemptReset: () => void;
  handleConfirmAction: () => void;
  handleCancelAction: () => void;
  
  // Ações de navegação
  goToHome: () => void;
}

export function useAccessibilitySettings(): UseAccessibilitySettingsReturn {
  // Estados principais
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info" | "warning">("success");
  
  // Estados do modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"save" | "reset" | null>(null);

  // Carregar configurações
  useEffect(() => {
    const loadInitialSettings = async () => {
      const loadedSettings = loadSettings();
      setSettings(loadedSettings);
      setIsSaved(true);
      setIsLoading(false);
    };
    loadInitialSettings();
  }, []);

  // Aplicar configurações ao DOM
  useEffect(() => {
    if (!isLoading) {
      applySettings(settings);
    }
  }, [settings, isLoading]);

  // Verificar se está nas configurações padrão
  const isDefaultSettings = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);

  // Funções de utilidade
  const hideAlert = useCallback(() => {
    setShowSavedMessage(false);
  }, []);

  const showWarning = useCallback((message: string) => {
    setAlertType("warning");
    setAlertMessage(message);
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  }, []);

  const showSuccess = useCallback((message: string) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  }, []);

  const showError = useCallback((message: string) => {
    setAlertType("error");
    setAlertMessage(message);
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  }, []);

  // Handlers de mudança
  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Number(e.target.value),
    }));
    setIsSaved(false);
  }, []);

  const handleLineHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      lineHeight: Number(e.target.value),
    }));
    setIsSaved(false);
  }, []);

  const handleLetterSpacingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      letterSpacing: Number(e.target.value),
    }));
    setIsSaved(false);
  }, []);

  const handleContrastChange = useCallback((value: Settings["contrastLevel"]) => {
    setSettings((prev) => ({
      ...prev,
      contrastLevel: value,
    }));
    setIsSaved(false);
  }, []);

  const handleNavigationModeChange = useCallback((value: Settings["navigationMode"]) => {
    setSettings((prev) => ({
      ...prev,
      navigationMode: value,
    }));
    setIsSaved(false);
  }, []);

  const handleExtraConfirmationChange = useCallback((value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      extraConfirmation: value,
    }));
    setIsSaved(false);
  }, []);

  const handleNotificationPreferenceChange = useCallback((value: Settings["notificationPreference"]) => {
    setSettings((prev) => ({
      ...prev,
      notificationPreference: value,
    }));
    setIsSaved(false);
  }, []);

  // Ações principais
  const handleSaveSettings = useCallback(() => {
    if (isSaved) {
      showWarning("Não há alterações para serem salvas");
      return;
    }

    const success = saveSettings(settings);

    if (!success) {
      showError("Erro ao salvar as configurações.");
      return;
    }

    setIsSaved(true);
    showSuccess("Configurações salvas com sucesso!");
  }, [settings, isSaved, showWarning, showError, showSuccess]);

  const resetToDefaults = useCallback(() => {
    clearSettings();
    setSettings(DEFAULT_SETTINGS);
    setIsSaved(false);
    showSuccess("Configurações restauradas com sucesso!");
  }, [showSuccess]);

  // Ações do modal
  const attemptSave = useCallback(() => {
    setPendingAction("save");
    setShowConfirmModal(true);
  }, []);

  const attemptReset = useCallback(() => {
    if (isSaved && isDefaultSettings) {
      showWarning("Não há alterações para serem restauradas");
      return;
    }
    setPendingAction("reset");
    setShowConfirmModal(true);
  }, [isSaved, isDefaultSettings, showWarning]);

  const handleConfirmAction = useCallback(() => {
    setShowConfirmModal(false);

    if (pendingAction === "save") {
      handleSaveSettings();
    } else if (pendingAction === "reset") {
      resetToDefaults();
    }

    setPendingAction(null);
  }, [pendingAction, handleSaveSettings, resetToDefaults]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmModal(false);
    setPendingAction(null);
  }, []);

  // Navegação
  const goToHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  return {
    // Estados
    settings,
    isLoading,
    isSaved,
    showSavedMessage,
    alertMessage,
    alertType,
    isDefaultSettings,
    showConfirmModal,
    pendingAction,

    // Ações principais
    handleSaveSettings,
    resetToDefaults,
    hideAlert,
    showWarning,

    // Handlers de mudança
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleContrastChange,
    handleNavigationModeChange,
    handleExtraConfirmationChange,
    handleNotificationPreferenceChange,

    // Ações do modal
    attemptSave,
    attemptReset,
    handleConfirmAction,
    handleCancelAction,

    // Navegação
    goToHome,
  };
}