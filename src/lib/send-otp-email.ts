export async function sendOtpEmail(email: string, code: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "LocalHomeFix <noreply@localhomefix.com>",
      to: [email],
      subject: "Your LocalHomeFix password reset code",
      text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not ask for this, you can ignore the email.`,
    }),
  });

  return response.ok;
}
