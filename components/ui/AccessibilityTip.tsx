// components/ui/AccessibilityTip.tsx
"use client";

interface AccessibilityTipProps {
  mode: "simplificado" | "completo";
}

export function AccessibilityTip({ mode }: AccessibilityTipProps) {
  const message = mode === "simplificado"
    ? "O modo simplificado mantém o foco no essencial: adicionar, concluir e excluir tarefas. Perfeito para uso rápido e intuitivo!"
    : "O modo completo oferece todas as ferramentas para organizar sua vida: subtarefas, notas, filtros, prioridades e muito mais!";

  return (
    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
      <p className="text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2">
        💡 Dica: {message}
      </p>
    </div>
  );
}