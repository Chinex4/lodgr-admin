import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, tokenStore, unwrap } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [token, setToken] = useState(() => tokenStore.getToken());
  const isAuthenticated = Boolean(token && user);

  const login = async ({ email, password }) => {
    const payload = unwrap(await api.post("/admin/login", { email, password }));
    const nextToken = payload.token;
    const nextUser = payload.user;
    tokenStore.setToken(nextToken);
    tokenStore.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  };

  const logout = useCallback(async () => {
    try {
      if (tokenStore.getToken()) await api.post("/admin/logout");
    } catch (error) {
      console.warn("Admin logout request failed", error);
    }
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      const from = `${window.location.pathname}${window.location.search}`;
      tokenStore.clear();
      setToken(null);
      setUser(null);

      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true, state: { from: { pathname: from } } });
      }
    };

    window.addEventListener("admin-auth-expired", onExpired);
    return () => window.removeEventListener("admin-auth-expired", onExpired);
  }, [navigate]);

  const value = useMemo(() => ({ user, token, isAuthenticated, login, logout }), [user, token, isAuthenticated, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
