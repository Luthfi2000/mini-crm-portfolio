import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!existingDeal) {
      return NextResponse.json({ error: "Deal tidak ditemukan" }, { status: 404 });
    }

    const { stage, value, title, priority, expectedClose, contactId } = body;

    const updatedData: Record<string, unknown> = {};
    if (stage !== undefined) updatedData.stage = stage;
    if (value !== undefined) updatedData.value = typeof value === "number" ? value : parseFloat(value) || 0;
    if (title !== undefined) updatedData.title = title;
    if (priority !== undefined) updatedData.priority = priority;
    if (expectedClose !== undefined) {
      updatedData.expectedClose = expectedClose ? new Date(expectedClose) : null;
    }
    if (contactId !== undefined) updatedData.contactId = contactId;

    const updated = await prisma.deal.update({
      where: { id },
      data: updatedData,
      include: {
        contact: true,
      },
    });

    // If stage changed, log activity
    if (stage && stage !== existingDeal.stage) {
      await prisma.activity.create({
        data: {
          type: "Note",
          title: `Tahap Deal Berubah: ${stage}`,
          content: `Deal "${existingDeal.title}" dipindahkan dari tahap "${existingDeal.stage}" ke "${stage}".`,
          contactId: existingDeal.contactId,
          dealId: existingDeal.id,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Deal PATCH error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui deal" },
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

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Deal berhasil dihapus" });
  } catch (error) {
    console.error("Deal DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus deal" },
      { status: 500 }
    );
  }
}
