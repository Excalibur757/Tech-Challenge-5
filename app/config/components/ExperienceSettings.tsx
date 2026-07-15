// app/components/ExperienceSettings.tsx
"use client";

import type { Settings } from "../../../types/settings";

interface ExperienceSettingsProps {
  settings: Settings;
  handleContrastChange: (value: Settings["contrastLevel"]) => void;
  handleNavigationModeChange: (value: Settings["navigationMode"]) => void;
  handleExtraConfirmationChange: (value: boolean) => void;
  handleNotificationPreferenceChange: (value: Settings["notificationPreference"]) => void;
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
        🎨 Configurações de Experiência
      </h2>

      {/* 💡 Dica: Contraste mais alto ajuda pessoas com baixa visão */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Nível de Contraste
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Escolha o contraste que facilita a leitura para você
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "normal", label: "Normal", description: "Cores padrão" },
            { value: "high", label: "Alto", description: "Maior contraste" },
            { value: "dark", label: "Escuro", description: "Fundo escuro" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleContrastChange(option.value as Settings["contrastLevel"])}
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.contrastLevel === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
              title={option.description}
            >
              <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
              <p className="text-xs text-gray-400 dark:text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 💡 Dica: Confirmar antes de ações importantes evita erros */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Necessidade de Confirmação Extra
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Quando ativado, você será perguntado antes de excluir ou editar tarefas
        </p>
        <div className="flex gap-4">
          {[
            { value: true, label: "Sim", description: "Perguntar antes de ações" },
            { value: false, label: "Não", description: "Ações diretas" },
          ].map((option) => (
            <button
              key={String(option.value)}
              onClick={() => handleExtraConfirmationChange(option.value)}
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                settings.extraConfirmation === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
              title={option.description}
            >
              <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
              <p className="text-xs text-gray-400 dark:text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {settings.extraConfirmation 
            ? "✅ Você será perguntado antes de ações importantes" 
            : "❌ Ações serão executadas sem confirmação extra"}
        </p>
      </div>

      {/* 💡 Dica: Escolha como quer receber lembretes e notificações */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 dark:text-gray-300 block">
          Lembretes e Notificações
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Escolha como deseja ser notificado sobre suas tarefas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "reminders", label: "📅 Apenas Lembretes", description: "Receba lembretes" },
            { value: "notifications", label: "🔔 Apenas Notificações", description: "Receba notificações" },
            { value: "both", label: "📅🔔 Ambos", description: "Receba tudo" },
            { value: "none", label: "🔕 Nenhum", description: "Sem notificações" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleNotificationPreferenceChange(option.value as Settings["notificationPreference"])}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                settings.notificationPreference === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}
              title={option.description}
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              <p className="text-xs text-gray-400 dark:text-gray-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}