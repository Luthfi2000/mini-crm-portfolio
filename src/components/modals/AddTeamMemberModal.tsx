"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { UserRole } from "@/lib/types";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("SALES_REP");
  const [department, setDepartment] = useState("Sales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Semua kolom bertanda bintang wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          department: department.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan pengguna baru.");
      }

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("SALES_REP");
      setDepartment("Sales");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan sistem saat mendaftarkan akun.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Tambah Anggota Tim Baru
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Daftarkan akun login internal dan tentukan hak akses peran (RBAC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dimas Aditya"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Email & Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dimas@nusantaracrm.id"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Password Awal <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Departemen */}
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Departemen / Divisi
            </label>
            <div className="relative mt-1">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Sales / RevOps / Customer Success"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Role (RBAC Selection) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Peran & Wewenang (RBAC) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`flex flex-col rounded-2xl border p-3 cursor-pointer transition-all ${
                  role === "SALES_REP"
                    ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900">
                    🎯 Sales Representative
                  </span>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "SALES_REP"}
                    onChange={() => setRole("SALES_REP")}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Kelola leads & deals pribadi, catat interaksi (tanpa ekspor/hapus).
                </span>
              </label>

              <label
                className={`flex flex-col rounded-2xl border p-3 cursor-pointer transition-all ${
                  role === "MANAGER"
                    ? "border-purple-500 bg-purple-50/60 ring-1 ring-purple-500"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-900">
                    💼 Sales Manager
                  </span>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "MANAGER"}
                    onChange={() => setRole("MANAGER")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Monitoring seluruh pipeline, approval proposal, ekspor CSV.
                </span>
              </label>

              <label
                className={`flex flex-col rounded-2xl border p-3 cursor-pointer transition-all ${
                  role === "ADMIN"
                    ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900">
                    👑 Administrator
                  </span>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "ADMIN"}
                    onChange={() => setRole("ADMIN")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Akses penuh sistem, manajemen akun tim, hapus data master.
                </span>
              </label>

              <label
                className={`flex flex-col rounded-2xl border p-3 cursor-pointer transition-all ${
                  role === "SUPPORT"
                    ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-500"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900">
                    🎧 Customer Support
                  </span>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "SUPPORT"}
                    onChange={() => setRole("SUPPORT")}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Melihat data kontak & mencatat histori tiket/komunikasi.
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Daftarkan Akun</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
