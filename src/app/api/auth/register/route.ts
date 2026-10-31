import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { UserRole } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, department } = body;

    // Validations
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Alamat email wajib diisi." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal harus memiliki 6 karakter." },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
        { status: 409 }
      );
    }

    // Role assignment
    const validRoles: UserRole[] = ["ADMIN", "MANAGER", "SALES_REP", "SUPPORT"];
    const assignedRole: UserRole = validRoles.includes(role) ? role : "SALES_REP";

    const colors = ["indigo", "emerald", "amber", "purple", "cyan", "rose", "violet", "teal"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashPassword(password),
        role: assignedRole,
        department: department?.trim() || "Sales & Commercial",
        avatarColor: randomColor,
        isActive: true,
        lastLogin: new Date(),
      },
    });

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatarColor: user.avatarColor,
        },
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada proses pendaftaran." },
      { status: 500 }
    );
  }
}
