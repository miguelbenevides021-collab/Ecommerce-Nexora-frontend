// src/lib/adaptProduct.ts
import type { ApiProduct, Product } from "@/types";
import { categories } from "@/data/categories";

export function adaptProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    categoryId: apiProduct.categoriaId,
    name: apiProduct.name,
    category:
      categories.find((category) => category.categoryId === apiProduct.categoriaId)
        ?.name ?? "Categoria",
    image: apiProduct.imageUrl ?? "",
    rating: 0, // não existe na API ainda
    reviewCount: 0,
    oldPrice: Number(apiProduct.price),
    currentPrice: Number(apiProduct.price),
    discount: 0,
    installment: "",
  };
}
