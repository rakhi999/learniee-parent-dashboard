import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, sessionCookieName, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";
import { findUserByEmail } from "@/lib/storage";
import { normalizeEmail } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email = "", password = "" } = (body ?? {}) as Record<string, string>;
  const user = await findUserByEmail(normalizeEmail(String(email)));
  const valid = user ? await verifyPassword(String(password), user.passwordHash) : false;

  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } });
  response.cookies.set(sessionCookieName(), createSessionToken(user.id), sessionCookieOptions());
  return response;
}
