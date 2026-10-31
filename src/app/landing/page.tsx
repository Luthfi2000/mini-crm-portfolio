"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Kanban,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Server,
  Zap,
  ArrowRight,
  Send,
  Building2,
  Users,
  Target,
  Sparkles,
  Phone,
  Mail,
  Check,
  ChevronRight,
  Clock,
  Layers,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    needs: "Private Cloud & Custom Implementation (Rp 15 Jt)",
    estimatedBudget: "15000000",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Gagal mengirimkan permohonan demo.");
      }
    } catch (err) {
      console.error("Inbound lead submission error:", err);
      setErrorMsg("Koneksi terputus. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Top Enterprise Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex h-18 items-center justify-between px-4 sm:px-8">
          {/* Brand */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block">
                Nusantara<span className="text-blue-600">CRM</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">
                B2B Sales & IT Solution
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#perbandingan" className="hover:text-blue-600 transition-colors">
              Mengapa Kami?
            </a>
            <a href="#paket" className="hover:text-blue-600 transition-colors">
              Paket Solusi IT
            </a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">
              Jadwal Demo
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-2xs"
            >
              Masuk Portal CRM
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
            >
              <span>Konsultasi Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-[1300px] mx-auto px-4 sm:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Solusi IT Penjualan Terintegrasi untuk Bisnis Indonesia</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Tingkatkan Omset & Kinerja Tim Sales dengan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Sistem CRM Terpadu
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hentikan prospek bisnis yang hilang atau lupa di-follow up. Kelola alur penjualan interaktif, cetak surat penawaran resmi (PDF) 1-klik, dan hubungi prospek via WhatsApp langsung dari satu platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 text-sm font-extrabold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <span>Ajukan Konsultasi & Demo Solusi</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-7 py-3.5 text-sm font-extrabold shadow-xs transition-all"
            >
              <span>Lihat Demo Interaktif (Login)</span>
            </Link>
          </div>

          {/* Trust Value Points */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto border-t border-slate-200/80 pt-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">100% Data Privat & Aman</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Tanpa Minimum User</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">WhatsApp Follow-Up</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Standar B2B Indonesia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="fitur" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
              Fitur Yang Mendorong Penjualan
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dirancang untuk Kecepatan dan Efisiensi Tim Sales Lapangan
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-500">
              Semua alat yang dibutuhkan pemilik bisnis dan sales manager untuk memonitor deal bernilai tinggi tanpa birokrasi perangkat lunak yang rumit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fitur 1: Kanban Pipeline */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 hover:bg-white hover:shadow-lg hover:border-blue-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Kanban className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Papan Kanban Drag & Drop
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kelola prospek dari tahap Inbound, Qualified, Proposal, hingga Closing secara visual dengan total nilai akumulasi Rupiah per tahapan.
              </p>
            </div>

            {/* Fitur 2: 1-Click Quotation PDF */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 hover:bg-white hover:shadow-lg hover:border-emerald-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1-Click Surat Penawaran (PDF)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate dokumen penawaran resmi berstandar A4 lengkap dengan rincian PPN 11%, term pembayaran, dan tanda tangan digital dalam 5 detik.
              </p>
            </div>

            {/* Fitur 3: WhatsApp Smart Connect */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 hover:bg-white hover:shadow-lg hover:border-teal-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                WhatsApp Direct Follow-Up
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hubungi klien via WhatsApp dengan templat otomatis cerdas (sapaan, follow-up proposal, jadwal demo) dan pencatatan riwayat otomatis.
              </p>
            </div>

            {/* Fitur 4: Quota & Data Protection */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 hover:bg-white hover:shadow-lg hover:border-purple-300 transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Target Kuota & Keamanan RBAC
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor pencapaian target penjualan tim sales kuartalan, dengan proteksi Data Loss Prevention agar data prospek aman dari penghapusan sepihak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section: Why Nusantara CRM */}
      <section id="perbandingan" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
              Perbandingan Pasar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mengapa Nusantara CRM Lebih Cocok Dibanding Alternatif Lain?
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-700">Faktor Evaluasi</th>
                  <th className="p-4 font-black text-blue-700 bg-blue-50/60">Nusantara CRM</th>
                  <th className="p-4 font-semibold text-slate-500">Kompetitor Lokal (Barantum/Qontak)</th>
                  <th className="p-4 font-semibold text-slate-500">SaaS Global (HubSpot/Salesforce)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-slate-800">Minimum Akun / Pengguna</td>
                  <td className="p-4 font-black text-emerald-600 bg-blue-50/30">Mulai dari 1 User</td>
                  <td className="p-4 text-slate-600">Wajib 3–5 Akun (Rp 10–25 Jt dimuka)</td>
                  <td className="p-4 text-slate-600">Tergantung Paket (US Dollar)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Pilihan Private Cloud / On-Premise</td>
                  <td className="p-4 font-black text-emerald-600 bg-blue-50/30">Ya, Bisa di Server Sendiri</td>
                  <td className="p-4 text-slate-500">Hanya Cloud Multi-tenant</td>
                  <td className="p-4 text-slate-500">Hanya Cloud Multi-tenant Global</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Cetak Surat Penawaran Resmi (PDF)</td>
                  <td className="p-4 font-black text-emerald-600 bg-blue-50/30">1-Klik Siap Cetak (A4 & PPN)</td>
                  <td className="p-4 text-slate-600">Perlu Integrasi Tambahan</td>
                  <td className="p-4 text-slate-500">Format USD/Global</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Kemudahan Implementasi</td>
                  <td className="p-4 font-black text-emerald-600 bg-blue-50/30">Langsung Pakai Hari Ini</td>
                  <td className="p-4 text-slate-600">Pelatihan & Onboarding Berhari-hari</td>
                  <td className="p-4 text-slate-500">Setup Konsultan 1–3 Bulan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Pricing & IT Solution Packages */}
      <section id="paket" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block mb-1">
              Skema Investasi & Solusi IT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pilih Paket Sesuai Kebutuhan & Skala Bisnis Anda
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Tersedia opsi langganan cloud fleksibel hingga implementasi private server untuk korporat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Paket 1: Cloud SaaS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Paket Bisnis
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    Cloud Multi-Tenant
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-black text-slate-900">Cloud SaaS Starter</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Untuk tim kecil yang butuh sistem CRM instan tanpa repot kelola server.
                </p>

                <div className="mt-6 border-y border-slate-100 py-4">
                  <span className="text-3xl font-black text-slate-900">Rp 149.000</span>
                  <span className="text-xs text-slate-400 font-medium"> / user / bulan</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Papan Kanban Pipeline Lengkap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Cetak Surat Penawaran (Quotation PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>WhatsApp Follow-Up Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Monitoring Target Kuota Sales</span>
                  </li>
                </ul>
              </div>

              <a
                href="#demo"
                className="mt-8 block text-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold transition-colors cursor-pointer"
              >
                Pilih Paket Cloud
              </a>
            </div>

            {/* Paket 2: Private Cloud Implementation (Featured) */}
            <div className="relative rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50/50 via-white to-white p-7 shadow-xl shadow-blue-500/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-1 text-[11px] font-black text-white shadow-md">
                ⭐ PALING DIMINATI KORPORAT
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Solusi IT Korporat
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-700">
                    Private Deployment
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-black text-slate-900">Private Server & Custom</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Software diinstal di VPS / Private Cloud perusahaan Anda dengan merek & logo sendiri.
                </p>

                <div className="mt-6 border-y border-blue-100 py-4">
                  <span className="text-3xl font-black text-slate-900">Rp 15.000.000</span>
                  <span className="text-xs text-slate-400 font-medium"> (One-time Setup)</span>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">
                    + Maintenance SLA Rp 1.500.000 / bulan
                  </p>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-bold">Database 100% Privat di Server Klien</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Kustomisasi Logo & Kop Surat Resmi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Unlimited User / Pengguna Internal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Training Staf & Prioritas Dukungan Teknis</span>
                  </li>
                </ul>
              </div>

              <a
                href="#demo"
                className="mt-8 block text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Konsultasikan Implementasi
              </a>
            </div>

            {/* Paket 3: White-Label Agency */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Kemitraan Agensi
                  </span>
                  <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold">
                    Full Reseller License
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-black text-slate-900">White-Label Partner</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Untuk software house yang ingin memiliki produk CRM siap jual ke klien mereka.
                </p>

                <div className="mt-6 border-y border-slate-100 py-4">
                  <span className="text-3xl font-black text-slate-900">Rp 35.000.000</span>
                  <span className="text-xs text-slate-400 font-medium"> (Full Source Code)</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Akses Penuh Full Source Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Hak Menjual Ulang Tanpa Royalti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Bebas Kustomisasi Modul Tambahan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Dokumentasi Arsitektur Lengkap</span>
                  </li>
                </ul>
              </div>

              <a
                href="#demo"
                className="mt-8 block text-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold transition-colors cursor-pointer"
              >
                Hubungi Kemitraan Agensi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Inbound Web-to-Lead Form */}
      <section id="demo" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="rounded-3xl border border-slate-800 bg-slate-800/60 backdrop-blur-md p-8 sm:p-12 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 block mb-1">
                Konsultasi & Demo Solusi IT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Diskusikan Kebutuhan Digitalisasi Sales Bisnis Anda
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                Isi formulir di bawah ini. Permintaan Anda akan langsung tercatat di papan pipeline CRM kami dan tim konsultan kami akan menghubungi Anda via WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black text-white">Permohonan Demo Berhasil Diterima!</h3>
                <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Terima kasih, <strong>{formData.name}</strong>. Data Anda telah otomatis tercatat ke dalam sistem Nusantara CRM. Konsultan solusi kami akan segera mengirimkan konfirmasi jadwal via WhatsApp (+{formData.phone}).
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                >
                  Kirim Permintaan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Budi Santoso"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Email Bisnis *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@perusahaan.co.id"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Nama Perusahaan / Bisnis
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="PT Nusantara Digital Jaya"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Kebutuhan Solusi
                  </label>
                  <select
                    value={formData.needs}
                    onChange={(e) => {
                      const val = e.target.value;
                      let est = "15000000";
                      if (val.includes("SaaS")) est = "1800000";
                      if (val.includes("Reseller")) est = "35000000";
                      setFormData({ ...formData, needs: val, estimatedBudget: est });
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Private Cloud & Custom Implementation (Rp 15 Jt)">
                      Private Server & Custom Implementation (Instalasi di Server Privat Klien)
                    </option>
                    <option value="Cloud SaaS Starter (Rp 149 Rb/User)">
                      Cloud SaaS Berlangganan (Tim Sales & Prospek)
                    </option>
                    <option value="White-Label & Reseller License (Rp 35 Jt)">
                      Kemitraan Agensi / White-Label Source Code
                    </option>
                    <option value="Custom IT Solution lainnya">
                      Kustomisasi Solusi IT & Modul Khusus Lainnya
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Catatan atau Kebutuhan Spesifik (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Contoh: Kami memiliki 5 staf sales dan membutuhkan integrasi PDF penawaran resmi..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-xs font-black shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? "Mendaftarkan ke Pipeline..." : "Kirim Permintaan Konsultasi Demo"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Nusantara CRM</span>
            <span>• Solusi IT & Digitalisasi Penjualan</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-blue-600 transition-colors">
              Portal Login
            </Link>
            <Link href="/landing" className="hover:text-blue-600 transition-colors">
              Profil Produk
            </Link>
            <span className="text-slate-400">© 2026 Luthfi Aditya. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
