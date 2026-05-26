import { ENDPOINTS } from "../config/api";

export async function fetchProducts(limit = 100) {
  const res = await fetch(`${ENDPOINTS.products}?limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch products");
  return data.products ? data.products.map(p => ({ ...p, id: p._id })) : [];
}

export async function fetchCategories() {
  const res = await fetch(ENDPOINTS.categories);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
  return data || [];
}
