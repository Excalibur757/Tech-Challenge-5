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
    router.push("/");
  }

  const isRegisterMode = mode === "register";

  return (
    <div
      className="min-h-screen flex items-center justify-end px-8"
      style={{
        backgroundImage: 'url(/capa-Login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f5f5f5',
        paddingRight: 55,
      }}
    >
      <form
        onSubmit={isRegisterMode ? handleRegister : handleSubmit}
        className="relative w-full max-w-md rounded bg-white p-10 shadow-lg"
        style={{ minHeight: '560px', backgroundColor: '#ffffffc7' }}
      >
        <h2 className="mb-6 text-2xl font-semibold" style={{ color: 'black' }}>
          {isRegisterMode ? 'Cadastro' : 'Login'}
        </h2>

        {isRegisterMode && (
          <label className="block mb-3" style={{ color: 'black' }}>
            <span className="text-sm">Nome completo</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </label>
        )}

        <label className="block mb-3" style={{ color: 'black' }}>
          <span className="text-sm">Usuário</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block mb-4" style={{ color: 'black' }}>
          <span className="text-sm">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-foreground px-4 py-2 text-background"
          style={{ backgroundColor: '#427c61', color: 'white', cursor: 'pointer' }}
        >
          {isRegisterMode ? 'Cadastrar-se' : 'Entrar'}
        </button>

        <div className="mt-6 text-sm text-center" style={{ color: 'black' }}>
          {isRegisterMode ? (
            <>
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-teal-700 hover:text-teal-900"
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
                className="font-semibold text-teal-700 hover:text-teal-900"
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
