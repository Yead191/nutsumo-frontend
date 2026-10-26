import { NextResponse } from "next/server";
import { emailConfigured, issueOtp, localOtp, randomOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/send-otp-email";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const canEmail = emailConfigured();
  const code = canEmail ? randomOtp() : localOtp;
  issueOtp(email, code);

  if (canEmail) {
    const delivered = await sendOtpEmail(email, code);
    if (!delivered) {
      return NextResponse.json(
        { ok: false, error: "We could not send a code to that inbox. Try again." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
