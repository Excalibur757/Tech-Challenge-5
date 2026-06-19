"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(typeof window !== "undefined" ? localStorage.getItem("authUser") : null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
      <header className="w-full bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button aria-label="menu" className="p-2 rounded hover:bg-gray-100">
              ☰
            </button>
            <span className="font-semibold">SeniorEase</span>
          </div>

          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="text-sm">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {user ? user.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="text-sm">{user ?? "Usuário"}</div>
                </div>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("authUser");
                    }
                    router.push("/login");
                  }}
                  className="text-sm px-3 py-1 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center"></main>
    </div>
  );
}
