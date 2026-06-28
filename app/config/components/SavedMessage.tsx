export default function SavedMessage({ visible }: { visible: boolean }) {
    return (
        visible && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
            <span className="text-xl">✅</span>
            <span>Configurações salvas com sucesso!</span>
          </div>
    )
    )
  }