export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiahCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(0)} Jt`;
  }
  return formatRupiah(amount);
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTimeAgo(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}j lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} bulan lalu`;
}

export function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getStatusBadgeColor(status: string): { bg: string; text: string; dot: string; border: string } {
  switch (status) {
    case "Customer":
      return {
        bg: "bg-emerald-50/80",
        text: "text-emerald-700",
        dot: "bg-emerald-500 ring-2 ring-emerald-200",
        border: "border-emerald-200/80",
      };
    case "Prospect":
      return {
        bg: "bg-indigo-50/80",
        text: "text-indigo-700",
        dot: "bg-indigo-500 ring-2 ring-indigo-200",
        border: "border-indigo-200/80",
      };
    case "Lead":
      return {
        bg: "bg-blue-50/80",
        text: "text-blue-700",
        dot: "bg-blue-500 ring-2 ring-blue-200",
        border: "border-blue-200/80",
      };
    case "Inactive":
      return {
        bg: "bg-slate-100/80",
        text: "text-slate-600",
        dot: "bg-slate-400 ring-2 ring-slate-200",
        border: "border-slate-200/80",
      };
    default:
      return {
        bg: "bg-slate-100/80",
        text: "text-slate-600",
        dot: "bg-slate-400 ring-2 ring-slate-200",
        border: "border-slate-200/80",
      };
  }
}

export function getStageBadgeColor(stage: string): { bg: string; text: string; border: string; bar: string } {
  switch (stage) {
    case "Lead":
      return {
        bg: "bg-blue-50/90",
        text: "text-blue-700",
        border: "border-blue-200/90",
        bar: "bg-blue-500",
      };
    case "Qualified":
      return {
        bg: "bg-indigo-50/90",
        text: "text-indigo-700",
        border: "border-indigo-200/90",
        bar: "bg-indigo-500",
      };
    case "Proposal":
      return {
        bg: "bg-amber-50/90",
        text: "text-amber-700",
        border: "border-amber-200/90",
        bar: "bg-amber-500",
      };
    case "Won":
      return {
        bg: "bg-emerald-50/90",
        text: "text-emerald-700",
        border: "border-emerald-200/90",
        bar: "bg-emerald-500",
      };
    case "Lost":
      return {
        bg: "bg-rose-50/90",
        text: "text-rose-700",
        border: "border-rose-200/90",
        bar: "bg-rose-500",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        bar: "bg-slate-400",
      };
  }
}

export function getPriorityBadgeColor(priority: string): { bg: string; text: string; border: string; indicator: string } {
  switch (priority) {
    case "High":
      return {
        bg: "bg-rose-50",
        text: "text-rose-700 font-semibold",
        border: "border-rose-200",
        indicator: "bg-rose-500",
      };
    case "Medium":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700 font-semibold",
        border: "border-amber-200",
        indicator: "bg-amber-500",
      };
    case "Low":
      return {
        bg: "bg-slate-100",
        text: "text-slate-600 font-medium",
        border: "border-slate-200",
        indicator: "bg-slate-400",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-600 font-medium",
        border: "border-slate-200",
        indicator: "bg-slate-400",
      };
  }
}

export function getAvatarBgClass(color?: string | null): string {
  switch (color) {
    case "indigo":
      return "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-indigo-500/20";
    case "emerald":
      return "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/20";
    case "amber":
      return "bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-amber-500/20";
    case "purple":
      return "bg-gradient-to-tr from-purple-600 to-violet-500 text-white shadow-purple-500/20";
    case "cyan":
      return "bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-cyan-500/20";
    case "rose":
      return "bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-rose-500/20";
    case "violet":
      return "bg-gradient-to-tr from-violet-600 to-purple-500 text-white shadow-violet-500/20";
    case "teal":
      return "bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-teal-500/20";
    case "pink":
      return "bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-pink-500/20";
    case "orange":
      return "bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/20";
    default:
      return "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/20";
  }
}

/**
 * Client-side CSV export generator
 */
export function exportContactsToCSV(contacts: {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  status: string;
  createdAt: string | Date;
}[]): void {
  const headers = ["Nama Lengkap", "Email", "Telepon/WhatsApp", "Perusahaan", "Jabatan", "Status", "Terdaftar Sejak"];
  const rows = contacts.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${(c.phone || "").replace(/"/g, '""')}"`,
    `"${(c.company || "").replace(/"/g, '""')}"`,
    `"${(c.position || "").replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${new Date(c.createdAt).toLocaleDateString("id-ID")}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `mini_crm_contacts_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
