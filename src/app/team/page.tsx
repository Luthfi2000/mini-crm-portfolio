"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit,
  Mail,
  Building,
  Calendar,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { AddTeamMemberModal } from "@/components/modals/AddTeamMemberModal";
import { User, UserRole, ROLE_PERMISSIONS } from "@/lib/types";
import { formatDate, getAvatarBgClass, getInitials } from "@/lib/utils";

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error("Gagal memuat tim:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingId(userId);
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Gagal memperbarui role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "MANAGER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SALES_REP":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUPPORT":
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title="Manajemen Tim & Hak Akses (RBAC)"
          subtitle="Daftar akun tim internal, pembagian peran kerja, dan kontrol izin keamanan enterprise"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Top info card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Role-Based Access Control (RBAC) Engine
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500 max-w-2xl font-medium">
                Setiap pengguna internal dibatasi sesuai prinsip *Principle of Least Privilege*. Administrator dapat mengubah peran pengguna secara langsung di bawah ini.
              </p>
            </div>

            {currentUser?.role === "ADMIN" ? (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Tambah Anggota Tim</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200/80 px-3.5 py-2 text-xs font-bold text-slate-500 shrink-0">
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span>Pendaftaran akun dikelola Administrator</span>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daftar Pengguna Tim Internal ({users.length})
              </h4>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4 sm:px-6">Anggota Tim</th>
                      <th className="py-3.5 px-4">Departemen</th>
                      <th className="py-3.5 px-4">Peran (Role)</th>
                      <th className="py-3.5 px-4">Status Akun</th>
                      <th className="py-3.5 px-4">Terakhir Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-xs ${getAvatarBgClass(
                                user.avatarColor
                              )}`}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs truncate">
                                {user.name}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700 text-xs">
                          {user.department || "Sales"}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={user.role}
                              disabled={updatingId === user.id}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value as UserRole)
                              }
                              className={`text-[11px] font-black rounded-lg border px-2.5 py-1 ${getRoleBadge(
                                user.role
                              )} focus:outline-hidden cursor-pointer`}
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="SALES_REP">SALES_REP</option>
                              <option value="SUPPORT">SUPPORT</option>
                            </select>
                            {updatingId === user.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>Aktif</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-slate-500 font-medium">
                          {user.lastLogin ? formatDate(user.lastLogin) : "Belum pernah"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Matrix Hak Akses (Permissions Matrix) */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 tracking-tight mb-1">
              Matriks Hak Akses Peran (Permission Matrix)
            </h4>
            <p className="text-xs text-slate-500 mb-5 font-medium">
              Rincian kewenangan setiap role dalam mengakses fitur sensitif CRM
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Fitur / Tindakan</th>
                    <th className="py-3 px-4 text-center">ADMIN</th>
                    <th className="py-3 px-4 text-center">MANAGER</th>
                    <th className="py-3 px-4 text-center">SALES_REP</th>
                    <th className="py-3 px-4 text-center">SUPPORT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 px-4 text-slate-800 font-bold">Hapus Kontak & Deal Master</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-800 font-bold">Ekspor Seluruh Data ke CSV</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-800 font-bold">Kelola Peran & Pengguna Tim</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-800 font-bold">Pindahkan Tahap Deal di Kanban</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-800 font-bold">Jalankan Simulasi Agen AI Otonom</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Ya</td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">❌ Tidak</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      <AddTeamMemberModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
