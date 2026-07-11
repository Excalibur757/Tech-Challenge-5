export default function StatusBar({ isSaved, isEdited }: { isSaved: boolean; isEdited: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
      {isSaved ? (
        <span>Seu perfil está atualizado.</span>
      ) : (
        <span>Há alterações não salvas no seu perfil.</span>
      )}
      {!isSaved && isEdited && <span className="ml-2 text-amber-600">• pendente</span>}
    </div>
  );
}
