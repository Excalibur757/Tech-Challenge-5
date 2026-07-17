import { Settings } from "../../../types/settings";

interface ExperienceSettingsProps {
  settings: Settings;

  handleContrastChange: (
    value: Settings["contrastLevel"]
  ) => void;

  handleNavigationModeChange: (
    value: Settings["navigationMode"]
  ) => void;

  handleExtraConfirmationChange: (
    value: boolean
  ) => void;

  handleNotificationPreferenceChange: (
    value: Settings["notificationPreference"]
  ) => void;
}

export default function ExperienceSettings({
  settings,
  handleContrastChange,
  handleNavigationModeChange,
  handleExtraConfirmationChange,
  handleNotificationPreferenceChange,
}: ExperienceSettingsProps) {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">
        Configurações de Experiência
      </h2>

      {/* Contraste */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Nível de Contraste
        </label>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "normal", label: "Normal" },
            { value: "high", label: "Alto" },
            { value: "dark", label: "Escuro" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                handleContrastChange(
                  option.value as Settings["contrastLevel"]
                )
              }
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.contrastLevel === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
            >
              <span className="text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Confirmação Extra */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Necessidade de Confirmação Extra Em Sua Lista de Tarefas?
        </label>

        <div className="flex gap-4">
          {[
            { value: true, label: "Sim" },
            { value: false, label: "Não" },
          ].map((option) => (
            <button
              key={String(option.value)}
              onClick={() =>
                handleExtraConfirmationChange(option.value)
              }
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                settings.extraConfirmation === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
            >
              <span className="text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {settings.extraConfirmation
            ? "✅ Solicitar confirmação antes de ações importantes"
            : "❌ Ações serão executadas sem confirmação extra"}
        </p>
      </div>

      {/* Preferências de Notificação */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Lembretes e Notificações
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              value: "reminders",
              label: "Apenas Lembretes",
            },
            {
              value: "notifications",
              label: "Apenas Notificações",
            },
            {
              value: "both",
              label: "Ambos",
            },
            {
              value: "none",
              label: "Nenhum",
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                handleNotificationPreferenceChange(
                  option.value as Settings["notificationPreference"]
                )
              }
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.notificationPreference === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}