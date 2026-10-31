"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Zap,
  Play,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2,
  Layers,
  Cpu,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { AgentExecutionLog, UserRole } from "@/lib/types";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default function AgentsPage() {
  const [logs, setLogs] = useState<AgentExecutionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Gagal memuat log agen:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRunAgent = async (action: "RUN_ALL" | "RUN_SDR" | "RUN_MANAGER" | "RUN_REVOPS") => {
    try {
      setRunningAgent(action);
      setExecutionMessage(null);

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (res.ok) {
        if (action === "RUN_ALL") {
          setExecutionMessage(
            `🚀 Ketiga AI Role Agents berhasil dieksekusi secara simultan/berbarengan (${data.durationMs}ms)! Data leads, prioritas deal, dan audit telah diperbarui.`
          );
        } else {
          setExecutionMessage(`✅ Agen berhasil menyelesaikan tugas dan memperbarui database.`);
        }
        fetchLogs();
      }
    } catch (err) {
      console.error("Gagal mengeksekusi agen:", err);
    } finally {
      setRunningAgent(null);
    }
  };

  const roleAgents = [
    {
      id: "RUN_SDR",
      name: "SDR Outreach Agent",
      role: "SALES_REP" as UserRole,
      roleBadge: "Role: Sales Rep",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      avatarBg: "bg-gradient-to-tr from-emerald-600 to-teal-500",
      description:
        "Memindai prospek/leads baru di database, melakukan evaluasi profil otomatis, dan mencatat draf panggilan/email perkenalan secara mandiri.",
      capabilities: [
        "Deteksi inbound lead berstatus 'Lead'",
        "Otomasi logging interaksi panggilan & intro email",
        "Pemberian skor kelayakan prospek",
      ],
      icon: Users,
    },
    {
      id: "RUN_MANAGER",
      name: "Pipeline Health Copilot",
      role: "MANAGER" as UserRole,
      roleBadge: "Role: Sales Manager",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      avatarBg: "bg-gradient-to-tr from-purple-600 to-indigo-600",
      description:
        "Menganalisis deal di tahap Qualified & Proposal, mengevaluasi probabilitas closing, menaikkan prioritas deal bernilai tinggi, dan mengawasi target tim.",
      capabilities: [
        "Audit kesehatan deal & proposal tertunda",
        "Penyesuaian tingkat prioritas (High/Medium)",
        "Rekomendasi tindak lanjut bagi tim AE",
      ],
      icon: Briefcase,
    },
    {
      id: "RUN_REVOPS",
      name: "RevOps Executive Analyst",
      role: "ADMIN" as UserRole,
      roleBadge: "Role: Administrator",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      avatarBg: "bg-gradient-to-tr from-blue-600 to-indigo-700",
      description:
        "Melakukan audit konversi kuartal, memproyeksikan target omset Q4, dan menyusun ringkasan eksekutif kesehatan pipeline untuk jajaran direksi.",
      capabilities: [
        "Kalkulasi Win Rate & rasio funnel",
        "Proyeksi revenue kuartal berjalan",
        "Pencatatan laporan audit komprehensif",
      ],
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title="Autonomous Role Agents Workspace"
          subtitle="Simulasi kolaborasi agen AI otonom untuk setiap peran internal (Sales Rep, Manager, Admin) yang bekerja secara berbarengan"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-xs">
                  <Cpu className="h-3.5 w-3.5 text-blue-300" />
                  <span>Multi-Agent System • Concurrent Workgroup Simulation</span>
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Agen AI Otonom Berbasis Peran (RBAC Agents)
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Setiap peran di internal CRM (Sales Rep, Sales Manager, dan Admin) memiliki agen AI mandiri yang dapat bekerja secara independen maupun <strong>dieksekusi secara bersamaan (*concurrently*)</strong> untuk mempercepat operasional bisnis.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => handleRunAgent("RUN_ALL")}
                  disabled={runningAgent !== null}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-indigo-500/30 hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {runningAgent === "RUN_ALL" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5 text-amber-300" />
                  )}
                  <span>Jalankan Semua Agent Berbarengan (Concurrent)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {executionMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs flex items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{executionMessage}</span>
              </div>
              <button
                onClick={() => setExecutionMessage(null)}
                className="text-emerald-600 hover:text-emerald-800 text-[11px]"
              >
                Tutup
              </button>
            </div>
          )}

          {/* 3 Role Agents Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleAgents.map((agent) => {
              const Icon = agent.icon;
              const isRunning = runningAgent === agent.id || runningAgent === "RUN_ALL";

              return (
                <div
                  key={agent.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon & Role Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md ${agent.avatarBg}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${agent.badgeColor}`}
                      >
                        {agent.roleBadge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-base font-black text-slate-900 tracking-tight">
                      {agent.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                      {agent.description}
                    </p>

                    {/* Capabilities list */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Kemampuan Otomasi:
                      </span>
                      <ul className="space-y-1.5">
                        {agent.capabilities.map((cap, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-600 flex items-center gap-2 font-medium"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action trigger button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleRunAgent(agent.id as any)}
                      disabled={runningAgent !== null}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all disabled:opacity-50 cursor-pointer group"
                    >
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5 text-blue-600 group-hover:text-white" />
                      )}
                      <span>
                        {isRunning ? "Sedang Bekerja..." : `Jalankan ${agent.name}`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Agent Execution Stream Log */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Log Eksekusi & Riwayat Kerja Agen
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Catatan hasil audit dan tugas yang diselesaikan oleh agen AI secara real-time
                  </p>
                </div>
              </div>

              <button
                onClick={fetchLogs}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Log</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Belum ada log eksekusi. Klik "Jalankan Semua Agent Berbarengan" di atas.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {logs.map((log) => {
                  const roleBadge =
                    log.agentRole === "ADMIN"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : log.agentRole === "MANAGER"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200";

                  return (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-black ${roleBadge}`}
                            >
                              {log.agentRole}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900">
                              {log.agentName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {log.task}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
                            {log.summary}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-medium text-slate-400 block">
                            {formatTimeAgo(log.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Sukses</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}
