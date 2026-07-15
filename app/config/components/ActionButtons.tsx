// app/components/ActionButtons.tsx
"use client";

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

export default function ActionButtons({ onSave, onReset }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* 💡 Dica: Salve suas configurações para usar em todas as páginas */}
      <button
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
        title="Salvar configurações para usar em todas as páginas"
      >
        <span>💾</span> Salvar Configurações
      </button>
      
      {/* 💡 Dica: Volte para as configurações padrão se não estiver satisfeito */}
      <button
        onClick={onReset}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
        title="Voltar para as configurações padrão"
      >
        <span>↺</span> Restaurar Padrões
      </button>
    </div>
  );
}