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
  FileText,
  Clock,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AddDealModal } from "@/components/modals/AddDealModal";
import { EditDealModal } from "@/components/modals/EditDealModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { QuotationModal } from "@/components/modals/QuotationModal";
import { WhatsAppModal } from "@/components/modals/WhatsAppModal";
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
  const [quotationDeal, setQuotationDeal] = useState<Deal | null>(null);
  const [whatsAppDeal, setWhatsAppDeal] = useState<Deal | null>(null);
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

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1680px] mx-auto w-full">
          {/* Executive KPI Cards - Decoupled 4-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Pipeline Berjalan */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pipeline Berjalan
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-xl font-black text-slate-900 tabular-nums">
                {formatRupiah(totalPipelineValue)}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                <span className="font-medium">Prospek Aktif</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost").length} deals
                </span>
              </div>
            </div>

            {/* 2. Total Closed Won */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Closed Won
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-xl font-black text-emerald-600 tabular-nums">
                {formatRupiah(totalWonValue)}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                <span className="font-medium">Deal Closing</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {deals.filter((d) => d.stage === "Won").length} closed
                </span>
              </div>
            </div>

            {/* 3. Win Ratio */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Win Ratio
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-xl font-black text-slate-900 tabular-nums">
                  {winRatio}%
                </p>
                <span className="text-[11px] font-semibold text-slate-400">Konversi</span>
              </div>
              <div className="mt-2 border-t border-slate-100 pt-2">
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(winRatio, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 4. Total Prospek */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Prospek
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-xl font-black text-slate-900 tabular-nums">
                {deals.length} deals
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                <span className="font-medium">Total Volume</span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {formatRupiah(deals.reduce((s, d) => s + d.value, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated Operational Filter & Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul proyek, klien, perusahaan..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all"
                />
              </div>

              <div className="relative shrink-0">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white focus:outline-hidden cursor-pointer transition-all"
                >
                  <option value="All">Prioritas: Semua</option>
                  <option value="High">🔥 Prioritas: Tinggi (High)</option>
                  <option value="Medium">⚡ Prioritas: Sedang (Medium)</option>
                  <option value="Low">🌱 Prioritas: Rendah (Low)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPreselectedStage("Lead");
                  setIsAddDealOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Buat Deal Baru</span>
              </button>
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
                    {/* Column Header - 2-Tier Enterprise Spacing */}
                    <div className="pb-3 border-b border-slate-200/80 mb-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${col.colorDot}`} />
                          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight truncate">
                            {col.title}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black shrink-0 ${col.badgeBg} ${col.badgeText}`}
                        >
                          {columnDeals.length} deal
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                          {col.description}
                        </span>
                        <span className="text-[11px] font-black text-slate-800 tabular-nums bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs">
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

                          const dealDate = new Date(deal.updatedAt || deal.createdAt);
                          const diffDays = Math.max(1, Math.floor((new Date().getTime() - dealDate.getTime()) / (1000 * 3600 * 24)));
                          const isStale = deal.stage !== "Won" && deal.stage !== "Lost" && diffDays >= 2;

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
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`rounded-md border px-2 py-0.5 text-[10px] ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}
                                  >
                                    {deal.priority}
                                  </span>

                                  {isStale && (
                                    <span
                                      className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700 animate-pulse"
                                      title="Deal ini belum ada tindak lanjut dalam beberapa hari terakhir!"
                                    >
                                      <Clock className="h-2.5 w-2.5 text-amber-600" />
                                      <span>Mandek {diffDays} hr</span>
                                    </span>
                                  )}
                                </div>

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

                              {/* Quick Move Stage & Action Row */}
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setQuotationDeal(deal)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-600 px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                                    title="Cetak Surat Penawaran Resmi (PDF)"
                                  >
                                    <FileText className="h-3 w-3 text-blue-600" />
                                    <span>PDF</span>
                                  </button>

                                  <button
                                    onClick={() => setWhatsAppDeal(deal)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800 text-emerald-700 px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                                    title="Kirim Pesan Follow-Up WhatsApp Cepat"
                                  >
                                    <MessageSquare className="h-3 w-3 text-emerald-600" />
                                    <span>WA</span>
                                  </button>
                                </div>

                                <div className="relative">
                                  <select
                                    value={deal.stage}
                                    onChange={(e) =>
                                      updateDealStage(deal.id, e.target.value as DealStage)
                                    }
                                    className="text-[11px] font-semibold text-slate-700 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white pl-2.5 pr-6 py-1 focus:border-blue-500 focus:outline-hidden cursor-pointer transition-all appearance-none shadow-2xs"
                                  >
                                    <option value="Lead">Lead</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Won">Won</option>
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                                </div>
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

      <QuotationModal
        deal={quotationDeal}
        isOpen={!!quotationDeal}
        onClose={() => setQuotationDeal(null)}
      />

      <WhatsAppModal
        deal={whatsAppDeal}
        isOpen={!!whatsAppDeal}
        onClose={() => setWhatsAppDeal(null)}
        onActivityLogged={fetchDeals}
      />
    </div>
  );
}
