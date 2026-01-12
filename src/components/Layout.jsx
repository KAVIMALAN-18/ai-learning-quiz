import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, Edit3, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-50 via-white to-teal-50 text-gray-900 flex !bg-black">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-64 hidden md:flex flex-col p-4 border-r border-gray-100`}>
        <div className="mb-6 text-xl font-bold">AI Quiz</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-50">
                <Home className="w-4 h-4 text-indigo-600" /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/onboarding" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-50">
                <Edit3 className="w-4 h-4 text-teal-600" /> <span>Onboarding</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-4">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4"/> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen((s) => !s)} className="p-2 rounded hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold">AI Quiz</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-indigo-600">Dashboard</Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/30" onClick={() => setOpen(false)}>
          <div className="w-64 bg-white h-full p-4" onClick={(e) => e.stopPropagation()}>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-50">
                    <Home className="w-4 h-4 text-indigo-600" /> <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/onboarding" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-indigo-50">
                    <Edit3 className="w-4 h-4 text-teal-600" /> <span>Onboarding</span>
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-red-600">Logout</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 pt-0 md:pt-6">
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
