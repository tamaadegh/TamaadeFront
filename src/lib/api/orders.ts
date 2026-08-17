import { apiClient } from "./client";
import { getStoredToken } from "./auth";
import type { Order, OrderItem } from "@/types";

function authOptions() {
  const token = getStoredToken();
  return {
    credentials: "include" as const,
    token: token ?? undefined,
  };
}

export async function getOrders(): Promise<Order[]> {
  const data = await apiClient<Order[] | { results: Order[] }>(
    "/api/user/orders/",
    authOptions(),
  );
  return Array.isArray(data) ? data : data.results;
}

export async function getPendingOrder(): Promise<Order | null> {
  if (!getStoredToken()) return null;
  const orders = await getOrders();
  return orders.find((o) => o.status === "P") ?? null;
}

export async function createOrder(items: { product: number; quantity: number }[]): Promise<Order> {
  return apiClient<Order>("/api/user/orders/", {
    method: "POST",
    body: { order_items: items },
    ...authOptions(),
  });
}

export async function addOrderItem(
  orderId: number,
  productId: number,
  quantity: number,
): Promise<OrderItem> {
  return apiClient<OrderItem>(`/api/user/orders/${orderId}/order-items/`, {
    method: "POST",
    body: { product: productId, quantity },
    ...authOptions(),
  });
}

export async function updateOrderItem(
  orderId: number,
  itemId: number,
  quantity: number,
): Promise<OrderItem> {
  return apiClient<OrderItem>(`/api/user/orders/${orderId}/order-items/${itemId}/`, {
    method: "PATCH",
    body: { quantity },
    ...authOptions(),
  });
}

export async function removeOrderItem(orderId: number, itemId: number): Promise<void> {
  await apiClient<void>(`/api/user/orders/${orderId}/order-items/${itemId}/`, {
    method: "DELETE",
    ...authOptions(),
  });
}

export async function addProductToCart(
  productId: number,
  quantity = 1,
): Promise<Order> {
  const pending = await getPendingOrder();

  if (!pending) {
    return createOrder([{ product: productId, quantity }]);
  }

  const existing = pending.order_items.find((item) => item.product === productId);
  if (existing) {
    await updateOrderItem(pending.id, existing.id, existing.quantity + quantity);
  } else {
    await addOrderItem(pending.id, productId, quantity);
  }

  const updated = await getPendingOrder();
  if (!updated) throw new Error("Failed to refresh cart");
  return updated;
}
