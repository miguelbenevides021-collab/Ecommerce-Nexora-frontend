import { API_URL } from "@/lib/api";
import type { ApiProduct } from "@/types";

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}
