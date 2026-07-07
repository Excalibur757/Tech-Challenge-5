"use client";

import { usePathname } from "next/navigation";
import AuthGuard from "./AuthGuard";
import React from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="bg-default">
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
