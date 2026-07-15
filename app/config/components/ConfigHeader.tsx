// app/components/ConfigHeader.tsx
"use client";

interface ConfigHeaderProps {
  isSaved: boolean;
  isDefaultSettings: boolean;
  hasUnsavedChanges: boolean;
}

export default function ConfigHeader({ 
  isSaved, 
  isDefaultSettings, 
  hasUnsavedChanges 
}: ConfigHeaderProps) {
  const getStatus = () => {
    if (isSaved && !hasUnsavedChanges) {
      return { label: "Salvo", color: "bg-green-500", icon: "✅" };
    }
    if (!isSaved && hasUnsavedChanges) {
      return { label: "Não salvo", color: "bg-yellow-500", icon: "⚠️" };
    }
    return { label: "Salvo", color: "bg-green-500", icon: "✅" };
  };

  const status = getStatus();

  return (
    <header className="bg-blue-600 text-white p-6 rounded-lg relative">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">⚙️ Configurações de Acessibilidade</h1>
          {/* 💡 Dica: Personalize sua experiência de navegação */}
          <p className="opacity-90">Personalize sua experiência de navegação</p>
          {/* 💡 Dica: Todas as configurações são salvas automaticamente */}
          <p className="text-xs opacity-75 mt-1">
            💡 Todas as configurações são salvas automaticamente para a próxima visita
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span 
            className={`${status.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}
            title={status.label === "Salvo" ? "Configurações salvas" : "Você tem alterações não salvas"}
          >
            {status.icon} {status.label}
          </span>
        </div>
      </div>
    </header>
  );
}