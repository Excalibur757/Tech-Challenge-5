import { Settings } from "../../../types/settings";

interface PreviewSectionProps {
  settings: Settings;
}

export default function PreviewSection({
  settings,
}: PreviewSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">
        Visualização
      </h2>

      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200">
          Este é um exemplo de como o texto será exibido com as configurações
          atuais. Ajuste os controles acima para ver as mudanças em tempo real.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          <strong>Dica:</strong> Para idosos, recomenda-se fontes entre 18-22px,
          espaçamento entre linhas de 1.5 a 2.0 e espaçamento entre letras de
          1-2px para melhor legibilidade.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-blue-800 dark:text-blue-200">
            📖 &quot;A acessibilidade não é um favor, é um direito.&quot;
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            🔔{" "}
            {settings.notificationPreference === "none"
              ? "Notificações desativadas"
              : settings.notificationPreference === "reminders"
              ? "Apenas lembretes serão exibidos"
              : settings.notificationPreference === "notifications"
              ? "Apenas notificações serão exibidas"
              : "Lembretes e notificações serão exibidos"}
          </p>
        </div>
      </div>
    </section>
  );
}