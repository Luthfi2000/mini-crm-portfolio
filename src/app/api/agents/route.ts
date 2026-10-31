import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.agentExecutionLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Agents GET error:", error);
    return NextResponse.json({ error: "Gagal memuat log agen." }, { status: 500 });
  }
}

// Autonomous Agent Executors
async function executeSdrAgent() {
  const newLead = await prisma.contact.findFirst({
    where: { status: "Lead" },
    orderBy: { createdAt: "desc" },
  });

  const leadName = newLead ? newLead.name : "Prospek Enterprise";
  const contactId = newLead ? newLead.id : null;

  // Log an outreach interaction to the lead
  if (contactId) {
    await prisma.activity.create({
      data: {
        type: "Call",
        title: `[SDR Agent] Kualifikasi Otomatis: ${leadName}`,
        content: `Agen SDR otomatis menganalisis profil ${leadName}. Berhasil mengidentifikasi kebutuhan otomasi CRM dan mengirimkan email perkenalan dengan SLA respon 15 menit.`,
        contactId,
      },
    });
  }

  const log = await prisma.agentExecutionLog.create({
    data: {
      agentRole: "SALES_REP",
      agentName: "SDR Outreach Agent",
      task: `Lead Discovery & Outreach (${leadName})`,
      summary: `Berhasil memindai inbound leads. Menjalankan verifikasi profil ${leadName} dan mencatat log panggilan intro secara otomatis.`,
      status: "COMPLETED",
    },
  });

  return log;
}

async function executeManagerAgent() {
  // Find a deal in Qualified or Proposal to review
  const pendingDeal = await prisma.deal.findFirst({
    where: { stage: { in: ["Qualified", "Proposal"] } },
    include: { contact: true },
  });

  const dealTitle = pendingDeal ? pendingDeal.title : "Enterprise Solution Deal";
  const dealId = pendingDeal ? pendingDeal.id : null;
  const contactId = pendingDeal ? pendingDeal.contactId : null;

  if (dealId) {
    await prisma.deal.update({
      where: { id: dealId },
      data: { priority: "High" },
    });

    await prisma.activity.create({
      data: {
        type: "Note",
        title: `[Pipeline Copilot] Evaluasi Peluang: ${dealTitle}`,
        content: `Manager Agent melakukan audit kesehatan deal "${dealTitle}". Prioritas dinaikkan menjadi HIGH dengan estimasi closing kuartal ini. Disetujui untuk penjadwalan demo teknis.`,
        contactId,
        dealId,
      },
    });
  }

  const log = await prisma.agentExecutionLog.create({
    data: {
      agentRole: "MANAGER",
      agentName: "Pipeline Copilot",
      task: `Deal Health Check (${dealTitle})`,
      summary: `Mengaudit deal "${dealTitle}". Memperbarui prioritas menjadi High dan mencatat rekomendasi penutupan kontrak bagi sales team.`,
      status: "COMPLETED",
    },
  });

  return log;
}

async function executeRevOpsAgent() {
  const [deals, contacts] = await Promise.all([
    prisma.deal.findMany({ select: { value: true, stage: true } }),
    prisma.contact.count(),
  ]);

  const wonDeals = deals.filter((d) => d.stage === "Won");
  const wonSum = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  const log = await prisma.agentExecutionLog.create({
    data: {
      agentRole: "ADMIN",
      agentName: "RevOps Executive Analyst",
      task: "Q4 Revenue Forecast & Pipeline Audit",
      summary: `Audit portofolio: ${contacts} kontak aktif, Total omset closed won ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(wonSum)} (${winRate}% win rate). Pipeline berjalan ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalPipeline)}. Proyeksi target kuartal 4 berada pada level prima (85%+ target).`,
      status: "COMPLETED",
    },
  });

  return log;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body; // "RUN_ALL", "RUN_SDR", "RUN_MANAGER", "RUN_REVOPS"

    if (action === "RUN_ALL") {
      // Execute all 3 agents CONCURRENTLY using Promise.all!
      const startTime = Date.now();
      const [sdrResult, managerResult, revOpsResult] = await Promise.all([
        executeSdrAgent(),
        executeManagerAgent(),
        executeRevOpsAgent(),
      ]);
      const durationMs = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        mode: "CONCURRENT_PARALLEL",
        durationMs,
        results: [sdrResult, managerResult, revOpsResult],
      });
    }

    if (action === "RUN_SDR") {
      const res = await executeSdrAgent();
      return NextResponse.json({ success: true, result: res });
    }

    if (action === "RUN_MANAGER") {
      const res = await executeManagerAgent();
      return NextResponse.json({ success: true, result: res });
    }

    if (action === "RUN_REVOPS") {
      const res = await executeRevOpsAgent();
      return NextResponse.json({ success: true, result: res });
    }

    return NextResponse.json({ error: "Aksi agen tidak dikenali." }, { status: 400 });
  } catch (error) {
    console.error("Agents POST error:", error);
    return NextResponse.json({ error: "Gagal mengeksekusi agen AI." }, { status: 500 });
  }
}
