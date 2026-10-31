"use client";

import { useRef } from "react";
import {
  X,
  Printer,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import { Deal } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/utils";

interface QuotationModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuotationModal({ deal, isOpen, onClose }: QuotationModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !deal) return null;

  const handlePrint = () => {
    window.print();
  };

  const quotationNumber = `QUO/${new Date().getFullYear()}/${deal.id.slice(-6).toUpperCase()}`;
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 14);

  // Subtotal & Tax Calculation (PPN 11% inclusive estimate)
  const totalValue = deal.value;
  const subtotal = Math.round(totalValue / 1.11);
  const ppn = totalValue - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #quotation-print-area,
          #quotation-print-area * {
            visibility: visible;
          }
          #quotation-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-800">
              Pratinjau Surat Penawaran Resmi (Quotation PDF)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/50">
          <div
            id="quotation-print-area"
            ref={printRef}
            className="mx-auto max-w-2xl bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm text-slate-800 font-sans"
          >
            {/* Header: Company Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg">
                    N
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-slate-900">
                      PT NUSANTARA CRM INDONESIA
                    </h1>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Enterprise Sales & Customer Management Solutions
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  One Pacific Place, Lantai 15, SCBD<br />
                  Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190<br />
                  Email: corporate@nusantaracrm.id • Telp: (021) 5088-7890
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-black text-blue-700 uppercase tracking-wider mb-2">
                  Official Quotation
                </span>
                <p className="text-xs font-bold text-slate-900">
                  No: <span className="font-mono">{quotationNumber}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tanggal: {formatDate(new Date())}
                </p>
                <p className="text-[11px] text-rose-600 font-bold mt-0.5">
                  Berlaku hingga: {formatDate(validUntilDate)}
                </p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Ditujukan Kepada (Client Information):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {deal.contact?.name || "Klien Terhormat"}
                  </p>
                  <p className="text-slate-600 font-medium mt-0.5">
                    {deal.contact?.position ? `${deal.contact.position} • ` : ""}
                    <strong>{deal.contact?.company || "Perusahaan Mitra"}</strong>
                  </p>
                </div>
                <div className="sm:text-right text-slate-600 space-y-0.5">
                  {deal.contact?.email && (
                    <p className="flex items-center gap-1 sm:justify-end">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span>{deal.contact.email}</span>
                    </p>
                  )}
                  {deal.contact?.phone && (
                    <p className="flex items-center gap-1 sm:justify-end">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span>{deal.contact.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Proposal Scope & Line Items */}
            <div className="mt-6">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                Rincian Penawaran Proyek
              </h2>
              <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs">
                <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Deskripsi Layanan & Ruang Lingkup</th>
                    <th className="py-2.5 px-3 text-center">Tahap</th>
                    <th className="py-2.5 px-3 text-right">Nilai Investasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-3 align-top">
                      <p className="font-bold text-slate-900 text-xs">{deal.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Implementasi sistem CRM enterprise terintegrasi, konfigurasi hak akses RBAC, pelacakan pipeline sales, pelatihan pengguna tim, dan dukungan teknis SLA garansi 30 hari.
                      </p>
                    </td>
                    <td className="py-4 px-3 text-center align-top">
                      <span className="inline-block rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-slate-900 tabular-nums align-top">
                      {formatRupiah(subtotal)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={2} className="py-2 px-3 text-right text-slate-600">
                      Subtotal
                    </td>
                    <td className="py-2 px-3 text-right text-slate-900 tabular-nums">
                      {formatRupiah(subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="py-1.5 px-3 text-right text-slate-500 text-[11px] font-normal">
                      PPN (11%)
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600 tabular-nums text-[11px]">
                      {formatRupiah(ppn)}
                    </td>
                  </tr>
                  <tr className="border-t border-slate-300 text-slate-900 font-extrabold text-sm bg-blue-50/50">
                    <td colSpan={2} className="py-3 px-3 text-right text-blue-900">
                      TOTAL INVESTASI (NETTO)
                    </td>
                    <td className="py-3 px-3 text-right text-blue-700 tabular-nums">
                      {formatRupiah(totalValue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terms & Payment Conditions */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] space-y-1.5 text-slate-600">
              <p className="font-extrabold text-slate-800 text-xs">
                Syarat & Ketentuan Pembayaran (Term of Payment):
              </p>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>Uang Muka (DP) sebesar 50% setelah penandatanganan Purchase Order (PO) / Surat Perjanjian Kerja.</li>
                <li>Pelunasan 50% setelah serah terima sistem (User Acceptance Test - UAT) selesai.</li>
                <li>Pembayaran ditransfer ke rekening resmi: <strong>Bank Mandiri 123-000-888-999 a/n PT Nusantara CRM Indonesia</strong>.</li>
                <li>Penawaran ini bersifat mengikat hingga tanggal berlaku yang tertera di atas.</li>
              </ul>
            </div>

            {/* Signature & Sign-off Block */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-500 font-medium">Disiapkan Oleh:</p>
                <p className="font-extrabold text-slate-900 mt-1">PT Nusantara CRM Indonesia</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[10px] text-blue-600 font-mono tracking-widest uppercase border border-dashed border-blue-300 rounded px-2 py-1">
                    [SIGNED & VERIFIED]
                  </span>
                </div>
                <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 mx-6">
                  Account Executive
                </p>
              </div>

              <div>
                <p className="text-slate-500 font-medium">Disetujui Oleh (Klien):</p>
                <p className="font-extrabold text-slate-900 mt-1">
                  {deal.contact?.company || "Pihak Pembeli"}
                </p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 italic">
                    (Tanda Tangan & Stempel)
                  </span>
                </div>
                <p className="font-bold text-slate-900 border-t border-slate-300 pt-1 mx-6">
                  {deal.contact?.name || "Pejabat Berwenang"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
