"use client";

import { useState } from "react";
import {
  Phone,
  Users,
  Mail,
  FileText,
  Plus,
  Trash2,
  Loader2,
  Send,
  MessageSquare,
  Clock,
  Filter,
} from "lucide-react";
import { Activity, ActivityType } from "@/lib/types";
import { formatDate, formatTimeAgo } from "@/lib/utils";

interface ActivityTimelineProps {
  contactId?: string;
  dealId?: string;
  activities: Activity[];
  onActivityAdded: () => void;
  onActivityDeleted?: () => void;
}

export function ActivityTimeline({
  contactId,
  dealId,
  activities,
  onActivityAdded,
  onActivityDeleted,
}: ActivityTimelineProps) {
  const [type, setType] = useState<ActivityType>("Note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getActivityIcon = (actType: string) => {
    switch (actType) {
      case "Call":
        return <Phone className="h-4 w-4 text-emerald-600" />;
      case "Meeting":
        return <Users className="h-4 w-4 text-purple-600" />;
      case "Email":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "Note":
      default:
        return <FileText className="h-4 w-4 text-amber-600" />;
    }
  };

  const getActivityBadgeBg = (actType: string) => {
    switch (actType) {
      case "Call":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "Meeting":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "Email":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Note":
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul catatan wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim(),
          content: content.trim() || null,
          contactId: contactId || null,
          dealId: dealId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan aktivitas");
      }

      setTitle("");
      setContent("");
      setType("Note");
      onActivityAdded();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/activities?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onActivityDeleted) onActivityDeleted();
        else onActivityAdded();
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === "All") return true;
    return act.type === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Activity Input Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Catat Interaksi Baru
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Pilih kategori interaksi</span>
        </div>

        {error && (
          <div className="mb-3 rounded-xl bg-rose-50 p-2.5 text-xs font-medium text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Category buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "Note", label: "Catatan (Note)", icon: FileText },
                { id: "Call", label: "Panggilan (Call)", icon: Phone },
                { id: "Meeting", label: "Rapat (Meeting)", icon: Users },
                { id: "Email", label: "Email", icon: Mail },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ringkasan topik (cth: Diskusi SLA WhatsApp & Demo Dashboard)"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
          />

          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan poin hasil diskusi, kesepakatan harga, jadwal rapat lanjutan, atau kebutuhan teknis..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
          />

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Simpan Catatan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Activity Feed Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Riwayat Komunikasi ({activities.length})
            </h4>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1">
            {(["All", "Note", "Call", "Meeting", "Email"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                  selectedFilter === f
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "All" ? "Semua" : f}
              </button>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-xs font-bold text-slate-700">
              Belum ada riwayat aktivitas untuk filter ini
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tulis catatan di atas untuk menambahkan jejak komunikasi pertama.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-200">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Icon Badge */}
                <div
                  className={`absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-2xs ${getActivityBadgeBg(
                    act.type
                  )}`}
                >
                  {getActivityIcon(act.type)}
                </div>

                {/* Content Box */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${getActivityBadgeBg(
                            act.type
                          )}`}
                        >
                          {act.type}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          {act.title}
                        </h5>
                      </div>

                      {act.content && (
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-normal">
                          {act.content}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium text-slate-400">
                        {formatTimeAgo(act.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDelete(act.id)}
                        disabled={deletingId === act.id}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all rounded-md cursor-pointer"
                        title="Hapus aktivitas"
                      >
                        {deletingId === act.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
