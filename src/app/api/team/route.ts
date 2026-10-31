import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarColor: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Team GET API error:", error);
    return NextResponse.json({ error: "Gagal memuat daftar tim." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    // Only Admin can modify roles or active state
    if (user && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat mengubah peran tim." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, role, department, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID diperlukan." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(department && { department }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarColor: true,
        isActive: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Team PATCH API error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data tim." }, { status: 500 });
  }
}
