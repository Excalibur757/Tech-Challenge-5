interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

export default function ActionButtons({ onSave, onReset }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={onSave}
        title="Salvar as alterações que você fez no perfil"
        className="cursor-pointer flex items-center gap-2 rounded-lg bg-slate-800 px-8 py-3 text-lg font-medium text-white shadow-md transition hover:bg-slate-900"
      >
        <span>💾</span>
        Salvar alterações
      </button>

      <button
        onClick={onReset}
        title="Restaurar os valores anteriores e cancelar alterações não salvas"
        className="cursor-pointer flex items-center gap-2 rounded-lg bg-gray-200 px-8 py-3 text-lg font-medium text-gray-800 shadow-md transition hover:bg-gray-300"
      >
        <span>↺</span>
        Restaurar
      </button>
    </div>
  );
}
