const OTP_TTL_MS = 10 * 60 * 1000;
const LOCAL_OTP = "123456";

type OtpEntry = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const globalForOtp = globalThis as typeof globalThis & {
  __lhfOtpStore?: Map<string, OtpEntry>;
};

const store = globalForOtp.__lhfOtpStore ?? new Map<string, OtpEntry>();
globalForOtp.__lhfOtpStore = store;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function issueOtp(email: string, code = LOCAL_OTP) {
  const key = normalizeEmail(email);
  store.set(key, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return code;
}

export function verifyIssuedOtp(email: string, code: string) {
  const key = normalizeEmail(email);
  const entry = store.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return false;
  }
  entry.attempts += 1;
  if (entry.attempts > 5) {
    store.delete(key);
    return false;
  }
  if (entry.code !== code.trim()) return false;
  store.delete(key);
  return true;
}

export const localOtp = LOCAL_OTP;
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);
