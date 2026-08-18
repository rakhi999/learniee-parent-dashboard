import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, hashPassword, sessionCookieName, sessionCookieOptions } from "@/lib/auth";
import { isSameOrigin } from "@/lib/security";
import { createUserIfAvailable } from "@/lib/storage";
import { isValidEmail, normalizeEmail, validateName, validatePassword } from "@/lib/validation";

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

  const { name = "", email = "", password = "" } = (body ?? {}) as Record<string, string>;
  const cleanName = String(name).trim();
  const cleanEmail = normalizeEmail(String(email));
  const cleanPassword = String(password);

  const nameError = validateName(cleanName);
  if (nameError) return NextResponse.json({ error: nameError }, { status: 400 });
  if (!isValidEmail(cleanEmail)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const passwordError = validatePassword(cleanPassword);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const user = {
    id: randomUUID(),
    name: cleanName,
    email: cleanEmail,
    passwordHash: await hashPassword(cleanPassword),
    createdAt: new Date().toISOString(),
  };

  const created = await createUserIfAvailable(user);
  if (!created) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } }, { status: 201 });
  response.cookies.set(sessionCookieName(), createSessionToken(user.id), sessionCookieOptions());
  return response;
}
