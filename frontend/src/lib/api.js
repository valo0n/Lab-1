/* API client - menaxhon thirrjet ne backend dhe auto-refresh te tokenit */

const API_URL = "http://localhost:5000/api";

/* Helpers per localStorage */
const getAccessToken = () => localStorage.getItem("paradox_access_token");
const getRefreshToken = () => localStorage.getItem("paradox_refresh_token");
const setTokens = (access, refresh) => {
  localStorage.setItem("paradox_access_token", access);
  localStorage.setItem("paradox_refresh_token", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("paradox_access_token");
  localStorage.removeItem("paradox_refresh_token");
  localStorage.removeItem("paradox_user");
};

/* Flag per te shmangur refresh-e te shumefishta paralelisht */
let isRefreshing = false;
let refreshQueue = [];

/* Funksioni qe rinovon tokenin */
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("Nuk ka refresh token");
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Refresh dështoi");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

/* Wrapper kryesor i fetch-it - menaxhon auth automatikisht */
export async function apiRequest(endpoint, options = {}) {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  /* Shto access token nese ekziston */
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });

  /* Nese tokeni ka skaduar (401), provo te rinovohet dhe te ribehet thirrja */
  if (res.status === 401 && !skipAuth && getRefreshToken()) {
    try {
      /* Nese tashme po behet nje refresh, prit te perfundoje */
      if (isRefreshing) {
        await new Promise((resolve) => refreshQueue.push(resolve));
      } else {
        isRefreshing = true;
        await refreshAccessToken();
        /* Lajmero te gjitha kerkesat ne prite */
        refreshQueue.forEach((resolve) => resolve());
        refreshQueue = [];
        isRefreshing = false;
      }

      /* Riprovoje me tokenin e ri */
      const newToken = getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });
    } catch (err) {
      isRefreshing = false;
      refreshQueue = [];
      throw err;
    }
  }

  /* Parse JSON */
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Gabim ne API");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* Shkurtimet per metodat e zakonshme */
export const api = {
  get: (endpoint, opts) => apiRequest(endpoint, { method: "GET", ...opts }),
  post: (endpoint, body, opts) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...opts,
    }),
  put: (endpoint, body, opts) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...opts,
    }),
  delete: (endpoint, opts) =>
    apiRequest(endpoint, { method: "DELETE", ...opts }),
};
/* ─────────────────────────────────────────────
   PRODUCTS API helpers
   ───────────────────────────────────────────── */

/* Merr te gjitha produktet me filter opsional */
export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/products${query ? `?${query}` : ""}`, { skipAuth: true });
};

/* Merr nje produkt sipas ID */
export const getProduct = (id) =>
  api.get(`/products/${id}`, { skipAuth: true });

/* Krijo produkt te ri (Admin only) */
export const createProduct = (data) => api.post("/products", data);

/* Edito produkt (Admin only) */
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

/* Fshi produkt (Admin only) */
export const deleteProduct = (id) => api.delete(`/products/${id}`);

/* ─────────────────────────────────────────────
   CATEGORIES API helpers
   ───────────────────────────────────────────── */

/* Merr te gjitha kategorit */
export const getCategories = () => api.get("/categories", { skipAuth: true });
/* Eksporto helpers per AuthContext */
export { getAccessToken, getRefreshToken, setTokens, clearTokens };
