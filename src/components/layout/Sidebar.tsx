"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Database,
  Briefcase,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Plus,
  Bot,
  UserCheck,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { User, UserRole } from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onQuickAddDeal?: () => void;
}

export function Sidebar({ isOpen, onClose, onQuickAddDeal }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error("Gagal memeriksa sesi pengguna:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      name: "Kontak & Klien",
      href: "/contacts",
      icon: Users,
      badge: "10",
    },
    {
      name: "Pipeline Kanban",
      href: "/pipeline",
      icon: Kanban,
      badge: "Deals",
    },
    {
      name: "Autonomous Agents",
      href: "/agents",
      icon: Bot,
      badge: "AI Roles",
    },
    {
      name: "Manajemen Tim",
      href: "/team",
      icon: Shield,
      badge: "RBAC",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "MANAGER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SALES_REP":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUPPORT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Workspace Brand Switcher */}
        <div className="p-4 border-b border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base">
                  Nusantara<span className="text-blue-600">CRM</span>
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 truncate">
                Internal Sales & RBAC Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Action Button */}
        {onQuickAddDeal && (
          <div className="px-4 pt-3 pb-1">
            <button
              onClick={() => {
                if (onClose) onClose();
                onQuickAddDeal();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Deal Baru</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama & Modul
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      active
                        ? "bg-blue-50/90 text-blue-700 shadow-xs border border-blue-200/60"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          active
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />
                      <span className="tracking-tight">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                            active
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* AI Autonomous Agents Promo Box */}
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Autonomous Agents</span>
              </span>
              <span className="rounded-full bg-indigo-600 px-1.5 py-0.2 text-[9px] font-black text-white">
                Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              3 Agen AI otonom untuk Sales Rep, Manager, dan Admin siap bekerja secara simultan.
            </p>
            <Link
              href="/agents"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 hover:underline pt-0.5"
            >
              <span>Buka Ruang Agen</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* User Footer Profile & RBAC Info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between gap-2 p-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-extrabold text-xs shadow-xs">
                  {currentUser ? getInitials(currentUser.name) : "LA"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || "Luthfi Aditya"}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`rounded-md border px-1.5 py-0.2 text-[9px] font-black ${getRoleBadge(
                      currentUser?.role
                    )}`}
                  >
                    {currentUser?.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Keluar (Logout)"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
