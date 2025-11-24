// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Dummy credentials for now
const ADMIN_CREDENTIALS = {
  email: "admin@zagasm.com",
  password: "Admin123!",
};

const STORAGE_KEY = "zagasm_admin_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hydrate from localStorage on first load
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.email) {
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch {
      // ignore bad JSON
    }
  }, []);

  const login = async ({ email, password }) => {
    // mimic async call
    await new Promise((res) => setTimeout(res, 500));

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser = { email, name: "Zagasm Admin" };
      setUser(adminUser);
      setIsAuthenticated(true);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid admin credentials. Try again.",
    };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
