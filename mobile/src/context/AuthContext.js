import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiFetchWithTimeout,
  clearStoredAuthToken,
  getApiBaseUrl,
  parseJsonResponse,
  setStoredAuthToken,
} from "../utils/api";

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
      const response = await apiFetchWithTimeout(
        `${getApiBaseUrl()}/api/auth/me`,
        { credentials: "include" },
        12000,
      );
      if (response.ok) {
        const data = await parseJsonResponse(response);
        setUser(data?.user || null);
      } else {
        setUser(null);
        if (response.status === 401) {
          await clearStoredAuthToken();
        }
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

  /**
   * @param {object} userData
   * @param {string} [token] — JWT מהשרת אחרי login/register
   */
  const refreshUser = async (userData, token) => {
    if (token) {
      await setStoredAuthToken(token);
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiFetchWithTimeout(
        `${getApiBaseUrl()}/api/auth/logout`,
        { method: "POST", credentials: "include" },
        12000,
      );
    } catch (e) {
      console.warn("Logout error:", e);
    }
    await clearStoredAuthToken();
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
