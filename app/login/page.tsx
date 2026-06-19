"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simple demo: require both fields non-empty
    if (username && password) {
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("authUser", username);
      router.push("/");
    } else {
      alert("Preencha usuário e senha");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-semibold" style={{color: "black"}}>Login</h2>

        <label className="block mb-3"style={{color: "black"}}>
          <span className="text-sm">Usuário</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block mb-4" style={{color: "black"}}>
          <span className="text-sm">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <button type="submit" className="w-full rounded bg-foreground px-4 py-2 text-background">
          Entrar
        </button>
      </form>
    </div>
  );
}
