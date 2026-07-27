export default function SavedMessage({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700 animate-fade-in">
      <span className="text-xl">✅</span>
      <span>Perfil atualizado com sucesso!</span>
    </div>
  );
}
