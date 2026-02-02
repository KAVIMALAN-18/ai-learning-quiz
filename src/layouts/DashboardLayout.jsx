import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu, X, BrainCircuit } from "lucide-react";

import Footer from "../components/Footer";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-mesh flex overflow-hidden font-sans text-neutral-900 selection:bg-primary-500 selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full border-r border-neutral-100 bg-white">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-neutral-100 px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <BrainCircuit size={20} />
            </div>
            <span className="text-lg font-black tracking-tighter">LearnSphere</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-72 h-full bg-white shadow-2xl animate-slide-right flex flex-col">
              <div className="absolute top-6 right-6 z-50">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors bg-neutral-50 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <Sidebar onNavItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Scrollable View */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-neutral-50 flex flex-col">
          <div className="flex-1 p-4 sm:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto min-h-screen animate-slide-up">
              <Outlet />
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

