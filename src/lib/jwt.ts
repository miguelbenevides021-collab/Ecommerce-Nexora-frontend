import type { JwtPayload } from "@/types";

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);

    const parsed = JSON.parse(json) as Partial<JwtPayload>;
    if (parsed.id == null || (parsed.role !== "CLIENT" && parsed.role !== "ADMIN")) {
      return null;
    }

    return parsed as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
