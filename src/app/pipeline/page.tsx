"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Kanban,
  Plus,
  DollarSign,
  Calendar,
  Building,
  Edit,
  Trash2,
  Search,
  Loader2,
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AddDealModal } from "@/components/modals/AddDealModal";
import { EditDealModal } from "@/components/modals/EditDealModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { Deal, DealStage } from "@/lib/types";
import {
  formatDate,
  formatRupiah,
  getAvatarBgClass,
  getInitials,
  getPriorityBadgeColor,
  getStageBadgeColor,
} from "@/lib/utils";

interface ColumnConfig {
  id: DealStage;
  title: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  colorDot: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "Lead",
    title: "1. Lead Inbound",
    description: "Prospek baru & inquiry awal",
    badgeBg: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-700",
    accentBorder: "border-t-blue-500",
    colorDot: "bg-blue-500",
  },
  {
    id: "Qualified",
    title: "2. Qualified",
    description: "Kebutuhan & budget terverifikasi",
    badgeBg: "bg-indigo-50 border-indigo-200",
    badgeText: "text-indigo-700",
    accentBorder: "border-t-indigo-500",
    colorDot: "bg-indigo-500",
  },
  {
    id: "Proposal",
    title: "3. Proposal & Negosiasi",
    description: "Tahap penawaran & pembahasan SLA",
    badgeBg: "bg-amber-50 border-amber-200",
    badgeText: "text-amber-700",
    accentBorder: "border-t-amber-500",
    colorDot: "bg-amber-500",
  },
  {
    id: "Won",
    title: "4. Closed Won",
    description: "Deal closing & kontrak disepakati",
    badgeBg: "bg-emerald-50 border-emerald-200",
    badgeText: "text-emerald-700",
    accentBorder: "border-t-emerald-500",
    colorDot: "bg-emerald-500",
  },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Drag and Drop state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Modals state
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [preselectedStage, setPreselectedStage] = useState<DealStage>("Lead");
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/deals");
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCurrentUser(data.user);
          setPermissions(data.permissions);
        }
      })
      .catch(() => {});
  }, []);

  // Update deal stage
  const updateDealStage = async (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) {
        fetchDeals();
      }
    } catch (err) {
      console.error("Gagal memperbarui tahap deal:", err);
      fetchDeals();
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: DealStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const dealId = e.dataTransfer.getData("text/plain") || draggedDealId;
    if (dealId) {
      updateDealStage(dealId, columnId);
      setDraggedDealId(null);
    }
  };

  const canDeleteDeal = Boolean(currentUser?.role === "ADMIN" || permissions?.canDeleteDeals);

  const handleDeleteDeal = async () => {
    if (!deletingDeal) return;
    if (!canDeleteDeal) {
      alert("Hanya Administrator yang memiliki wewenang menghapus data ini demi keamanan data (Data Loss Prevention).");
      setDeletingDeal(null);
      return;
    }
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/deals/${deletingDeal.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingDeal(null);
        fetchDeals();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus deal.");
      }
    } catch (err) {
      console.error("Gagal menghapus deal:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter deals
  const filteredDeals = deals.filter((d) => {
    if (selectedPriority !== "All" && d.priority !== selectedPriority) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.contact?.name && d.contact.name.toLowerCase().includes(q)) ||
      (d.contact?.company && d.contact.company.toLowerCase().includes(q))
    );
  });

  // Calculate metrics
  const totalPipelineValue = deals
    .filter((d) => d.stage !== "Won" && d.stage !== "Lost")
    .reduce((sum, d) => sum + d.value, 0);

  const totalWonValue = deals
    .filter((d) => d.stage === "Won")
    .reduce((sum, d) => sum + d.value, 0);

  const winRatio = deals.length > 0 ? Math.round((deals.filter(d => d.stage === "Won").length / deals.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onQuickAddDeal={() => {
          setPreselectedStage("Lead");
          setIsAddDealOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title="Pipeline Deals Kanban"
          subtitle="Manajemen alur prospek penjualan interaktif dengan dukungan drag-and-drop & pembaharuan real-time"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onAddContact={() => setIsAddContactOpen(true)}
          onAddDeal={() => {
            setPreselectedStage("Lead");
            setIsAddDealOpen(true);
          }}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1700px] mx-auto w-full">
          {/* Top Quick Stats & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            {/* Quick Metrics */}
            <div className="flex items-center gap-6 overflow-x-auto pb-2 lg:pb-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pipeline Berjalan
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {formatRupiah(totalPipelineValue)}
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Closed Won
                </span>
                <p className="text-base font-black text-emerald-600 tabular-nums">
                  {formatRupiah(totalWonValue)}
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Win Ratio
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {winRatio}%
                </p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Prospek
                </span>
                <p className="text-base font-black text-slate-900 tabular-nums">
                  {deals.length} deals
                </p>
              </div>
            </div>

            {/* Controls: Search and Priority Filter */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul proyek, klien..."
                  className="w-full rounded-xl border border-slate-200 pl-8.5 pr-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="All">Prioritas: Semua</option>
                <option value="High">Tinggi (High)</option>
                <option value="Medium">Sedang (Medium)</option>
                <option value="Low">Rendah (Low)</option>
              </select>
            </div>
          </div>

          {/* Kanban Board Columns Container */}
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-xs font-semibold text-slate-500">
                  Menyiapkan papan pipeline...
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {COLUMNS.map((col) => {
                const columnDeals = filteredDeals.filter((d) => d.stage === col.id);
                const columnTotal = columnDeals.reduce((sum, d) => sum + d.value, 0);
                const isOver = dragOverColumn === col.id;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`flex flex-col rounded-2xl border bg-slate-100/70 p-4 transition-all duration-200 min-h-[580px] border-t-4 ${
                      col.accentBorder
                    } ${
                      isOver
                        ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200/90"
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${col.colorDot}`} />
                          <h3 className="font-extrabold text-slate-900 text-xs tracking-tight">
                            {col.title}
                          </h3>
                          <span
                            className={`rounded-full border px-2 py-0.2 text-[10px] font-black ${col.badgeBg} ${col.badgeText}`}
                          >
                            {columnDeals.length}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {col.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 tabular-nums block">
                          {formatRupiah(columnTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Column Deals List */}
                    <div className="flex-1 space-y-3">
                      {columnDeals.length === 0 ? (
                        <div className="h-32 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-xs font-semibold text-slate-400">
                            Tarik deal ke kolom ini
                          </p>
                          <span className="text-[10px] text-slate-400">
                            atau klik tambah di bawah
                          </span>
                        </div>
                      ) : (
                        columnDeals.map((deal) => {
                          const priorityBadge = getPriorityBadgeColor(deal.priority);
                          const isBeingDragged = draggedDealId === deal.id;

                          // Left indicator border according to priority
                          const leftBorder =
                            deal.priority === "High"
                              ? "border-l-4 border-l-rose-500"
                              : deal.priority === "Medium"
                              ? "border-l-4 border-l-amber-500"
                              : "border-l-4 border-l-slate-300";

                          return (
                            <div
                              key={deal.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, deal.id)}
                              className={`group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:shadow-md cursor-grab active:cursor-grabbing hover:border-blue-300 ${leftBorder} ${
                                isBeingDragged ? "opacity-30 scale-95" : ""
                              }`}
                            >
                              {/* Top row: Priority & Actions */}
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`rounded-md border px-2 py-0.5 text-[10px] ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}
                                >
                                  {deal.priority}
                                </span>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingDeal(deal)}
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                                    title="Edit Deal"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingDeal(deal)}
                                    className={`p-1 rounded-md cursor-pointer transition-colors ${
                                      canDeleteDeal
                                        ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                        : "text-slate-300 hover:text-amber-600 hover:bg-amber-50"
                                    }`}
                                    title={
                                      canDeleteDeal
                                        ? "Hapus Deal (Admin Only)"
                                        : "Hanya Administrator yang memiliki wewenang menghapus data ini demi keamanan data (Data Loss Prevention)."
                                    }
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="mt-2 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                {deal.title}
                              </h4>

                              {/* Contact & Company */}
                              {deal.contact && (
                                <Link
                                  href={`/contacts/${deal.contact.id}`}
                                  className="mt-2 flex items-center gap-2 group/contact"
                                >
                                  <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${getAvatarBgClass(
                                      deal.contact.avatarColor
                                    )}`}
                                  >
                                    {getInitials(deal.contact.name)}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[11px] font-bold text-slate-700 group-hover/contact:text-blue-600">
                                      {deal.contact.name}
                                    </p>
                                    {deal.contact.company && (
                                      <p className="truncate text-[10px] text-slate-400 font-medium">
                                        {deal.contact.company}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              )}

                              {/* Deal Value & Target Date */}
                              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                                <div>
                                  <span className="text-[10px] font-medium text-slate-400 block">
                                    Nilai Deal
                                  </span>
                                  <span className="text-xs font-black text-slate-900 tabular-nums">
                                    {formatRupiah(deal.value)}
                                  </span>
                                </div>

                                {deal.expectedClose && (
                                  <div className="text-right">
                                    <span className="text-[10px] font-medium text-slate-400 block">
                                      Target Close
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 justify-end">
                                      <Calendar className="h-3 w-3 text-slate-400" />
                                      {formatDate(deal.expectedClose)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Quick Move Stage Selector */}
                              <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-medium text-slate-400">
                                  Pindah tahap:
                                </span>
                                <select
                                  value={deal.stage}
                                  onChange={(e) =>
                                    updateDealStage(deal.id, e.target.value as DealStage)
                                  }
                                  className="text-[10px] font-bold text-slate-700 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 focus:outline-hidden cursor-pointer"
                                >
                                  <option value="Lead">Lead</option>
                                  <option value="Qualified">Qualified</option>
                                  <option value="Proposal">Proposal</option>
                                  <option value="Won">Won (Deal Closing)</option>
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Add Deal in this Stage button */}
                    <button
                      onClick={() => {
                        setPreselectedStage(col.id);
                        setIsAddDealOpen(true);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:border-blue-400 hover:bg-white hover:text-blue-600 transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah ke {col.id}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddDealModal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        onSuccess={fetchDeals}
      />
      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSuccess={fetchDeals}
      />
      <EditDealModal
        isOpen={!!editingDeal}
        deal={editingDeal}
        onClose={() => setEditingDeal(null)}
        onSuccess={fetchDeals}
      />
      <DeleteConfirmModal
        isOpen={!!deletingDeal}
        title="Hapus Prospek Deal?"
        message={`Apakah Anda yakin ingin menghapus deal "${deletingDeal?.title}"? Data tidak dapat dipulihkan.`}
        loading={deleteLoading}
        canDelete={canDeleteDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={handleDeleteDeal}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}
