import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true,
            avatarColor: true,
          },
        },
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Deals GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, value, stage, priority, expectedClose, contactId } = body;

    if (!title || !contactId) {
      return NextResponse.json(
        { error: "Judul deal dan kontak wajib diisi" },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: typeof value === "number" ? value : parseFloat(value) || 0,
        stage: stage || "Lead",
        priority: priority || "Medium",
        expectedClose: expectedClose ? new Date(expectedClose) : null,
        contactId,
      },
      include: {
        contact: true,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        type: "Note",
        title: "Deal Baru Dibuat",
        content: `Deal "${deal.title}" senilai ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(deal.value)} telah dibuat dalam tahap ${deal.stage}.`,
        contactId: deal.contactId,
        dealId: deal.id,
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Deals POST error:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
