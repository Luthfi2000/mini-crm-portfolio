"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Clock,
  Phone,
  Mail,
  FileText,
  Calendar,
  Sparkles,
  ChevronRight,
  Building,
  Loader2,
  Zap,
  Target,
  ArrowRight,
  Kanban,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { AddDealModal } from "@/components/modals/AddDealModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { DashboardStats, DealStage } from "@/lib/types";
import {
  formatRupiah,
  formatRupiahCompact,
  formatTimeAgo,
  getAvatarBgClass,
  getInitials,
  getStageBadgeColor,
  getPriorityBadgeColor,
} from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Quick activity log state directly from dashboard
  const [quickTitle, setQuickTitle] = useState("");
  const [quickType, setQuickType] = useState<"Note" | "Call" | "Meeting" | "Email">("Note");
  const [quickSubmitting, setQuickSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      setQuickSubmitting(true);
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: quickType,
          title: quickTitle.trim(),
          content: "Catatan interaksi cepat langsung dari Executive Dashboard.",
        }),
      });

      if (res.ok) {
        setQuickTitle("");
        fetchStats();
      }
    } catch (err) {
      console.error("Gagal menyimpan aktivitas cepat:", err);
    } finally {
      setQuickSubmitting(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "Call":
        return <Phone className="h-3.5 w-3.5 text-emerald-600" />;
      case "Meeting":
        return <Users className="h-3.5 w-3.5 text-purple-600" />;
      case "Email":
        return <Mail className="h-3.5 w-3.5 text-blue-600" />;
      case "Note":
      default:
        return <FileText className="h-3.5 w-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onQuickAddDeal={() => setIsAddDealOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title="Executive Sales Dashboard"
          subtitle="Ringkasan kinerja penjualan kuartal 4, alur prospek aktif, dan analitik konversi deal"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onAddContact={() => setIsAddContactOpen(true)}
          onAddDeal={() => setIsAddDealOpen(true)}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                <p className="text-xs font-semibold text-slate-500">
                  Memuat analitik penjualan...
                </p>
              </div>
            </div>
          ) : stats ? (
            <>
              {/* Executive Briefing Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-7 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-0.5 text-[11px] font-bold text-blue-300">
                      <Sparkles className="h-3 w-3" />
                      <span>Enterprise Sales Analytics • Q4 2026</span>
                    </div>

                    <h2 className="mt-2.5 text-xl sm:text-2xl font-black tracking-tight text-white">
                      Ringkasan Kinerja Penjualan & Pipeline
                    </h2>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                      Pantau pergerakan prospek bisnis secara real-time, evaluasi probabilitas closing, dan kelola interaksi klien dalam satu tampilan terpusat.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="/pipeline"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all backdrop-blur-xs cursor-pointer shadow-xs"
                    >
                      <Kanban className="h-4 w-4 text-blue-300" />
                      <span>Papan Kanban Pipeline</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4 Metric Cards - Strictly Aligned & Unified Heights */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* 1. Total Leads */}
                <div className="flex flex-col justify-between h-[152px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Leads
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
                      {stats.totalLeads}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +18% MoM
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] text-slate-500 font-medium">Database Klien</span>
                    <Link
                      href="/contacts"
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      {stats.totalContacts} kontak <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* 2. Active Pipeline */}
                <div className="flex flex-col justify-between h-[152px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Active Pipeline
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
                      <Briefcase className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
                      {stats.activeDealsCount}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      Sedang Berjalan
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] text-slate-500 font-medium">Estimasi Nilai</span>
                    <span className="text-[11px] font-black text-slate-900 tabular-nums">
                      {formatRupiahCompact(stats.activeDealsValue)}
                    </span>
                  </div>
                </div>

                {/* 3. Revenue Won */}
                <div className="flex flex-col justify-between h-[152px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Revenue Won
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="truncate">
                    <span className="text-2xl font-black tracking-tight text-slate-900 tabular-nums truncate block">
                      {formatRupiah(stats.totalRevenueWon)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2.5">
                    <span className="text-[11px] text-slate-500 font-medium">{stats.wonDealsCount} Deals Closing</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Closed Won
                    </span>
                  </div>
                </div>

                {/* 4. Conversion Rate */}
                <div className="flex flex-col justify-between h-[152px] rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Conversion Rate
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-2xs">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 tabular-nums">
                      {stats.conversionRate}%
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Win Ratio
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Sales Copilot - Clean High-Density Card */}
              <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-5 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                      <Zap className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                          AI Sales Copilot & Deal Health Insights
                        </h4>
                        <span className="rounded-full bg-blue-600 px-2 py-0.2 text-[9px] font-black text-white">
                          Smart Engine
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                        <div className="rounded-xl bg-white/80 p-2.5 border border-blue-100">
                          <span className="font-bold text-blue-700 block text-[11px] mb-0.5">
                            🔥 Hot Prospect • Finova Mandiri Capital (Rp 75 Jt)
                          </span>
                          <span className="text-slate-600 text-[11px] leading-relaxed">
                            Probabilitas closing 85% di tahap Proposal. Rekomendasi: kirim konfirmasi SLA WhatsApp hari ini.
                          </span>
                        </div>

                        <div className="rounded-xl bg-white/80 p-2.5 border border-blue-100">
                          <span className="font-bold text-indigo-700 block text-[11px] mb-0.5">
                            🎯 Peluang Ekspansi • Budi Santoso (Nusantara Digital)
                          </span>
                          <span className="text-slate-600 text-[11px] leading-relaxed">
                            Kontrak Enterprise aktif. Penjajakan ekspansi modul CRM ke 2 anak perusahaan kuartal depan.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/pipeline"
                    className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-xl bg-white border border-blue-200 px-4 py-2.5 text-xs font-bold text-blue-700 shadow-xs hover:bg-blue-50 transition-colors"
                  >
                    <span>Buka Kanban</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Visual Pipeline Funnel Breakdown */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Distribusi Tahapan Pipeline Penjualan
                    </h3>
                  </div>
                  <Link
                    href="/pipeline"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Kelola Kanban</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {stats.pipelineStages.map((stage) => {
                    const badge = getStageBadgeColor(stage.stage);
                    return (
                      <div
                        key={stage.stage}
                        className={`rounded-2xl border ${badge.border} ${badge.bg} p-4 transition-all hover:shadow-xs`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black uppercase tracking-wider ${badge.text}`}>
                            {stage.stage}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-2xs">
                            {stage.count} deal
                          </span>
                        </div>
                        <p className="mt-2.5 text-base sm:text-lg font-black text-slate-900 tabular-nums">
                          {formatRupiah(stage.value)}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{stage.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Grid: Activity Feed & High-Impact Deals */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left 6 cols: Activity Feed */}
                <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Log Aktivitas Komunikasi
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Real-time Feed
                    </span>
                  </div>

                  {/* Quick Activity Creator Bar */}
                  <form onSubmit={handleQuickActivity} className="mb-4 flex gap-2">
                    <select
                      value={quickType}
                      onChange={(e) => setQuickType(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden"
                    >
                      <option value="Note">📝 Catatan</option>
                      <option value="Call">📞 Telepon</option>
                      <option value="Meeting">👥 Rapat</option>
                      <option value="Email">✉️ Email</option>
                    </select>
                    <input
                      type="text"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      placeholder="Tulis ringkasan interaksi cepat..."
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={quickSubmitting || !quickTitle.trim()}
                      className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {quickSubmitting ? "..." : "Simpan"}
                    </button>
                  </form>

                  {/* Activities List */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
                    {stats.recentActivities.length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-400">
                        Belum ada aktivitas tercatat.
                      </div>
                    ) : (
                      stats.recentActivities.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200/80">
                            {getActivityIcon(act.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {act.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                {formatTimeAgo(act.createdAt)}
                              </span>
                            </div>
                            {act.content && (
                              <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {act.content}
                              </p>
                            )}
                            {act.contact && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${getAvatarBgClass(
                                    act.contact.avatarColor
                                  )}`}
                                >
                                  {getInitials(act.contact.name)}
                                </span>
                                <Link
                                  href={`/contacts/${act.contact.id}`}
                                  className="text-[11px] font-bold text-blue-600 hover:underline truncate"
                                >
                                  {act.contact.name}{" "}
                                  {act.contact.company && `• ${act.contact.company}`}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right 6 cols: High-Value Pipeline Deals */}
                <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-slate-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Prospek Deal Utama
                      </h3>
                    </div>
                    <Link
                      href="/pipeline"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Buka Semua ({stats.activeDealsCount + stats.wonDealsCount}) →
                    </Link>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[440px] pr-1">
                    {stats.recentDeals.length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-400">
                        Belum ada deal terdaftar.
                      </div>
                    ) : (
                      stats.recentDeals.map((deal) => {
                        const stageBadge = getStageBadgeColor(deal.stage);
                        const priorityBadge = getPriorityBadgeColor(deal.priority);
                        return (
                          <div
                            key={deal.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 p-3 hover:border-blue-300 hover:shadow-xs transition-all"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${stageBadge.bg} ${stageBadge.text} ${stageBadge.border}`}
                                >
                                  {deal.stage}
                                </span>
                                <span
                                  className={`rounded-md border px-1.5 py-0.5 text-[10px] ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}
                                >
                                  {deal.priority}
                                </span>
                              </div>
                              <h4 className="mt-1 text-xs font-bold text-slate-900 truncate">
                                {deal.title}
                              </h4>
                              {deal.contact && (
                                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5 font-medium">
                                  <Building className="h-3 w-3 text-slate-400" />
                                  <span>{deal.contact.company || deal.contact.name}</span>
                                </p>
                              )}
                            </div>

                            <div className="text-left sm:text-right shrink-0">
                              <p className="text-xs font-black text-slate-900 tabular-nums">
                                {formatRupiah(deal.value)}
                              </p>
                              <Link
                                href="/pipeline"
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 hover:underline mt-0.5"
                              >
                                <span>Lihat di Kanban</span>
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>

      {/* Global Modals */}
      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSuccess={fetchStats}
      />
      <AddDealModal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        onSuccess={fetchStats}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}
