"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Users,
  Briefcase,
  LayoutDashboard,
  Kanban,
  ArrowRight,
  Sparkles,
  Bot,
  Shield,
  LogIn,
} from "lucide-react";
import { Contact, Deal } from "@/lib/types";
import { formatRupiah, getAvatarBgClass, getInitials, getStageBadgeColor } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resContacts, resDeals] = await Promise.all([
        fetch("/api/contacts"),
        fetch("/api/deals"),
      ]);
      if (resContacts.ok) setContacts(await resContacts.json());
      if (resDeals.ok) setDeals(await resDeals.json());
    } catch (err) {
      console.error("Gagal memuat data pencarian:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.email.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  const filteredDeals = deals.filter((d) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.contact?.name && d.contact.name.toLowerCase().includes(q))
    );
  }).slice(0, 4);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kontak, klien, atau deal prospek... (ESC untuk keluar)"
            className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Navigations */}
          {!query && (
            <div>
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Akses Cepat Modul
              </span>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => handleNavigate("/")}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-blue-600" />
                    <span>Executive Dashboard</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleNavigate("/contacts")}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span>Direktori Kontak & Klien</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleNavigate("/pipeline")}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Kanban className="h-4 w-4 text-emerald-600" />
                    <span>Pipeline Deals (Kanban)</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
                <button
                  onClick={() => handleNavigate("/agents")}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-900 font-extrabold">Autonomous Role Agents (AI)</span>
                  </div>
                  <span className="rounded-full bg-purple-100 text-purple-700 text-[9px] font-black px-1.5 py-0.2">
                    Multi-Agent
                  </span>
                </button>
                <button
                  onClick={() => handleNavigate("/team")}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Manajemen Tim & RBAC</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {filteredContacts.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Kontak & Klien
              </span>
              <div className="mt-1 space-y-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleNavigate(`/contacts/${contact.id}`)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-blue-50/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${getAvatarBgClass(
                          contact.avatarColor
                        )}`}
                      >
                        {getInitials(contact.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                          {contact.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {contact.company || contact.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 rounded-md bg-slate-100 px-2 py-0.5">
                      {contact.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals Section */}
          {filteredDeals.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prospek Deals
              </span>
              <div className="mt-1 space-y-1">
                {filteredDeals.map((deal) => {
                  const stage = getStageBadgeColor(deal.stage);
                  return (
                    <button
                      key={deal.id}
                      onClick={() => handleNavigate("/pipeline")}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-blue-50/70 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                          <Briefcase className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                            {deal.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {deal.contact?.company || deal.contact?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-slate-900 tabular-nums">
                          {formatRupiah(deal.value)}
                        </p>
                        <span className={`text-[10px] font-extrabold ${stage.text}`}>
                          {deal.stage}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {query && filteredContacts.length === 0 && filteredDeals.length === 0 && (
            <div className="py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs font-bold text-slate-700">
                Tidak ada hasil untuk "{query}"
              </p>
              <p className="text-[11px] text-slate-400">
                Coba gunakan kata kunci nama instansi, personil, atau judul proyek deal.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-400 font-medium">
          <span>Gunakan panah untuk navigasi</span>
          <div className="flex items-center gap-2">
            <span>ESC untuk tutup</span>
            <span>↵ untuk buka</span>
          </div>
        </div>
      </div>
    </div>
  );
}
