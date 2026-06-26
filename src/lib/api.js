import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "bealodgr_admin_token";
const USER_KEY = "bealodgr_admin_user";

export const tokenStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
  },
  setUser: (user) => user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
};

export const api = axios.create({ baseURL: API_BASE_URL, headers: { Accept: "application/json" } });

const notifyAuthExpired = () => {
  tokenStore.clear();
  window.dispatchEvent(new Event("admin-auth-expired"));
};

api.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = original?.url?.includes("/auth/refresh");

    if (isUnauthorized && !original?._retry && !isRefreshRequest && tokenStore.getToken()) {
      original._retry = true;
      refreshing ||= api.post("/auth/refresh").then((res) => {
        const token = res.data?.token || res.data?.data?.token;
        if (!token) throw new Error("Refresh token missing");
        tokenStore.setToken(token);
        return token;
      }).finally(() => { refreshing = null; });
      try {
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        notifyAuthExpired();
        return Promise.reject(refreshError);
      }
    }

    if (isUnauthorized) {
      notifyAuthExpired();
    }

    return Promise.reject(error);
  }
);

export const unwrap = (res) => res.data?.data ?? res.data;
export const errorMessage = (error) => error.response?.data?.message || error.message || "Request failed";
