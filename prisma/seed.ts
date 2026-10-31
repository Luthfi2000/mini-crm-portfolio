import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  console.log("🌱 Cleaning existing database...");
  await prisma.activity.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Seeding internal CRM team users with RBAC roles...");

  const users = [
    {
      name: "Luthfi Aditya",
      email: "admin@nusantaracrm.id",
      password: hashPassword("Admin123!"),
      role: "ADMIN",
      department: "Executive & RevOps",
      avatarColor: "indigo",
      isActive: true,
    },
    {
      name: "Rian Hidayat",
      email: "manager@nusantaracrm.id",
      password: hashPassword("Manager123!"),
      role: "MANAGER",
      department: "Regional Sales Management",
      avatarColor: "purple",
      isActive: true,
    },
    {
      name: "Alifia Putri",
      email: "rep@nusantaracrm.id",
      password: hashPassword("Sales123!"),
      role: "SALES_REP",
      department: "Inbound & Enterprise Sales",
      avatarColor: "emerald",
      isActive: true,
    },
    {
      name: "Dina Kartika",
      email: "support@nusantaracrm.id",
      password: hashPassword("Support123!"),
      role: "SUPPORT",
      department: "Customer Success",
      avatarColor: "amber",
      isActive: true,
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log("🌱 Seeding realistic CRM contacts & deals...");

  const contactsData = [
    {
      name: "Budi Santoso",
      email: "budi.santoso@nusantaradigital.id",
      phone: "+62 812-3456-7890",
      company: "PT Nusantara Digital Media",
      position: "Chief Marketing Officer",
      status: "Customer",
      avatarColor: "indigo",
      notes: "Klien enterprise yang sangat puas dengan layanan kita. Sedang merencanakan ekspansi sistem ke anak perusahaan.",
      deals: [
        {
          title: "Enterprise CRM & Analytics Suite",
          value: 120000000,
          stage: "Won",
          priority: "High",
          expectedClose: new Date("2026-09-15"),
        },
      ],
      activities: [
        {
          type: "Meeting",
          title: "Executive Kickoff Q4",
          content: "Meeting kickoff implementasi modul analytics kuartal 4 berjalan lancar bersama tim tech.",
          createdAt: new Date("2026-10-20T10:30:00Z"),
        },
        {
          type: "Call",
          title: "Monthly Check-in",
          content: "Review kepuasan penggunaan platform bulan berjalan. Feedback sangat positif.",
          createdAt: new Date("2026-10-25T14:15:00Z"),
        },
      ],
    },
    {
      name: "Siti Rahmawati",
      email: "siti.rahmawati@finovacapital.co.id",
      phone: "+62 811-9876-5432",
      company: "Finova Mandiri Capital",
      position: "VP of Sales",
      status: "Prospect",
      avatarColor: "emerald",
      notes: "Sedang evaluasi tools baru untuk sales team (35 agents). Memerlukan integrasi WhatsApp Business API.",
      deals: [
        {
          title: "Sales Pipeline & WhatsApp Integration",
          value: 75000000,
          stage: "Proposal",
          priority: "High",
          expectedClose: new Date("2026-11-10"),
        },
      ],
      activities: [
        {
          type: "Email",
          title: "Proposal Final Revision",
          content: "Kirim proposal revisi mencakup integrasi webhook API WhatsApp Cloud dan SLA garansi support 24/7.",
          createdAt: new Date("2026-10-28T09:00:00Z"),
        },
      ],
    },
    {
      name: "Kevin Wijaya",
      email: "kevin.wijaya@logistikaprima.com",
      phone: "+62 813-2233-4455",
      company: "Logistika Prima Express",
      position: "Operations Director",
      status: "Lead",
      avatarColor: "amber",
      notes: "Menghadiri webinar digital transformation minggu lalu. Mencari solusi tracking order terpadu.",
      deals: [
        {
          title: "Fleet & Customer Tracking Dashboard",
          value: 45000000,
          stage: "Qualified",
          priority: "Medium",
          expectedClose: new Date("2026-11-20"),
        },
      ],
      activities: [
        {
          type: "Meeting",
          title: "Technical Discovery Call",
          content: "Presentasi demo fitur real-time dashboard pada armada logistik. Klien tertarik pada fitur webhook.",
          createdAt: new Date("2026-10-27T14:00:00Z"),
        },
      ],
    },
    {
      name: "Amanda Putri",
      email: "amanda.putri@edugemilang.ac.id",
      phone: "+62 856-7788-9900",
      company: "PT Edukasi Gemilang Nusantara",
      position: "Head of Business Development",
      status: "Customer",
      avatarColor: "purple",
      notes: "Program tahunan untuk pendaftaran murid & kemitraan sekolah di 12 cabang.",
      deals: [
        {
          title: "Student Admission CRM & Parent Portal",
          value: 95000000,
          stage: "Won",
          priority: "High",
          expectedClose: new Date("2026-08-30"),
        },
      ],
      activities: [
        {
          type: "Note",
          title: "Contract Signed",
          content: "Kontrak kerja sama 1 tahun resmi ditandatangani. Tim implementasi mulai bertugas minggu depan.",
          createdAt: new Date("2026-10-18T11:00:00Z"),
        },
      ],
    },
    {
      name: "Reza Pratama",
      email: "reza.pratama@halalpay.id",
      phone: "+62 818-4455-6677",
      company: "HalalPay Fintek Indonesia",
      position: "Product Manager",
      status: "Lead",
      avatarColor: "cyan",
      notes: "Inbound lead dari formulir kontak website. Ingin automasi flow verifikasi KYC merchant.",
      deals: [
        {
          title: "Merchant Onboarding Workflow Engine",
          value: 60000000,
          stage: "Lead",
          priority: "Medium",
          expectedClose: new Date("2026-12-05"),
        },
      ],
      activities: [
        {
          type: "Call",
          title: "Introductory Discovery Call",
          content: "Panggilan telepon 20 menit untuk memahami alur KYC merchant saat ini dan poin hambatan registrasi.",
          createdAt: new Date("2026-10-29T08:30:00Z"),
        },
      ],
    },
    {
      name: "Michael Chandra",
      email: "michael@javaroastery.co.id",
      phone: "+62 817-8899-0011",
      company: "Java Roastery & Coffee Co.",
      position: "Founder & CEO",
      status: "Prospect",
      avatarColor: "rose",
      notes: "Membutuhkan sistem manajemen pesanan B2B untuk kafe-kafe mitra di Jabodetabek & Bali.",
      deals: [
        {
          title: "B2B Loyalty & Order Processing",
          value: 38000000,
          stage: "Proposal",
          priority: "Low",
          expectedClose: new Date("2026-11-15"),
        },
      ],
      activities: [
        {
          type: "Meeting",
          title: "Proposal & Pricing Pitch",
          content: "Presentasi kalkulasi ROI dan skema lisensi bulanan vs tahunan di kantor Kemang.",
          createdAt: new Date("2026-10-26T16:00:00Z"),
        },
      ],
    },
    {
      name: "Dewi Lestari",
      email: "dewi.lestari@suryakreatif.com",
      phone: "+62 812-7711-2233",
      company: "Surya Kreatif Agency",
      position: "Managing Director",
      status: "Lead",
      avatarColor: "violet",
      notes: "Rekomendasi dari Budi Santoso. Membutuhkan software manajemen pipeline proyek klien.",
      deals: [
        {
          title: "Client Project Management Module",
          value: 28000000,
          stage: "Lead",
          priority: "Low",
          expectedClose: new Date("2026-12-10"),
        },
      ],
      activities: [
        {
          type: "Email",
          title: "Shared Portfolio & Case Studies",
          content: "Mengirimkan link deck presentasi studi kasus integrasi CRM pada agensi kreatif serupa.",
          createdAt: new Date("2026-10-27T10:00:00Z"),
        },
      ],
    },
    {
      name: "Hendra Gunawan",
      email: "hendra.gunawan@biomedika.id",
      phone: "+62 821-3344-5566",
      company: "BioMedika Solusindo",
      position: "IT Director",
      status: "Customer",
      avatarColor: "teal",
      notes: "Implementasi sistem reservasi dan riwayat lab rekanan terpusat dengan kepatuhan data medis.",
      deals: [
        {
          title: "Healthcare Provider Portal & CRM",
          value: 160000000,
          stage: "Won",
          priority: "High",
          expectedClose: new Date("2026-07-20"),
        },
      ],
      activities: [
        {
          type: "Meeting",
          title: "Quarterly Service Review",
          content: "Annual review meeting dan audit keamanan data pasien berjalan sukses dengan nilai SLA 99.9%.",
          createdAt: new Date("2026-10-24T13:00:00Z"),
        },
      ],
    },
    {
      name: "Fiona Anggraini",
      email: "fiona.anggraini@artharetail.co.id",
      phone: "+62 813-9988-7766",
      company: "Artha Retail Indonesia",
      position: "Chief Commercial Officer",
      status: "Prospect",
      avatarColor: "pink",
      notes: "Ekspansi 20 outlet retail baru di Jawa Timur, memerlukan database pelanggan tersentralisasi.",
      deals: [
        {
          title: "Omnichannel Customer Data Platform (CDP)",
          value: 110000000,
          stage: "Qualified",
          priority: "High",
          expectedClose: new Date("2026-11-28"),
        },
      ],
      activities: [
        {
          type: "Call",
          title: "Technical Architecture Discussion",
          content: "Diskusi arsitektur sinkronisasi transaksi POS offline toko fisik dengan platform online CRM.",
          createdAt: new Date("2026-10-29T11:00:00Z"),
        },
      ],
    },
    {
      name: "Farhan Maulana",
      email: "farhan.maulana@urbanliving.co.id",
      phone: "+62 857-1122-3344",
      company: "Urban Living Real Estate",
      position: "Sales Marketing Lead",
      status: "Lead",
      avatarColor: "orange",
      notes: "Prospek baru dari campaign pameran properti Mega Kuningan.",
      deals: [
        {
          title: "Property Buyer Journey Tracking",
          value: 52000000,
          stage: "Lead",
          priority: "Medium",
          expectedClose: new Date("2026-12-18"),
        },
      ],
      activities: [
        {
          type: "Note",
          title: "Follow-up WhatsApp",
          content: "Terkirim katalog solusi CRM ke WhatsApp Farhan, dijadwalkan demo zoom hari Selasa depan.",
          createdAt: new Date("2026-10-28T15:30:00Z"),
        },
      ],
    },
  ];

  for (const contactItem of contactsData) {
    const { deals, activities, ...contactFields } = contactItem;

    const contact = await prisma.contact.create({
      data: contactFields,
    });

    for (const dealItem of deals) {
      await prisma.deal.create({
        data: {
          ...dealItem,
          contactId: contact.id,
        },
      });
    }

    for (const activityItem of activities) {
      await prisma.activity.create({
        data: {
          ...activityItem,
          contactId: contact.id,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully! Users with RBAC, contacts, deals, and activities are ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
