import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

async function refreshUser() {
  try {
    const { data } = await api.get("/api/auth/me");
    setUser(data.user);
  } catch (error) {
    if (error.response?.status === 401) {
      setUser(null);
    } else {
      console.error("Authentication error:", error);
    }
  } finally {
    setLoading(false);
  }
}
  useEffect(() => { refreshUser(); }, []);

  async function signOut() {
    await api.post("/api/auth/logout");
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, setUser, loading, signOut, refreshUser }}>
    {children}
  </AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
