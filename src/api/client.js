import axios from "axios";
import { mockAdapter } from "./mock/handlers";

const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? "true") === "true";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const TOKEN_KEY = "meredian.token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* stockage indisponible */
  }
}

const client = axios.create({
  baseURL: USE_MOCKS ? "" : BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Branche la couche simulee tant que le backend n'est pas deploye.
if (USE_MOCKS) {
  client.defaults.adapter = mockAdapter;
}

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      setToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/connexion")) {
        window.dispatchEvent(new CustomEvent("meredian:unauthorized"));
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Erreur reseau — verifie ta connexion.";
    return Promise.reject(Object.assign(new Error(message), { status, raw: error }));
  }
);

export { client, USE_MOCKS, BASE_URL };
