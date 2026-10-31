import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DealStage } from "@/lib/types";

export async function GET() {
  try {
    const [
      totalContacts,
      totalLeads,
      deals,
      recentActivities,
      recentDeals,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({
        where: { status: "Lead" },
      }),
      prisma.deal.findMany({
        select: {
          id: true,
          value: true,
          stage: true,
        },
      }),
      prisma.activity.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              company: true,
              avatarColor: true,
            },
          },
        },
      }),
      prisma.deal.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              company: true,
              avatarColor: true,
            },
          },
        },
      }),
    ]);

    const wonDeals = deals.filter((d) => d.stage === "Won");
    const activeDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost");

    const totalRevenueWon = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const activeDealsValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const conversionRate =
      deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

    const stagesConfig: { stage: DealStage; label: string; color: string }[] = [
      { stage: "Lead", label: "Lead Inbound", color: "bg-blue-500" },
      { stage: "Qualified", label: "Terkualifikasi", color: "bg-indigo-500" },
      { stage: "Proposal", label: "Proposal & Negosiasi", color: "bg-amber-500" },
      { stage: "Won", label: "Deal Berhasil (Won)", color: "bg-emerald-500" },
    ];

    const pipelineStages = stagesConfig.map((item) => {
      const stageDeals = deals.filter((d) => d.stage === item.stage);
      return {
        stage: item.stage,
        label: item.label,
        count: stageDeals.length,
        value: stageDeals.reduce((acc, curr) => acc + curr.value, 0),
        color: item.color,
      };
    });

    return NextResponse.json({
      totalContacts,
      totalLeads,
      activeDealsCount: activeDeals.length,
      activeDealsValue,
      wonDealsCount: wonDeals.length,
      totalRevenueWon,
      conversionRate,
      pipelineStages,
      recentActivities,
      recentDeals,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
