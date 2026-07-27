// app/hooks/useAccessibilitySettings.ts
"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useAccessibilitySettings() {
  const [extraConfirmation, setExtraConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<"simplificado" | "completo">("simplificado");
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = Cookies.get("accessibilitySettings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setExtraConfirmation(parsed.extraConfirmation || false);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }

      const savedMode = Cookies.get("todoMode");
      if (savedMode === "simplificado" || savedMode === "completo") {
        setMode(savedMode);
      }

      setIsLoading(false);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Cookies.set("todoMode", mode, { expires: 365 });
    }
  }, [mode, isLoading]);

  const toggleMode = () => {
    const newMode = mode === "simplificado" ? "completo" : "simplificado";
    setMode(newMode);
  };

  return {
    extraConfirmation,
    setExtraConfirmation,
    isLoading,
    setIsLoading,
    mode,
    setMode,
    toggleMode,
  };
}
/* eslint-enable no-console */