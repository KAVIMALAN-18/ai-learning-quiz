import React, { useState } from "react";
import Container from "./ui/Container";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Edit3, LogOut, LayoutDashboard, Compass } from "lucide-react";
import { useAuth } from "../context/useAuth";

const NavLink = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
          ? "bg-primary-50 text-primary-600 font-semibold shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}

      >
        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`} />
        <span>{children}</span>
      </Link>
    </li>
  );
};

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="bg-white/80 backdrop-blur-md w-72 hidden md:flex flex-col p-6 border-r border-slate-200/60 sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Compass className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">AI Learning</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/onboarding" icon={Edit3}>Onboarding</NavLink>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <span className="font-bold text-lg gradient-text">AI Learning</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-72 bg-white h-full p-6 shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-10 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Compass className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold gradient-text">AI Learning</span>
            </div>
            <nav>
              <ul className="space-y-2">
                <NavLink to="/dashboard" icon={LayoutDashboard} onClick={() => setOpen(false)}>Dashboard</NavLink>
                <NavLink to="/onboarding" icon={Edit3} onClick={() => setOpen(false)}>Onboarding</NavLink>
                <li className="pt-6 border-t border-slate-100">
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-500 font-medium"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Container>
          <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 w-full animate-slide-up">
            {children}
          </main>
        </Container>
      </div>
    </div>
  );
};

export default Layout;
