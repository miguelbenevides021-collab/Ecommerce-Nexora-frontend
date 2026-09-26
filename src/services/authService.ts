import { apiFetch } from "@/lib/api";
import type { LoginPayload, LoginResponse, RegisterPayload, User } from "@/types";

export function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerRequest(payload: RegisterPayload): Promise<User> {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProfile(): Promise<User> {
  return apiFetch<User>("/profile", { method: "GET" }, true);
}
