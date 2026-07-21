export default function ConfigHeader({ isSaved, isDefaultSettings }: { isSaved: boolean; isDefaultSettings: boolean }) {
  return (
    <header className="bg-blue-600 text-white p-6 rounded-lg relative">
        <div className="flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold">Configurações de Acessibilidade</h1>
            <p className="opacity-90">Personalize sua experiência de navegação</p>
        </div>
        <div className="flex items-center gap-3">
            {isSaved && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <span>✅</span> Salvo
            </span>
            )}
            {!isSaved && !isDefaultSettings && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <span>⚠️</span> Não salvo
            </span>
            )}
        </div>
        </div>
    </header>
  );
}