export default function ProfileHeader({
  isSaved,
  isEdited,
}: {
  isSaved: boolean;
  isEdited: boolean;
}) {
  return (
    <header className="rounded-lg bg-slate-800 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Perfil do Usuário</h1>
          <p className="mt-1 text-sm text-slate-200">
            Atualize seus dados pessoais e informações de acesso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isSaved && (
            <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-sm text-white">
              <span>✅</span>
              Salvo
            </span>
          )}

          {!isSaved && isEdited && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-sm text-white">
              <span>⚠️</span>
              Alterações pendentes
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
