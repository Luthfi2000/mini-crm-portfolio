import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, needs, estimatedBudget, message } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Nama lengkap, email bisnis, dan nomor WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    // Sanitize phone number (e.g. 0812... -> 62812...)
    let cleanPhone = phone.trim().replace(/[^0-9+]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1);
    }

    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          company: company?.trim() || "Perusahaan Calon Klien",
          position: "Decision Maker / Lead",
          status: "Lead",
          notes: `Sumber: Formulir Inbound Landing Page. Kebutuhan: ${needs || "Konsultasi CRM"}. Catatan: ${message || "-"}`,
          avatarColor: "blue",
        },
      });
    }

    // 2. Determine deal valuation
    let dealValue = 15_000_000; // Default IT solution deployment Rp 15 Jt
    if (estimatedBudget) {
      const parsed = parseFloat(String(estimatedBudget).replace(/[^0-9]/g, ""));
      if (!isNaN(parsed) && parsed > 0) dealValue = parsed;
    }

    // 3. Create Deal in Stage "Lead"
    const dealTitle = company?.trim()
      ? `Solusi CRM & IT: ${company.trim()}`
      : `Implementasi CRM - ${name.trim()}`;

    const deal = await prisma.deal.create({
      data: {
        title: dealTitle,
        value: dealValue,
        stage: "Lead",
        priority: "High", // Inbound web leads are high priority
        contactId: contact.id,
        expectedClose: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Target close 14 days
      },
    });

    // 4. Create Activity Log
    await prisma.activity.create({
      data: {
        type: "Note",
        title: "🔥 Inbound Lead Baru dari Landing Page",
        content: `Calon klien mendaftar melalui formulir publik.\nWhatsApp: https://wa.me/${cleanPhone}\nKebutuhan: ${needs || "Solusi Digitalisasi CRM"}\nCatatan Tambahan: ${message || "Tidak ada catatan."}`,
        contactId: contact.id,
        dealId: deal.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Terima kasih! Tim konsultan IT Solution kami akan segera menghubungi Anda via WhatsApp.",
        dealId: deal.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menerima inbound lead:", error);
    return NextResponse.json(
      { error: "Terjadi kendala pada server saat memproses permohonan demo." },
      { status: 500 }
    );
  }
}
