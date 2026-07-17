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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");

  useEffect(() => {
    setSettings(loadSettings());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      applySettings(settings);
    }
  }, [settings, isLoading]);

  const hideAlert = () => {
    setShowSavedMessage(false);
  };

  const handleSaveSettings = () => {
    const success = saveSettings(settings);

    if (!success) {
      setAlertType("error");
      setAlertMessage("Erro ao salvar.");
      setShowSavedMessage(true);
      return;
    }

    setIsSaved(true);
    setAlertType("success");
    setAlertMessage("Configurações salvas com sucesso!");
    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  const resetToDefaults = () => {
    clearSettings();

    setSettings(DEFAULT_SETTINGS);
    setIsSaved(false);
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

  const isDefaultSettings =
    JSON.stringify(settings) ===
    JSON.stringify(DEFAULT_SETTINGS);

  return {
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
  };
}