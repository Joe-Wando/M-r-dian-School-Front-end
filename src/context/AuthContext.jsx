import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";
import { getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restaure la session depuis le token JWT stocke.
  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  // Deconnexion forcee si l'API repond 401.
  useEffect(() => {
    function onUnauthorized() {
      setUser(null);
      setToken(null);
    }
    window.addEventListener("meredian:unauthorized", onUnauthorized);
    return () => window.removeEventListener("meredian:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: u } = await api.login(credentials);
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: u } = await api.register(payload);
    setToken(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans <AuthProvider>");
  return ctx;
}
