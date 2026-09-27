import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";

export type CreatedOrder = Omit<Order, "orderItem"> & { orderItem?: Order["orderItem"] };

export function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders", { method: "GET" }, true);
}

export function createOrder(): Promise<CreatedOrder> {
  return apiFetch<CreatedOrder>("/orders", { method: "POST" }, true);
}
