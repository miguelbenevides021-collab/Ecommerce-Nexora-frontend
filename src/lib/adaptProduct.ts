// src/lib/adaptProduct.ts
import type { ApiProduct, Product } from "@/types";

export function adaptProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    category: "Categoria", // ainda não temos o nome da categoria vindo da API
    image: apiProduct.imageUrl ?? "",
    rating: 0, // não existe na API ainda
    reviewCount: 0,
    oldPrice: Number(apiProduct.price),
    currentPrice: Number(apiProduct.price),
    discount: 0,
    installment: "",
  };
}
