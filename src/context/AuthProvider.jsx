import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchProfile();
    } else {
      delete axios.defaults.headers.common.Authorization;
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, mobile, password) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    console.log("calainf");
    
    try {
      const res = await axios.get(`${BASE_URL}/profile`);
      setUser(res.data);
    } catch {
      console.error("Profile fetch failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout,fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
