import { API_BASE_URL } from "../config/api";

export async function adminCreateProduct(productPayload, token) {
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create product");
  return data;
}

export async function adminUpdateProduct(productId, productPayload, token) {
  const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update product");
  return data;
}

export async function adminDeleteProduct(productId, token) {
  const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete product");
  return data;
}

export async function adminFetchAllOrders(token) {
  const res = await fetch(`${API_BASE_URL}/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data.orders || [];
}

export async function adminUpdateOrderStatus(orderId, status, token, reason) {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order status");
  return data;
}

