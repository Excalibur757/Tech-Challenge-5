interface StatusBarProps {
  isSaved: boolean;
  isDefaultSettings: boolean;
}

export default function StatusBar({
  isSaved,
  isDefaultSettings,
}: StatusBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-sm border-t dark:border-gray-700 pt-4">
      <div className="text-black dark:text-black">
        <p>
          📌 Status:{" "}
          {isSaved
            ? "Configurações salvas"
            : "Configurações não salvas"}
        </p>
      </div>

      <div className="text-black dark:text-black">
        <p>
          🔄{" "}
          {isDefaultSettings
            ? "Configurações padrão"
            : "Configurações personalizadas"}
        </p>
      </div>

      <div className="md:col-span-2 text-black dark:text-black">
        <p className="text-xs opacity-75">
          As preferências serão mantidas por 1 ano após salvar
        </p>
      </div>
    </div>
  );
}