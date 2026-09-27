import { apiFetch } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";

export function getAdminOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/admin/orders", { method: "GET" }, true);
}

export function updateAdminOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<Pick<Order, "id" | "status" | "updatedAt">> {
  return apiFetch<Pick<Order, "id" | "status" | "updatedAt">>(
    `/admin/orders/${id}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    true,
  );
}
