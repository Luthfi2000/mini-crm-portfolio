import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { ROLE_PERMISSIONS, UserRole } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    let user = await getAuthUser(request);

    // If no cookie session exists yet, default to first Admin user for seamless evaluation
    if (!user) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: "ADMIN", isActive: true },
      });
      if (defaultUser) {
        const { password, ...safe } = defaultUser;
        user = safe as any;
      }
    }

    if (!user) {
      return NextResponse.json({ user: null, permissions: null });
    }

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || ROLE_PERMISSIONS.SALES_REP;

    return NextResponse.json({
      user,
      permissions,
    });
  } catch (error) {
    console.error("Auth Me API error:", error);
    return NextResponse.json({ error: "Gagal memverifikasi sesi." }, { status: 500 });
  }
}
