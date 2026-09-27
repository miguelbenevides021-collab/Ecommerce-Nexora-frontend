import { apiFetch } from "@/lib/api";
import type { Cart, CartItem } from "@/types";

export function getCart(): Promise<Cart> {
  return apiFetch<Cart>("/carrinho", { method: "GET" }, true);
}

export function addCartItem(productId: number, quantity: number): Promise<{ cartItem: CartItem }> {
  return apiFetch<{ cartItem: CartItem }>(
    "/carrinho",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    },
    true,
  );
}

export function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  return apiFetch<CartItem>(
    `/carrinho/${itemId}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    },
    true,
  );
}

export function removeCartItem(itemId: number): Promise<CartItem> {
  return apiFetch<CartItem>(`/carrinho/${itemId}`, { method: "DELETE" }, true);
}
