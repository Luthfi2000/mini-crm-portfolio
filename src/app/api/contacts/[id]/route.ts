import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        deals: {
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Kontak tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact GET [id] error:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail kontak" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const { name, email, phone, company, position, status, notes, avatarColor } = body;

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Kontak tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        email: email !== undefined ? email : existing.email,
        phone: phone !== undefined ? phone : existing.phone,
        company: company !== undefined ? company : existing.company,
        position: position !== undefined ? position : existing.position,
        status: status !== undefined ? status : existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        avatarColor: avatarColor !== undefined ? avatarColor : existing.avatarColor,
      },
    });

    // Record an activity if status changed
    if (status && status !== existing.status) {
      await prisma.activity.create({
        data: {
          type: "Note",
          title: "Status Diperbarui",
          content: `Status kontak diubah dari "${existing.status}" menjadi "${status}".`,
          contactId: id,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Contact PUT [id] error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kontak" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Kontak berhasil dihapus" });
  } catch (error) {
    console.error("Contact DELETE [id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kontak" },
      { status: 500 }
    );
  }
}
