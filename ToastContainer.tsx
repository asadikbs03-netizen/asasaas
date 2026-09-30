"use client";

import React from "react";
import { ToastMessage } from "@/types/academy";
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] text-white animate-slideUp"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              {toast.type === "xp" ? (
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              ) : toast.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{toast.title}</span>
                {toast.xp && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-black text-[10px]">
                    +{toast.xp} XP
                  </span>
                )}
              </div>
              {toast.message && (
                <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  {toast.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemoveToast(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
