// app/components/SavedMessage.tsx
"use client";

interface SavedMessageProps {
  visible: boolean;
}

export default function SavedMessage({ visible }: SavedMessageProps) {
  if (!visible) return null;

  return (
    <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
      <span className="text-xl">✅</span>
      <span>Configurações salvas com sucesso!</span>
      {/* 💡 Dica: As configurações já estão ativas */}
      <span className="text-xs opacity-75 ml-2">
        💡 As alterações já estão ativas em todas as páginas
      </span>
    </div>
  );
}