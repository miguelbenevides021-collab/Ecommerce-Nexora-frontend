import type { ApiProduct } from "@/types";

const API_URL = "http://localhost:3000";

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}
