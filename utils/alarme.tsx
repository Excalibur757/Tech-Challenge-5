"use client";

import { useEffect } from "react";

type AlarmeProps = {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  autoHideMs?: number;
  onClose?: () => void;
};

export default function Alarme({
  visible,
  message,
  type = "success",
  autoHideMs = 5000,
  onClose,
}: AlarmeProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, autoHideMs);

    return () => window.clearTimeout(timer);
  }, [visible, autoHideMs, onClose]);

  if (!visible) return null;

  const typeClasses =
    type === "success"
      ? "bg-green-600 text-white border-green-700"
      : type === "error"
      ? "bg-red-600 text-white border-red-700"
      : type === "warning"
      ? "bg-amber-500 text-slate-900 border-amber-700"
      : "bg-slate-800 text-white border-slate-900";

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-2">
      <div className={`w-full rounded-b-lg border px-4 py-3 text-center text-sm font-semibold shadow-lg shadow-black/20 ${typeClasses}`}>
        {message}
      </div>
    </div>
  );
}
