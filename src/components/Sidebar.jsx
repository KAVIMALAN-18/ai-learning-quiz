import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Map,
  MessageCircle,
  BarChart2,
  BookOpen,
  Target,
  Layers,
  Settings,
  LogOut,
  BrainCircuit,
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  Award
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { MetaText } from "./ui/Typography";

const MAIN_NAV = [
  { to: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/courses", label: "Browse Courses", icon: BookOpen },
  { to: "/dashboard/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/dashboard/quizzes", label: "Assessments", icon: Layers },
  { to: "/dashboard/chat", label: "AI Tutor", icon: MessageCircle },
];

const SETTINGS_NAV = [
  { to: "/dashboard/profile", label: "Profile", icon: Users },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-all duration-300 group ${isActive
          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
        }`
      }
    >
      <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
      <span>{label}</span>
    </NavLink>
  </li>
);

export default function Sidebar({ onNavItemClick }) {
  const { logout, user } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-neutral-100 h-full flex flex-col shrink-0 z-30 transition-all">
      {/* Brand */}
      <div className="p-8 h-24 flex items-center border-b border-neutral-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-primary-600/30">
            <BrainCircuit size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-neutral-900 leading-none">LearnSphere</span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary-600 mt-1">Studio</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <div>
          <ul className="space-y-1.5">
            {MAIN_NAV.map((item) => <NavItem key={item.to} {...item} onClick={onNavItemClick} />)}
          </ul>
        </div>

        <div className="pt-6 border-t border-neutral-50">
          <MetaText className="uppercase font-bold tracking-[0.2em] text-neutral-400 mb-4 px-4 block">
            Preferences
          </MetaText>
          <ul className="space-y-1.5">
            {SETTINGS_NAV.map((item) => <NavItem key={item.to} {...item} onClick={onNavItemClick} />)}
          </ul>
        </div>

        {/* 🛡️ Admin Section */}
        {(user?.role === 'admin' || user?.role === 'super_admin') && (
          <div className="pt-6 border-t border-neutral-50">
            <MetaText className="uppercase font-bold tracking-[0.2em] text-primary-600 mb-4 px-4 block">
              Admin Control
            </MetaText>
            <ul className="space-y-1.5">
              <NavItem to="/dashboard/admin/overview" label="Admin Dashboard" icon={LayoutDashboard} onClick={onNavItemClick} />
              <NavItem to="/dashboard/admin/courses" label="Manage Courses" icon={BookOpen} onClick={onNavItemClick} />
              <NavItem to="/dashboard/admin/users" label="Users" icon={Users} onClick={onNavItemClick} />
            </ul>
          </div>
        )}
      </nav>


      {/* User Footer */}
      <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm font-bold text-neutral-500 hover:bg-error/10 hover:text-error transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
