export const ADMIN_COOKIE = "admin_session";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeSessionToken(password: string) {
  return sha256Hex(`${password}:${secret()}`);
}

export function validPassword(password: string) {
  return Boolean(process.env.ADMIN_PASSWORD) && password === process.env.ADMIN_PASSWORD;
}

export async function validSessionToken(token: string | undefined) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === (await computeSessionToken(process.env.ADMIN_PASSWORD));
}
