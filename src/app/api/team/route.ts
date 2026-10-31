import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";

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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang dapat mengubah data tim." },
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

export async function POST(request: NextRequest) {
  try {
    const caller = await getAuthUser(request);
    // Only Administrator can create new team accounts
    if (!caller || caller.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya Administrator yang memiliki hak mendaftarkan akun tim baru." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, department } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const validRoles = ["ADMIN", "MANAGER", "SALES_REP", "SUPPORT"];
    const targetRole = validRoles.includes(role) ? role : "SALES_REP";

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Alamat email ini sudah terdaftar di sistem." },
        { status: 409 }
      );
    }

    const colors = ["indigo", "blue", "purple", "emerald", "amber", "rose", "teal", "cyan"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const hashedPassword = hashPassword(String(password));

    const newUser = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: trimmedEmail,
        password: hashedPassword,
        role: targetRole,
        department: department ? String(department).trim() : "Sales",
        avatarColor,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarColor: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Team POST API error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftarkan akun pengguna baru." },
      { status: 500 }
    );
  }
}
