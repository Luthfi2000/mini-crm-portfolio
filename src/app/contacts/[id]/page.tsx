"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  FileText,
  DollarSign,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { EditContactModal } from "@/components/modals/EditContactModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddDealModal } from "@/components/modals/AddDealModal";
import { EditDealModal } from "@/components/modals/EditDealModal";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import { Contact, Deal } from "@/lib/types";
import {
  formatDate,
  formatRupiah,
  getAvatarBgClass,
  getInitials,
  getStageBadgeColor,
  getPriorityBadgeColor,
  getStatusBadgeColor,
} from "@/lib/utils";

interface ContactDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ContactDetailPage(props: ContactDetailPageProps) {
  const router = useRouter();
  const { id } = use(props.params);

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isDeleteContactOpen, setIsDeleteContactOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setContact(data);
      } else {
        router.push("/contacts");
      }
    } catch (err) {
      console.error("Gagal memuat detail kontak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const handleDeleteContact = async () => {
    if (!contact) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/contacts");
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusBadge = contact ? getStatusBadgeColor(contact.status) : null;
  const totalDealsValue =
    contact?.deals?.reduce((sum, d) => sum + d.value, 0) || 0;
  const wonDealsValue =
    contact?.deals
      ?.filter((d) => d.stage === "Won")
      .reduce((sum, d) => sum + d.value, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onQuickAddDeal={() => setIsAddDealOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          title={contact ? contact.name : "Detail Klien"}
          subtitle="Profil komprehensif, daftar proyek/deal terkait, dan histori aktivitas komunikasi"
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onAddContact={() => router.push("/contacts")}
          onAddDeal={() => setIsAddDealOpen(true)}
          onOpenQuickSearch={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Breadcrumb / Back Link */}
          <div>
            <Link
              href="/contacts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Direktori Kontak</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-xs font-semibold text-slate-500">
                  Memuat profil klien...
                </span>
              </div>
            </div>
          ) : contact ? (
            <>
              {/* Profile Card Header */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Left: Avatar & Basic Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl text-xl sm:text-2xl font-black shadow-md ${getAvatarBgClass(
                        contact.avatarColor
                      )}`}
                    >
                      {getInitials(contact.name)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {contact.name}
                        </h2>
                        {statusBadge && (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`}
                            />
                            <span>{contact.status}</span>
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span>{contact.company || "Perusahaan Mandiri"}</span>
                        {contact.position && (
                          <span className="text-slate-400 font-normal">
                            • {contact.position}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {contact.phone && (
                      <a
                        href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span>Kirim Email</span>
                    </a>

                    <button
                      onClick={() => setIsEditContactOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit Profil</span>
                    </button>

                    <button
                      onClick={() => setIsDeleteContactOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Pills Bar */}
                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 border-t border-slate-100 pt-6">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Total Nilai Deals
                    </span>
                    <p className="mt-1 text-base font-black text-slate-900 tabular-nums">
                      {formatRupiah(totalDealsValue)}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {contact.deals?.length || 0} proyek terdaftar
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Closed Won Revenue
                    </span>
                    <p className="mt-1 text-base font-black text-emerald-900 tabular-nums">
                      {formatRupiah(wonDealsValue)}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Omset terealisasi
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email Klien
                    </span>
                    <p className="mt-1 text-xs font-bold text-slate-800 truncate">
                      {contact.email}
                    </p>
                    <span className="text-[10px] text-slate-400">Alamat Korespondensi</span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Terdaftar Sejak
                    </span>
                    <p className="mt-1 text-xs font-bold text-slate-800">
                      {formatDate(contact.createdAt)}
                    </p>
                    <span className="text-[10px] text-slate-400">Member ID: {contact.id.slice(-6)}</span>
                  </div>
                </div>

                {/* Client Notes Callout */}
                {contact.notes && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Catatan Profil Klien
                    </span>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
                      {contact.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Two Column Layout: Deals List & Activity Feed */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Associated Deals (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Prospek Deals ({contact.deals?.length || 0})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Daftar transaksi & penawaran terkait klien ini
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddDealOpen(true)}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Deal</span>
                    </button>
                  </div>

                  {contact.deals?.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                      <Briefcase className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-xs font-bold text-slate-700">
                        Belum ada deal untuk klien ini
                      </p>
                      <button
                        onClick={() => setIsAddDealOpen(true)}
                        className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        + Buat deal baru sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contact.deals?.map((deal) => {
                        const stageBadge = getStageBadgeColor(deal.stage);
                        const priorityBadge = getPriorityBadgeColor(deal.priority);
                        return (
                          <div
                            key={deal.id}
                            className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
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
                                <h4 className="mt-1.5 text-xs font-bold text-slate-900 leading-snug">
                                  {deal.title}
                                </h4>
                              </div>
                              <button
                                onClick={() => setEditingDeal(deal)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                                title="Edit Deal"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                              <span className="text-sm font-black text-slate-900 tabular-nums">
                                {formatRupiah(deal.value)}
                              </span>
                              {deal.expectedClose && (
                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(deal.expectedClose)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Activity Feed & Timeline (7 cols) */}
                <div className="lg:col-span-7">
                  <ActivityTimeline
                    contactId={contact.id}
                    activities={contact.activities || []}
                    onActivityAdded={fetchContact}
                  />
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>

      {/* Modals */}
      <EditContactModal
        isOpen={isEditContactOpen}
        contact={contact}
        onClose={() => setIsEditContactOpen(false)}
        onSuccess={fetchContact}
      />
      <DeleteConfirmModal
        isOpen={isDeleteContactOpen}
        title="Hapus Klien Ini?"
        message={`Apakah Anda yakin ingin menghapus "${contact?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        loading={deleteLoading}
        onClose={() => setIsDeleteContactOpen(false)}
        onConfirm={handleDeleteContact}
      />
      <AddDealModal
        isOpen={isAddDealOpen}
        preselectedContactId={contact?.id}
        onClose={() => setIsAddDealOpen(false)}
        onSuccess={fetchContact}
      />
      <EditDealModal
        isOpen={!!editingDeal}
        deal={editingDeal}
        onClose={() => setEditingDeal(null)}
        onSuccess={fetchContact}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
}
