import { API_URL, apiFetch } from "@/lib/api";
import type { ApiCategory, ApiProduct } from "@/types";

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}

export function getProductById(id: number): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${id}`);
}

export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }
  return response.json();
}
