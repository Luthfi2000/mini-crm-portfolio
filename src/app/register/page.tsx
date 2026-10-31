"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Lock,
  Mail,
  User,
  Building,
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("SALES_REP");
  const [department, setDepartment] = useState("Sales & Business Development");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Seluruh kolom wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/register", {
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
        throw new Error(data.error || "Gagal melakukan pendaftaran.");
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan saat memproses pendaftaran.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case "ADMIN":
        return "👑 Hak Akses Penuh: Kelola pengguna tim, ekspor data CSV, hapus klien & deal, audit konfigurasi.";
      case "MANAGER":
        return "💼 Manajemen Tim: Pengawasan seluruh pipeline deal, persetujuan proposal, ekspor laporan CSV.";
      case "SALES_REP":
        return "🎯 Sales Operasional: Kelola prospek & deal pribadi, pencatatan panggilan & rapat, pemindahan tahap kanban.";
      case "SUPPORT":
        return "🛡️ Customer Success: Pemantauan akun pelanggan aktif, pencatatan tiket & kepuasan klien.";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -mt-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Layers className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Daftar Akun Tim Internal
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Dapatkan akses sesuai peran kerja di Nusantara CRM Workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300">
                Nama Lengkap
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Luthfi Aditya"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300">
                Email Kerja Internal
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="luthfi@nusantaracrm.id"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300">
                  Peran Akun (RBAC Role)
                </label>
                <div className="relative mt-1">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-bold text-white focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="SALES_REP">Sales Representative</option>
                    <option value="MANAGER">Sales Manager</option>
                    <option value="ADMIN">System Administrator</option>
                    <option value="SUPPORT">Customer Success</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300">
                  Departemen / Divisi
                </label>
                <div className="relative mt-1">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Sales & Commercial"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Role scope badge explanation */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-[11px] text-blue-300 font-medium">
              {getRoleDescription(role)}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300">
                  Konfirmasi Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>Daftar Akun Tim</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-400 hover:text-blue-300 underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
