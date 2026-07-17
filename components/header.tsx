"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  function syncUserName() {
    if (typeof window === "undefined") return;

    const storedName = localStorage.getItem("authName") || localStorage.getItem("authUser") || null;
    setUser(storedName);
  }

  useEffect(() => {
    syncUserName();

    const handleStorage = () => syncUserName();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authName");
      localStorage.removeItem("authPassword");
    }
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="w-full bg-[#1e2939] shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded px-2 py-1 font-semibold text-gray-100 transition hover:bg-slate-700"
        >
          SeniorEase
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded px-2 py-1 text-gray-100 transition hover:bg-slate-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-sm font-medium text-slate-100">
              {user ? user.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="text-sm">{user ?? "Usuário"}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-slate-700 bg-slate-800 py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-700"
              >
                <span aria-hidden="true">🏠</span>
                <span>Tela Inicial</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/config");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-700"
              >
                <span aria-hidden="true">⚙️</span>
                <span>Configurações</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/perfil");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-700"
              >
                <span aria-hidden="true">👤</span>
                <span>Perfil</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-700"
              >
                <span aria-hidden="true">🚪</span>
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}