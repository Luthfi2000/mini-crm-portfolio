"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, X, Copy, Check, Sparkles, PhoneCall, AlertCircle } from "lucide-react";
import { Deal } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface WhatsAppModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onActivityLogged?: () => void;
}

export function WhatsAppModal({
  deal,
  isOpen,
  onClose,
  onActivityLogged,
}: WhatsAppModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [logActivity, setLogActivity] = useState(true);
  const [sending, setSending] = useState(false);

  // Generate templates whenever deal changes
  const contactName = deal?.contact?.name || "Bapak/Ibu";
  const companyName = deal?.contact?.company || "Perusahaan";
  const dealTitle = deal?.title || "Proyek";
  const dealValueStr = deal ? formatRupiah(deal.value) : "Rp 0";
  const contactPhone = deal?.contact?.phone || "";

  // Normalize phone for WhatsApp API
  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    return clean;
  };

  const templates = [
    {
      id: 0,
      label: "📄 Follow-Up Penawaran (Quotation)",
      text: `Halo Bpk/Ibu ${contactName}, salam hormat dari Nusantara CRM.

Izin menindaklanjuti draf penawaran resmi untuk proyek "${dealTitle}" dengan estimasi nilai ${dealValueStr} yang sebelumnya telah kami siapkan.

Apakah dokumen tersebut sudah sempat ditinjau bersama manajemen ${companyName}? Jika ada klausul atau skema pembayaran yang perlu disesuaikan, kami siap mendiskusikannya. Terima kasih!`,
    },
    {
      id: 1,
      label: "📅 Jadwal Demo & Konsultasi Sistem",
      text: `Halo Bpk/Ibu ${contactName}, selamat siang.

Terkait penjajakan implementasi solusi CRM & digitalisasi penjualan untuk ${companyName}, apakah Bpk/Ibu ada waktu luang sekitar 15–20 menit minggu ini untuk kami demokan alur sistemnya secara online via Google Meet?

Kami siap mendemokan fitur 1-click Quotation, pelacakan target kuota sales, serta alur WhatsApp otomatis. Terima kasih!`,
    },
    {
      id: 2,
      label: "⚡ Sapaan Inbound Lead Baru",
      text: `Halo Bpk/Ibu ${contactName}, terima kasih telah menghubungi kami mengenai kebutuhan sistem CRM bisnis.

Saya ingin mengonfirmasi kebutuhan solusi untuk ${companyName}. Boleh kami tahu berapa perkiraan jumlah staf sales atau divisi yang nantinya akan menggunakan sistem ini agar kami dapat merekomendasikan skema deployment yang paling efisien?

Salam hangat,
Tim Konsultan Nusantara CRM`,
    },
  ];

  useEffect(() => {
    if (templates[selectedTemplate]) {
      setMessage(templates[selectedTemplate].text);
    }
  }, [selectedTemplate, deal]);

  if (!isOpen || !deal) return null;

  const cleanPhone = getCleanPhone(contactPhone);
  const hasValidPhone = cleanPhone.length >= 9;

  const handleSendWhatsApp = async () => {
    if (!hasValidPhone) {
      alert("Kontak ini belum memiliki nomor telepon atau format tidak valid.");
      return;
    }

    setSending(true);

    try {
      // 1. If checked, log activity automatically to record engagement and clear stale status
      if (logActivity) {
        await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "Call",
            title: `💬 Follow-Up WhatsApp Terkirim (${templates[selectedTemplate].label.split(" ")[1]})`,
            content: `Pesan dikirim ke WhatsApp (+${cleanPhone}):\n\n"${message.substring(0, 180)}..."`,
            contactId: deal.contactId,
            dealId: deal.id,
          }),
        });

        if (onActivityLogged) onActivityLogged();
      }

      // 2. Open WhatsApp Web / App
      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      onClose();
    } catch (err) {
      console.error("Gagal mencatat log aktivitas WhatsApp:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs border border-white/20">
              <MessageSquare className="h-5 w-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>WhatsApp Smart Follow-Up</span>
                <span className="rounded-full bg-emerald-500/40 border border-white/30 px-2 py-0.2 text-[9px] font-black uppercase text-emerald-100">
                  Direct Connect
                </span>
              </h3>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                Kirim pesan cepat terpersonalisasi langsung ke prospek deal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Target Recipient Card */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Penerima WhatsApp
              </span>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {contactName} {companyName && `• ${companyName}`}
              </p>
              <p className="text-[11px] font-mono font-semibold text-emerald-600 mt-0.5">
                {contactPhone ? `+${cleanPhone}` : "⚠️ Nomor WhatsApp belum terdaftar"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Deal
              </span>
              <p className="text-xs font-black text-slate-800 tabular-nums">
                {dealValueStr}
              </p>
            </div>
          </div>

          {!hasValidPhone && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                Kontak ini belum memiliki nomor HP yang valid. Silakan perbarui nomor kontak terlebih dahulu di menu Kontak.
              </span>
            </div>
          )}

          {/* Template Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Pilih Templat Pesan Cepat:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs ring-1 ring-emerald-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="line-clamp-1 text-[11px]">{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Isi Pesan (Dapat Dimodifikasi):
              </label>
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden leading-relaxed transition-all"
            />
          </div>

          {/* Auto Log Activity Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={logActivity}
              onChange={(e) => setLogActivity(e.target.checked)}
              className="h-4 w-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-600">
              Catat otomatis aktivitas interaksi ini ke log timeline deal (menghilangkan status mandek)
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!hasValidPhone || sending}
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{sending ? "Membuka WhatsApp..." : "Buka WhatsApp & Kirim"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
