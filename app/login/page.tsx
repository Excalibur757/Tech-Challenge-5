"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      alert("Preencha usuário e senha");
      return;
    }

    localStorage.setItem("authToken", "demo-token");
    localStorage.setItem("authUser", username);
    localStorage.setItem("authPassword", password);
    router.push("/");
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !username || !password) {
      alert("Preencha nome, usuário e senha para cadastrar-se");
      return;
    }

    localStorage.setItem("authToken", "demo-token");
    localStorage.setItem("authUser", username);
    localStorage.setItem("authName", fullName);
    localStorage.setItem("authPassword", password);
    router.push("/");
  }

  const isRegisterMode = mode === "register";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-login sm:px-6 lg:justify-end lg:px-8"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.92)), url('/capa-Login.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={isRegisterMode ? handleRegister : handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-[0_20px_50px_rgba(2,6,23,0.25)] backdrop-blur-sm"
        style={{ minHeight: '560px' }}
      >
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Bem-vindo
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-800">
            {isRegisterMode ? 'Cadastro' : 'Login'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Digite os dados para {isRegisterMode ? 'cadastrar-se' : 'acessar sua conta'}.
          </p>
        </div>

        {isRegisterMode && (
          <label className="mb-3 block text-slate-700">
            <span className="text-sm">Nome completo</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </label>
        )}

        <label className="mb-3 block text-slate-700">
          <span className="text-sm">Usuário</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="mb-4 block text-slate-700">
          <span className="text-sm">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#1e2939] px-4 py-2.5 font-semibold text-white transition hover:bg-[#0f172a]"
        >
          {isRegisterMode ? 'Cadastrar-se' : 'Entrar'}
        </button>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isRegisterMode ? (
            <>
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Entrar
              </button>
            </>
          ) : (
            <>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                Cadastrar-se
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
