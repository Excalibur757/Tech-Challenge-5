type ProfileData = {
  name: string;
  age: string;
  email: string;
  phone: string;
  password: string;
};

interface ProfileFormProps {
  profileData: ProfileData;
  onFieldChange: (field: keyof ProfileData, value: string) => void;
  wantChangePassword: boolean;
  onWantChangePasswordChange: (value: boolean) => void;
  currentPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  passwordError: string;
  savedPassword: string;
}

export default function ProfileForm({
  profileData,
  onFieldChange,
  wantChangePassword,
  onWantChangePasswordChange,
  currentPassword,
  onCurrentPasswordChange,
  passwordError,
  savedPassword,
}: ProfileFormProps) {
  const canSetNewPassword = !wantChangePassword || currentPassword === savedPassword;
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-800">Dados pessoais</h2>
          <p className="text-sm text-slate-500">Atualize nome, idade, e-mail e telefone.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nome completo</span>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => onFieldChange("name", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500"
              placeholder="Digite seu nome"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Idade</span>
            <input
              type="number"
              value={profileData.age}
              onChange={(e) => onFieldChange("age", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500"
              placeholder="Ex: 68"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500"
              placeholder="seu@email.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Celular</span>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500"
              placeholder="(11) 99999-9999"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-800">Segurança</h2>
          <p className="text-sm text-slate-500">Você pode alterar sua senha quando quiser.</p>
        </div>

        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-slate-700">Deseja alterar a senha?</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onWantChangePasswordChange(true)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${
                wantChangePassword ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => onWantChangePasswordChange(false)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ${
                !wantChangePassword ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Não
            </button>
          </div>
        </div>

        {wantChangePassword && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Senha atual</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => onCurrentPasswordChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500"
                placeholder="Digite a senha atual"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Nova senha</span>
              <input
                type="password"
                value={profileData.password}
                onChange={(e) => onFieldChange("password", e.target.value)}
                disabled={!canSetNewPassword}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none ring-0 focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Digite uma nova senha"
              />
            </label>

            {currentPassword && currentPassword !== savedPassword && (
              <p className="text-sm text-red-600">A senha atual informada não confere.</p>
            )}

            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
