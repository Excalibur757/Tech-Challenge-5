export interface Settings {// Interface que define as configurações de acessibilidade
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;

    contrastLevel:
        | "normal"
        | "high"
        | "dark";

    navigationMode:
        | "basic"
        | "advanced";

    extraConfirmation: boolean;

    notificationPreference:
        | "reminders"
        | "notifications"
        | "both"
        | "none";
}