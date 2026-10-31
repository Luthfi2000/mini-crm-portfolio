"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  UserPlus,
  Search,
  Bot,
  Calendar,
  Shield,
  ChevronDown,
  Check,
  LogOut,
  Sparkles,
} from "lucide-react";
import { User, UserRole } from "@/lib/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onAddContact?: () => void;
  onAddDeal?: () => void;
  onOpenQuickSearch?: () => void;
}

export function Header({
  title,
  subtitle,
  onOpenMobileMenu,
  onAddContact,
  onAddDeal,
  onOpenQuickSearch,
}: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleQuickSwitch = async (targetEmail: string, targetPass: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPass }),
      });
      if (res.ok) {
        setRoleMenuOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Gagal mengganti peran:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case "ADMIN":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          label: "Admin (Director)",
        };
      case "MANAGER":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
          label: "Sales Manager",
        };
      case "SALES_REP":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Sales Rep (AE)",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-500",
          label: "User",
        };
    }
  };

  const currentRoleStyle = getRoleBadgeStyle(currentUser?.role);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden text-xs text-slate-500 sm:block truncate max-w-md font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Clean, uncrowded controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Button */}
        {onOpenQuickSearch && (
          <button
            onClick={onOpenQuickSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 sm:px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            title="Pencarian Cepat (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Cari...</span>
            <kbd className="hidden md:inline rounded border border-slate-300 bg-white px-1 py-0.2 text-[10px] font-semibold text-slate-600 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Compact Role Switcher Popover Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer ${currentRoleStyle.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentRoleStyle.dot}`} />
            <span className="hidden sm:inline">{currentRoleStyle.label}</span>
            <span className="sm:hidden">{currentUser?.role || "ADMIN"}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Masuk Sebagai (Demo Role)
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                  {currentUser?.name || "Luthfi Aditya"}
                </p>
              </div>

              <div className="py-1 space-y-1">
                <button
                  onClick={() => handleRoleQuickSwitch("admin@nusantaracrm.id", "Admin123!")}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    currentUser?.role === "ADMIN"
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-extrabold">👑 Administrator</p>
                    <span className="text-[10px] text-slate-400 font-normal">Akses penuh, ekspor & hapus</span>
                  </div>
                  {currentUser?.role === "ADMIN" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleQuickSwitch("manager@nusantaracrm.id", "Manager123!")}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    currentUser?.role === "MANAGER"
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-extrabold">💼 Sales Manager</p>
                    <span className="text-[10px] text-slate-400 font-normal">Monitoring pipeline tim</span>
                  </div>
                  {currentUser?.role === "MANAGER" && <Check className="h-3.5 w-3.5 text-purple-600" />}
                </button>

                <button
                  onClick={() => handleRoleQuickSwitch("rep@nusantaracrm.id", "Sales123!")}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    currentUser?.role === "SALES_REP"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-extrabold">🎯 Sales Representative</p>
                    <span className="text-[10px] text-slate-400 font-normal">Operasional leads & deal</span>
                  </div>
                  {currentUser?.role === "SALES_REP" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Contact (Hidden on small mobile) */}
        {onAddContact && (
          <button
            onClick={onAddContact}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5 text-slate-500" />
            <span>Klien</span>
          </button>
        )}

        {/* Primary CTA: + Deal Baru */}
        {onAddDeal && (
          <button
            onClick={onAddDeal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-black text-white shadow-sm shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Deal Baru</span>
          </button>
        )}
      </div>
    </header>
  );
}
