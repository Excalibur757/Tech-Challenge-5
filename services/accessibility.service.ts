import Cookies from "js-cookie";
import { Settings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";

const COOKIE_NAME = "accessibilitySettings";
const STORAGE_NAME = "accessibilitySettings";

export function loadSettings(): Settings {// Função para carregar as configurações de acessibilidade do Cookie ou LocalStorage
    try {

        // 1 - Tenta carregar do Cookie
        const cookie = Cookies.get(COOKIE_NAME);

        if (cookie) {
            const settings: Settings = JSON.parse(cookie);

            // Se o LocalStorage sumiu, recria
            if (!localStorage.getItem(STORAGE_NAME)) {
                localStorage.setItem(
                    STORAGE_NAME,
                    JSON.stringify(settings)
                );
            }

            return settings;
        }

        // 2 - Tenta carregar do LocalStorage
        const local = localStorage.getItem(STORAGE_NAME);

        if (local) {
            const settings: Settings = JSON.parse(local);

            // Se o Cookie sumiu, recria
            Cookies.set(COOKIE_NAME, JSON.stringify(settings), {
                expires: 365,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            return settings;
        }

        // 3 - Se não encontrou em nenhum lugar, retorna as configurações padrão
        return DEFAULT_SETTINGS;

    } catch (error) {
        console.error(error);
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings: Settings): boolean { // Função para salvar as configurações de acessibilidade no Cookie e LocalStorage
  try {
    Cookies.set(COOKIE_NAME, JSON.stringify(settings), {
      expires: 365,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    localStorage.setItem(
      STORAGE_NAME,
      JSON.stringify(settings)
    );

    return true;
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return false;
  }
}

export function applySettings(settings: Settings): void { // Função para aplicar as configurações de acessibilidade ao documento
  document.documentElement.style.fontSize = `${settings.fontSize}px`;
  document.documentElement.style.lineHeight = settings.lineHeight.toString();
  document.documentElement.style.letterSpacing = `${settings.letterSpacing}px`;

  document.documentElement.classList.remove(
    "contrast-normal",
    "contrast-high",
    "contrast-dark"
  );

  document.documentElement.classList.add(
    `contrast-${settings.contrastLevel}`
  );
}

export function clearSettings() {// Função para limpar as configurações de acessibilidade do Cookie e LocalStorage
  Cookies.remove(COOKIE_NAME);

  localStorage.removeItem(STORAGE_NAME);
}