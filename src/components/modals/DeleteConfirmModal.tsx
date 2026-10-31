"use client";

import { AlertTriangle, Loader2, ShieldAlert, Lock } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  loading?: boolean;
  canDelete?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  loading = false,
  canDelete = true,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all z-10 text-center border border-slate-100">
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs ${
            canDelete
              ? "bg-rose-50 text-rose-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {canDelete ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <ShieldAlert className="h-6 w-6" />
          )}
        </div>

        <h3 className="mt-4 text-base font-extrabold text-slate-900">
          {canDelete ? title : "Akses Penghapusan Dibatasi"}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
          {message}
        </p>

        {!canDelete ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-left">
              <div className="flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Kebijakan Keamanan Sistem
                  </p>
                  <p className="mt-0.5 text-xs text-amber-800 leading-relaxed font-medium">
                    Hanya Administrator yang memiliki wewenang menghapus data ini demi keamanan data (Data Loss Prevention).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Hapus Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
