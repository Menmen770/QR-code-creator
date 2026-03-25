import React, { createContext, useContext, useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/api";

const AuthContext = createContext(null);

function getFirstName(fullName) {
  const normalized = String(fullName || "").trim();
  if (!normalized) return "";
  return normalized.split(/\s+/)[0] || "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data?.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUser = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setUser(null);
  };

  const value = {
    user,
    setUser,
    refreshUser,
    logout,
    checkAuth,
    checkingAuth,
    getFirstName,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
