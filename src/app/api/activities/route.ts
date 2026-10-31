import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, contactId, dealId } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Tipe aktivitas dan judul wajib diisi" },
        { status: 400 }
      );
    }

    if (!contactId && !dealId) {
      return NextResponse.json(
        { error: "Aktivitas harus dihubungkan dengan kontak atau deal" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        type: type || "Note",
        title,
        content: content || null,
        contactId: contactId || null,
        dealId: dealId || null,
      },
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
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Activity POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan aktivitas" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Activity ID diperlukan" },
        { status: 400 }
      );
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Aktivitas berhasil dihapus" });
  } catch (error) {
    console.error("Activity DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus aktivitas" },
      { status: 500 }
    );
  }
}
