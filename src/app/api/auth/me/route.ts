import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { ROLE_PERMISSIONS, UserRole } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ user: null, permissions: null }, { status: 401 });
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
