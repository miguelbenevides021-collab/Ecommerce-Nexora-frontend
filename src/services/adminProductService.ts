import { apiFetch } from "@/lib/api";
import type { ApiProduct } from "@/types";

export interface CreateProductPayload {
  categoriaId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  imageUrl: string;
}

export type UpdateProductPayload = Omit<CreateProductPayload, "categoriaId">;

export function createAdminProduct(payload: CreateProductPayload): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    "/admin/products",
    { method: "POST", body: JSON.stringify(payload) },
    true,
  );
}

export function updateAdminProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(
    `/admin/products/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    true,
  );
}

export function deleteAdminProduct(id: number): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/admin/products/${id}`, { method: "DELETE" }, true);
}
