import axios from "axios";
import { mockAdapter } from "./mock/handlers";

// Par defaut, le frontend cible le backend NestJS. Passer VITE_USE_MOCKS=true
// pour retomber sur la couche de donnees simulee (aucun backend requis).
const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? "false") === "true";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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

function extractMessage(error) {
  const data = error.response?.data;
  // Backend NestJS : { error: { message: string | string[] } }.
  // Filtre de validation : { message: string[] }. Mock : { message: string }.
  const raw = data?.error?.message ?? data?.message ?? data?.error;
  if (Array.isArray(raw)) return raw.join(" · ");
  if (typeof raw === "string" && raw) return raw;
  return error.message || "Erreur reseau — verifie ta connexion.";
}

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
    return Promise.reject(Object.assign(new Error(extractMessage(error)), { status, raw: error }));
  }
);

export { client, USE_MOCKS, BASE_URL };
