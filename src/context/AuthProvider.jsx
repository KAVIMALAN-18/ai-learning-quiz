import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const BASE_URL = "http://localhost:5000/api/auth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     ✅ SET AXIOS HEADER ON LOAD
     ========================= */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } else {
      delete axios.defaults.headers.common["Authorization"];
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
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
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
      const res = await axios.post(`${BASE_URL}/register`, {
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
     FETCH PROFILE (FIXED)
     ========================= */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile`);
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
    delete axios.defaults.headers.common["Authorization"];
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
