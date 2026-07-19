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
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        {/* Título e status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span>📋</span>
              <span>Lista de Tarefas</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {mode === "simplificado" ? "🔹 Modo Simplificado" : "🔸 Modo Completo"}
            </p>
          </div>
          
          {/* Botão de toggle - versão mobile e desktop */}
          <div className="w-full sm:w-auto">
            <button
              onClick={onToggleMode}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              title={mode === "simplificado" ? "Ativar modo completo com mais recursos" : "Voltar ao modo simplificado mais focado"}
            >
              <span>{mode === "simplificado" ? "🔧" : "🧊"}</span>
              <span className="hidden xs:inline">
                {mode === "simplificado" ? "Modo Completo" : "Modo Simplificado"}
              </span>
              <span className="xs:hidden">
                {mode === "simplificado" ? "Completo" : "Simplificado"}
              </span>
            </button>
          </div>
        </div>

        {/* Busca - apenas no modo completo */}
        {mode === "completo" && (
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status da confirmação extra - opcional */}
        {/* {extraConfirmation && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <span>✅</span>
              <span className="hidden xs:inline">Confirmação ativada</span>
              <span className="xs:hidden">Confirm. ativada</span>
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
}