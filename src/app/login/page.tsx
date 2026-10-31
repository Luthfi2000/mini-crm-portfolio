"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  KeyRound,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("notice") === "admin_only") {
        setNotice("Pendaftaran mandiri dinonaktifkan. Akun pengguna tim hanya dapat dibuat oleh Administrator.");
      }
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    if (!targetEmail.trim() || !targetPass.trim()) {
      setError("Silakan masukkan email dan password Anda.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail.trim(),
          password: targetPass.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali email dan password Anda.");
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan sistem saat mencoba masuk.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(undefined, demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 -mb-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Layers className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Nusantara<span className="text-blue-500">CRM</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Internal Enterprise Sales & Pipeline Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl">
          {notice && (
            <div className="mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs font-semibold text-amber-300 flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300">
                Alamat Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@nusantaracrm.id"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Min. 6 karakter</span>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
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
                <ArrowRight className="h-4 w-4" />
              )}
              <span>Masuk ke Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="mt-6 border-t border-slate-800/80 pt-5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>Akun Demo Cepat (1-Klik):</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin@nusantaracrm.id", "Admin123!")}
                disabled={loading}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:bg-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-black text-blue-400 border border-blue-500/30">
                      ADMIN
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-blue-300">
                      Luthfi Aditya (Director)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Akses penuh, hapus data, kelola tim, ekspor CSV
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Pilih →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("manager@nusantaracrm.id", "Manager123!")}
                disabled={loading}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:bg-slate-800/80 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-black text-purple-400 border border-purple-500/30">
                      MANAGER
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      Rian Hidayat (Sales Lead)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Monitoring pipeline tim, approval proposal, ekspor CSV
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">
                  Pilih →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("rep@nusantaracrm.id", "Sales123!")}
                disabled={loading}
                className="w-full flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                      SALES_REP
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Alifia Putri (Account Exec)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Kelola leads & deals pribadi, catat interaksi telepon
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Pilih →
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3">
            <p className="text-[11px] text-slate-400 font-medium">
              🔒 <strong className="text-slate-300">Sistem Akses Internal:</strong> Akun baru hanya dapat didaftarkan dan dikonfigurasi perannya oleh <span className="text-blue-400 font-bold">Administrator</span> melalui modul Manajemen Tim.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/landing"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Pelajari Profil & Paket Solusi IT Nusantara CRM →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
