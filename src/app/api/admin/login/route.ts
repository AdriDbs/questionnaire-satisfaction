import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, computeSessionToken, validPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");

  if (!validPassword(password)) {
    const url = new URL("/admin/login?error=1", req.url);
    return NextResponse.redirect(url, { status: 303 });
  }

  const url = new URL("/admin", req.url);
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(ADMIN_COOKIE, await computeSessionToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
