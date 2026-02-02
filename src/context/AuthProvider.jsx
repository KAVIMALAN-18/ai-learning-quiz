import { useState, useEffect, useRef } from "react";
import api from "../services/api.client";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastSyncRef = useRef(0);

  /* =========================
     ✅ SYNC USER PROFILE ON LOAD
     ========================= */
  useEffect(() => {
    if (token) {
      const now = Date.now();
      if (now - lastSyncRef.current < 1000) return;
      lastSyncRef.current = now;
      fetchProfile();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  /* =========================
     LOGIN
     ========================= */
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  /* =========================
     REGISTER
     ========================= */
  const register = async (name, email, mobile, password) => {
    setError(null);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        mobile,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  /* =========================
     FETCH PROFILE
     ========================= */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed");
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGOUT
     ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
