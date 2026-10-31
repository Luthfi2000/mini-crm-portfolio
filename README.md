# 🚀 Nusantara CRM - Enterprise Sales & Operations Platform

A world-class, ultra-lightweight, and modern **Enterprise Mini CRM** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Prisma ORM with SQLite**.

Designed specifically for internal team operations with **Role-Based Access Control (RBAC)**, interactive Kanban sales pipeline, and strict Data Loss Prevention (DLP).

📖 **Untuk spesifikasi teknis mendalam, diagram Mermaid, skema relasi ERD, dan dokumentasi REST API lengkap, silakan lihat [ARCHITECTURE.md](./ARCHITECTURE.md).**

---

## ✨ Fitur Utama (Key Capabilities)

### 1. 🔐 Autentikasi & Role-Based Access Control (RBAC)
- **Halaman Login & Register:** Desain modern berbasis *cryptographic password hashing* (`crypto.scrypt`) dan *signed HTTP-only cookie sessions*.
- **Quick Demo Login (1-Klik):** Tersedia tombol pintasan masuk untuk 3 peran utama agar mempermudah evaluasi portofolio:
  - 👑 **Administrator (`ADMIN`):** Hak akses penuh, manajemen pengguna tim, penghapusan data master, ekspor CSV, dan audit sistem.
  - 💼 **Sales Manager (`MANAGER`):** Pengawasan pipeline tim, persetujuan proposal, ekspor CSV, penyesuaian prioritas deal.
  - 🎯 **Sales Representative (`SALES_REP`):** Pengelolaan prospek pribadi, pencatatan aktivitas panggilan/rapat, pembaharuan tahap kanban (fitur ekspor dan hapus dibatasi demi *Data Loss Prevention*).
- **Quick Role Switcher:** Tombol tukar peran instan di header navigasi untuk menguji perilaku antarmuka secara *real-time*.
- **Halaman Manajemen Tim (`/team`):** Tabel direktori seluruh anggota tim internal beserta **Matriks Hak Akses (Permissions Matrix)**.

### 2. 📊 Executive Sales Dashboard (`/`)
- **Metrik KPI:** Total Leads (+18% MoM), Active Pipeline Value, Total Revenue Won, dan Conversion Rate.
- **Sales Quota & Revenue Target Tracker:** Monitoring capaian omset real-time vs target kuartalan perusahaan (Rp 500 Jt) beserta leaderboard progres capaian per individu sales rep.
- **Executive Deal Insights & Stale Deals Auto-Alert:** Rekomendasi prospek panas (*hot leads*) serta peringatan visual otomatis untuk deal yang mandek tanpa interaksi.
- **Quick Activity Logger:** Form pencatatan interaksi langsung di dashboard tanpa berpindah halaman.
- **Distribusi Funnel Pipeline:** Visualisasi sebaran nominal deal di 4 tahap penjualan.

### 3. 👥 Direktori Kontak & Klien (`/contacts`)
- **Tabel Klien Interaktif:** Avatar bergradien, kontak person, email, dan WhatsApp langsung (`wa.me`).
- **Inline Status Switcher:** Ubah status klien (*Lead, Prospect, Customer, Inactive*) langsung di baris tabel.
- **1-Click Export CSV:** Ekspor data klien ke file `.csv` (dilindungi aturan keamanan RBAC untuk peran Manager & Admin).
- **Pencarian Real-Time & Pengurutan:** Filter nama/perusahaan dan sortir berdasarkan nilai deal terbesar.

### 4. 🗂️ Pipeline Deals Kanban (`/pipeline`)
- **Papan Kanban 4 Tahap:** *Lead Inbound*, *Qualified*, *Proposal*, dan *Closed Won*.
- **Drag-and-Drop:** Geser kartu prospek antar kolom secara responsif dengan *optimistic UI updates*.
- **1-Click Quotation & Invoice PDF Generator:** Cetak dokumen surat penawaran harga resmi (*Official Quotation*) berstandar A4 print-ready lengkap dengan nomor dokumen, rincian biaya, syarat pembayaran, dan legalitas tanda tangan.
- **Stale Deal Warning Badges:** Badge peringatan *"Mandek X Hari"* pada kartu prospek yang memerlukan follow-up segera.
- **Indikator Prioritas 4px:** Garis aksen warna di tepi kiri kartu (Merah = High, Kuning = Medium, Abu-abu = Low).
- **Pintasan 1-Klik:** Pemindah tahap cepat dan tombol `+ Tambah ke Tahap Ini` di setiap kolom.

### 5. 📝 Detail Profil Klien & Histori Interaksi (`/contacts/[id]`)
- Ringkasan profil eksekutif klien, statistik transaksi, dan daftar deal terkait.
- **Activity & Notes Timeline:** Filter riwayat komunikasi berdasarkan *Catatan*, *Panggilan*, *Rapat*, atau *Email*.

---

## 👥 Akun Demo Internal (Tersedia Otomatis)

| Peran (Role) | Email Login | Password | Kewenangan Utama |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@nusantaracrm.id` | `Admin123!` | Akses penuh, hapus data, kelola tim, ekspor CSV |
| **MANAGER** | `manager@nusantaracrm.id` | `Manager123!` | Monitoring pipeline, approval proposal, ekspor CSV |
| **SALES_REP** | `rep@nusantaracrm.id` | `Sales123!` | Kelola lead & deal pribadi, catat interaksi |
| **SUPPORT** | `support@nusantaracrm.id` | `Support123!` | Customer success & riwayat komunikasi |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server-side API Routes, Client Components)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [SQLite](https://sqlite.org/) (File lokal `prisma/dev.db`, sangat ringan dan tanpa server eksternal)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Keamanan:** Node.js Native Cryptographic Hashing (`scrypt`) & Signed HTTP-only Cookie Sessions
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS Compiler
- **Ikon:** [Lucide React](https://lucide.dev/)

---

## 🚀 Menjalankan Aplikasi Secara Lokal

1. **Buka folder proyek:**
   ```bash
   cd mini-crm-portfolio
   ```

2. **Sinkronkan database & jalankan seed data:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

Buka peramban di [http://localhost:3000](http://localhost:3000).
Gunakan tombol **"Akun Demo Cepat"** di halaman login untuk langsung menjelajahi aplikasi!
