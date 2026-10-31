import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const whereClause: Record<string, unknown> = {};

    if (status && status !== "All") {
      whereClause.status = status;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { company: { contains: query } },
        { email: { contains: query } },
        { position: { contains: query } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        deals: {
          select: {
            id: true,
            title: true,
            value: true,
            stage: true,
          },
        },
        _count: {
          select: {
            activities: true,
            deals: true,
          },
        },
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Contacts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, position, status, notes, avatarColor } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nama dan email wajib diisi" },
        { status: 400 }
      );
    }

    // Color palette options
    const colors = ["indigo", "emerald", "amber", "purple", "cyan", "rose", "violet", "teal", "pink", "orange"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        position: position || null,
        status: status || "Lead",
        notes: notes || null,
        avatarColor: avatarColor || randomColor,
      },
    });

    // Create an initial activity log
    await prisma.activity.create({
      data: {
        type: "Note",
        title: "Kontak Dibuat",
        content: `Kontak ${name} baru saja ditambahkan ke dalam CRM dengan status ${contact.status}.`,
        contactId: contact.id,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Contacts POST error:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
