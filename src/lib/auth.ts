import crypto from "crypto";
import { NextRequest } from "next/server";
import { User, UserRole } from "./types";
import { prisma } from "./prisma";

const SECRET_KEY = process.env.SESSION_SECRET || "mini-crm-secret-enterprise-salt-2026";
const COOKIE_NAME = "mini_crm_session";

/**
 * Hash password with a secure cryptographic salt using scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plain password against the stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
  } catch (err) {
    return false;
  }
}

/**
 * Create a signed session token
 */
export function createSessionToken(user: { id: string; email: string; role: string; name: string }): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string): { userId: string; email: string; role: UserRole; name: string } | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Get current authenticated user from request cookies or fallback to admin in dev
 */
export async function getAuthUser(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifySessionToken(token);
  if (!decoded) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!dbUser || !dbUser.isActive) return null;

  const { password, ...safeUser } = dbUser;
  return safeUser as unknown as User;
}

export { COOKIE_NAME };
