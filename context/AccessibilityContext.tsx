// app/context/AccessibilityContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrastLevel: "normal" | "high" | "dark";
  navigationMode: "basic" | "advanced";
  extraConfirmation: boolean;
  notificationPreference: "reminders" | "notifications" | "both" | "none";
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  contrastLevel: "normal",
  navigationMode: "basic",
  extraConfirmation: false,
  notificationPreference: "both",
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações dos cookies
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = Cookies.get("accessibilitySettings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Aplicar configurações ao DOM sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      // Aplicar fontes
      document.documentElement.style.fontSize = `${settings.fontSize}px`;
      document.documentElement.style.lineHeight = settings.lineHeight.toString();
      document.documentElement.style.letterSpacing = `${settings.letterSpacing}px`;
      
      // Aplicar contraste
      document.documentElement.classList.remove("contrast-normal", "contrast-high", "contrast-dark");
      document.documentElement.classList.add(`contrast-${settings.contrastLevel}`);
    }
  }, [settings, isLoading]);

  // Salvar configurações nos cookies
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      Cookies.set("accessibilitySettings", JSON.stringify(updated), { 
        expires: 365,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    Cookies.set("accessibilitySettings", JSON.stringify(DEFAULT_SETTINGS), { 
      expires: 365,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}