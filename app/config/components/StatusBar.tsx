// app/components/StatusBar.tsx
"use client";

interface StatusBarProps {
  isSaved: boolean;
  isDefaultSettings: boolean;
  hasUnsavedChanges: boolean;
}

export default function StatusBar({ 
  isSaved, 
  isDefaultSettings, 
  hasUnsavedChanges 
}: StatusBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t dark:border-gray-700 pt-4">
      <div className="text-gray-500 dark:text-gray-400">
        <p>
          📌 Status:{" "}
          {isSaved && !hasUnsavedChanges 
            ? "✅ Configurações salvas" 
            : !isSaved && hasUnsavedChanges
              ? "⚠️ Configurações não salvas"
              : "✅ Configurações salvas"}
        </p>
        {/* 💡 Dica: Não se esqueça de salvar suas alterações */}
        {!isSaved && hasUnsavedChanges && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            💡 Não esqueça de salvar suas alterações!
          </p>
        )}
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        <p>
          🔄 {isDefaultSettings 
            ? "Configurações padrão" 
            : "Configurações personalizadas"}
        </p>
        {/* 💡 Dica: Você pode personalizar tudo */}
        {!isDefaultSettings && (
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💡 Suas configurações personalizadas estão ativas
          </p>
        )}
      </div>
      <div className="text-gray-500 dark:text-gray-400">
        <p className="text-xs opacity-75">
          💾 As preferências serão mantidas por 1 ano após salvar
        </p>
        {/* 💡 Dica: Configurações salvas no seu navegador */}
        <p className="text-xs opacity-50">
          📁 Salvas no seu navegador
        </p>
      </div>
    </div>
  );
}