import { Settings } from "../types/settings";
// Configurações padrão para acessibilidade, caso não haja configurações salvas no Cookie ou LocalStorage
export const DEFAULT_SETTINGS: Settings = {
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    contrastLevel: "normal",
    navigationMode: "basic",
    extraConfirmation: false,
    notificationPreference: "both",
};
