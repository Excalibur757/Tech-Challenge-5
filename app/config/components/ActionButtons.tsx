interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

export default function ActionButtons({
  onSave,
  onReset,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <button
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
      >
        <span>💾</span>
        Salvar Configurações
      </button>

      <button
        onClick={onReset}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
      >
        <span>↺</span>
        Restaurar Padrões
      </button>
    </div>
  );
}