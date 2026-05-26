export const API_BASE_URL = "https://ceramic-studio-backend.onrender.com/api/v1";

export const ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/products/categories`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  users: {
    me: `${API_BASE_URL}/users/me`,
  },
  orders: `${API_BASE_URL}/orders`,
};
