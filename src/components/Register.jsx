import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, ChevronRight, Compass } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, mobile, password);
    if (success) {
      navigate("/onboarding");
    }
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
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900">Get Started</h1>
            <p className="text-slate-500 mt-1">Create your account and start learning</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-slide-up">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={mobile}
                  required
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-600 font-bold text-xs hover:text-primary-700 transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              className="py-3 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Sign In
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

export default Register;
