import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Compass } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
              <Compass className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight gradient-text">AI Learning</span>
          </div>
        </div>

        <Card className="shadow-2xl border-slate-200/60 !p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-1">Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-slide-up">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              className="py-3.5"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; 2026 AI Learning platform. Built for the future of education.
        </p>
      </div>
    </div>
  );
};

export default Login;
