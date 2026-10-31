"use client";

import { useState } from "react";
import { X, Edit, Loader2 } from "lucide-react";
import { Deal, DealPriority, DealStage } from "@/lib/types";

interface EditDealModalProps {
  isOpen: boolean;
  deal: Deal | null;
  onClose: () => void;
  onSuccess: () => void;
}

function EditDealForm({
  deal,
  onClose,
  onSuccess,
}: {
  deal: Deal;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(deal.title || "");
  const [value, setValue] = useState(deal.value ? deal.value.toString() : "0");
  const [stage, setStage] = useState<DealStage>(deal.stage || "Lead");
  const [priority, setPriority] = useState<DealPriority>(deal.priority || "Medium");
  const [expectedClose, setExpectedClose] = useState(() => {
    if (deal.expectedClose) {
      const d = new Date(deal.expectedClose);
      return d.toISOString().split("T")[0];
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul deal wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const numericValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;

      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          value: numericValue,
          stage,
          priority,
          expectedClose: expectedClose || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal memperbarui deal.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-7 z-10 max-h-[90vh] overflow-y-auto border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-xs">
              <Edit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Perbarui Prospek Deal</h3>
              <p className="text-xs text-slate-500 font-medium">
                Klien: {deal.contact?.name} {deal.contact?.company ? `(${deal.contact.company})` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Judul Prospek / Proyek (Deal Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Nilai Deal (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500000"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Tahapan Pipeline (Stage)
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Lead">1. Lead</option>
                <option value="Qualified">2. Qualified</option>
                <option value="Proposal">3. Proposal</option>
                <option value="Won">4. Won (Closed Won)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as DealPriority)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Low">Low (Rendah)</option>
                <option value="Medium">Medium (Sedang)</option>
                <option value="High">High (Tinggi / Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                Target Tanggal Closing
              </label>
              <input
                type="date"
                value={expectedClose}
                onChange={(e) => setExpectedClose(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditDealModal({
  isOpen,
  deal,
  onClose,
  onSuccess,
}: EditDealModalProps) {
  if (!isOpen || !deal) return null;

  return (
    <EditDealForm
      key={deal.id}
      deal={deal}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}
