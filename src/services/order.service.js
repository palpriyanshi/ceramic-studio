import { ENDPOINTS } from "../config/api";

export async function createOrder(payload, token) {
  const res = await fetch(ENDPOINTS.orders, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to place order");
  return data;
}

export async function fetchMyOrders(token) {
  const res = await fetch(`${ENDPOINTS.orders}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  // Backend returns paginated { orders: [...] }
  return data.orders || [];
}

export async function cancelOrder(orderId, token) {
  const res = await fetch(`${ENDPOINTS.orders}/my/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason: "Cancelled by customer" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to cancel order");
  return data;
}
