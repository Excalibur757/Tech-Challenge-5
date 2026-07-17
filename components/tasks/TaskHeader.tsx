// components/tasks/TaskHeader.tsx
"use client";

interface TaskHeaderProps {
  mode: "simplificado" | "completo";
  extraConfirmation: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleMode: () => void;
}

export function TaskHeader({
  mode,
  extraConfirmation,
  searchTerm,
  onSearchChange,
  onToggleMode,
}: TaskHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            📋 Lista de Tarefas
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === "simplificado" ? "🔹 Modo Simplificado" : "🔸 Modo Completo"}
          </p>
          <div className="mt-1 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${
              extraConfirmation 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {extraConfirmation ? '✅ Confirmação ativada' : '❌ Confirmação desativada'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {mode === "completo" && (
            <input
              type="text"
              placeholder="🔍 Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          )}
          <button
            onClick={onToggleMode}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            title={mode === "simplificado" ? "Ativar modo completo com mais recursos" : "Voltar ao modo simplificado mais focado"}
          >
            <span>{mode === "simplificado" ? "🔧" : "🧊"}</span>
            {mode === "simplificado" ? "Completo" : "Simplificado"}
          </button>
        </div>
      </div>
    </div>
  );
}