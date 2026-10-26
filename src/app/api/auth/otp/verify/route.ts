import { NextResponse } from "next/server";
import { verifyIssuedOtp } from "@/lib/otp";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; code?: string } | null;
  const email = body?.email?.trim() ?? "";
  const code = body?.code?.trim() ?? "";

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "Enter the 6-digit code." }, { status: 400 });
  }

  if (!verifyIssuedOtp(email, code)) {
    return NextResponse.json({ ok: false, error: "That code is incorrect or expired." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
