"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  Edit,
  Trash2,
  ChevronRight,
  Briefcase,
  Loader2,
  Eye,
  Download,
  ArrowUpDown,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { EditContactModal } from "@/components/modals/EditContactModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddDealModal } from "@/components/modals/AddDealModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { Contact, ContactStatus } from "@/lib/types";
import {
  formatDate,
  formatRupiah,
  getAvatarBgClass,
  getInitials,
  getStatusBadgeColor,
  exportContactsToCSV,
} from "@/lib/utils";

function ContactsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "All";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [sortBy, setSortBy] = useState<"recent" | "name" | "value">("recent");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);

  // Modals state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dealContactId, setDealContactId] = useState<string | undefined>(undefined);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedStatus && selectedStatus !== "All") params.set("status", selectedStatus);

      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data kontak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCurrentUser(data.user);
          setPermissions(data.permissions);
        }
      })
      .catch(() => {});
  }, [selectedStatus]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Quick inline status change
  const handleInlineStatusChange = async (contactId: string, newStatus: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
    );

    try {
      await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
      fetchContacts();
    }
  };

  const canDeleteContact = Boolean(currentUser?.role === "ADMIN" || permissions?.canDeleteContacts);

  const handleDelete = async () => {
    if (!deletingContact) return;
    if (!canDeleteContact) {
      alert("Hanya Administrator yang memiliki wewenang menghapus data ini demi keamanan data (Data Loss Prevention).");
      setDeletingContact(null);
      return;
    }
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/contacts/${deletingContact.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingContact(null);
        fetchContacts();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus kontak.");
      }
    } catch (err) {
      console.error("Gagal menghapus kontak:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Sorting
  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "value") {
      const aVal = a.deals?.reduce((sum, d) => sum + d.value, 0) || 0;
      const bVal = b.deals?.reduce((sum, d) => sum + d.value, 0) || 0;
      return bVal - aVal;
    }
    // Default: recent
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const statusFilters = [
    { label: "Semua Klien", value: "All" },
    { label: "Lead", value: "Lead" },
    { label: "Prospect", value: "Prospect" },
    { label: "Customer", value: "Customer" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Quick summary counts
  const totalCustomer = contacts.filter((c) => c.status === "Customer").length;
  const totalProspect = contacts.filter((c) => c.status === "Prospect").length;
  const totalLead = contacts.filter((c) => c.status === "Lead").length;

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onQuickAddDeal={() => {
          setDealContactId(undefined);
          setIsAddDealOpen(true);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title="Direktori Kontak & Klien"
          subtitle="Database terpusat profil pelanggan, kontak personil, riwayat deal, dan histori interaksi"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onAddContact={() => setIsAddOpen(true)}
          onAddDeal={() => {
            setDealContactId(undefined);
            setIsAddDealOpen(true);
          }}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Metric Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Direktori
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900 tabular-nums">
                {contacts.length}
              </p>
              <span className="text-[11px] text-slate-500">Klien & Partner</span>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Active Customers
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-900 tabular-nums">
                {totalCustomer}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">Klien Aktif</span>
            </div>

            <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Prospects
              </span>
              <p className="mt-1 text-2xl font-black text-indigo-900 tabular-nums">
                {totalProspect}
              </p>
              <span className="text-[11px] text-indigo-700 font-medium">Terkualifikasi</span>
            </div>

            <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Leads Baru
              </span>
              <p className="mt-1 text-2xl font-black text-blue-900 tabular-nums">
                {totalLead}
              </p>
              <span className="text-[11px] text-blue-700 font-medium">Tahap Penjajakan</span>
            </div>
          </div>

          {/* Controls: Search, Filter Tabs, Sorting, & Export */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama klien, instansi/perusahaan, email, atau jabatan..."
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {statusFilters.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === tab.value
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sorting & Export Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="recent">Urut: Terbaru</option>
                <option value="name">Urut: Nama (A-Z)</option>
                <option value="value">Urut: Nilai Deal Terbesar</option>
              </select>

              <button
                onClick={() => {
                  if (permissions && !permissions.canExportCSV) {
                    alert("Akses Terbatas: Hanya peran Manager dan Administrator yang memiliki izin mengunduh data klien (Data Loss Prevention Policy).");
                    return;
                  }
                  exportContactsToCSV(contacts);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors shadow-2xs cursor-pointer ${
                  permissions && !permissions.canExportCSV
                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                title={
                  permissions && !permissions.canExportCSV
                    ? "Izin ekspor dibatasi untuk peran Manager & Admin"
                    : "Ekspor data klien ke file CSV"
                }
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  Ekspor CSV {permissions && !permissions.canExportCSV ? "🔒" : ""}
                </span>
              </button>
            </div>
          </div>

          {/* Contacts Data Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            {loading ? (
              <div className="flex h-72 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-xs font-semibold text-slate-500">Memuat direktori klien...</span>
                </div>
              </div>
            ) : sortedContacts.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-base font-bold text-slate-800">
                  Tidak ada kontak ditemukan
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `Tidak ada hasil yang sesuai dengan kata kunci "${searchQuery}".`
                    : "Belum ada kontak dengan kriteria status ini."}
                </p>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kontak Baru</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4 sm:px-6">Klien / Kontak Person</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Perusahaan & Posisi</th>
                      <th className="py-3.5 px-4">Status Klien</th>
                      <th className="py-3.5 px-4 hidden sm:table-cell">Nilai Pipeline Deals</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Tgl Terdaftar</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedContacts.map((contact) => {
                      const badge = getStatusBadgeColor(contact.status);
                      const totalDeals = contact.deals?.length || 0;
                      const totalValue =
                        contact.deals?.reduce((sum, d) => sum + d.value, 0) || 0;

                      return (
                        <tr
                          key={contact.id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Contact Info */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold shadow-sm ${getAvatarBgClass(
                                  contact.avatarColor
                                )}`}
                              >
                                {getInitials(contact.name)}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/contacts/${contact.id}`}
                                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs group-hover:underline"
                                >
                                  <span className="truncate">{contact.name}</span>
                                </Link>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[11px] text-slate-500 mt-0.5">
                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-1 truncate hover:text-blue-600 hover:underline"
                                  >
                                    <Mail className="h-3 w-3 text-slate-400" />
                                    {contact.email}
                                  </a>
                                  {contact.phone && (
                                    <a
                                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hidden sm:flex items-center gap-1 truncate text-emerald-600 hover:underline font-medium"
                                    >
                                      <MessageCircle className="h-3 w-3 text-emerald-500" />
                                      {contact.phone}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Company & Role */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <div className="font-bold text-slate-800 text-xs truncate max-w-[220px]">
                              {contact.company || "-"}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[220px] font-medium">
                              {contact.position || "Representative"}
                            </div>
                          </td>

                          {/* Interactive Status Pill */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center">
                              <select
                                value={contact.status}
                                onChange={(e) =>
                                  handleInlineStatusChange(contact.id, e.target.value as ContactStatus)
                                }
                                className={`text-[11px] font-bold rounded-full border px-2.5 py-1 ${badge.bg} ${badge.text} ${badge.border} cursor-pointer focus:outline-hidden`}
                              >
                                <option value="Lead">Lead</option>
                                <option value="Prospect">Prospect</option>
                                <option value="Customer">Customer</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                          </td>

                          {/* Deals summary */}
                          <td className="py-3.5 px-4 hidden sm:table-cell">
                            {totalDeals > 0 ? (
                              <div>
                                <span className="font-extrabold text-slate-900 text-xs tabular-nums">
                                  {formatRupiah(totalValue)}
                                </span>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {totalDeals} deal prospek
                                </p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Belum ada deal
                              </span>
                            )}
                          </td>

                          {/* Created At */}
                          <td className="py-3.5 px-4 hidden lg:table-cell text-[11px] text-slate-500 font-medium">
                            {formatDate(contact.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/contacts/${contact.id}`}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                title="Lihat Profil & Riwayat Interaksi"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setEditingContact(contact)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                                title="Edit Kontak"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeletingContact(contact)}
                                className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                                  canDeleteContact
                                    ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                    : "text-slate-300 hover:bg-amber-50 hover:text-amber-600"
                                }`}
                                title={
                                  canDeleteContact
                                    ? "Hapus Kontak (Admin Only)"
                                    : "Hanya Administrator yang memiliki wewenang menghapus data ini demi keamanan data (Data Loss Prevention)."
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchContacts}
      />
      <EditContactModal
        isOpen={!!editingContact}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onSuccess={fetchContacts}
      />
      <DeleteConfirmModal
        isOpen={!!deletingContact}
        title="Hapus Klien Ini?"
        message={`Apakah Anda yakin ingin menghapus "${deletingContact?.name}"? Seluruh deal dan riwayat interaksi terkait klien ini juga akan dihapus permanen.`}
        loading={deleteLoading}
        canDelete={canDeleteContact}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleDelete}
      />
      <AddDealModal
        isOpen={isAddDealOpen}
        preselectedContactId={dealContactId}
        onClose={() => setIsAddDealOpen(false)}
        onSuccess={fetchContacts}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ContactsContent />
    </Suspense>
  );
}
