import { apiFetch } from "@/lib/api";
import type { ApiCategory } from "@/types";

export interface CreateCategoryPayload {
  name: string;
  slug: string;
}

export function createAdminCategory(payload: CreateCategoryPayload): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(
    "/admin/categories",
    { method: "POST", body: JSON.stringify(payload) },
    true,
  );
}

export function deleteAdminCategory(id: number): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/admin/categories/${id}`, { method: "DELETE" }, true);
}
