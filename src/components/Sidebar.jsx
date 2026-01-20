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
} from "lucide-react";

const items = [
  { to: "/dashboard/overview", label: "Overview", icon: Home },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/quiz", label: "Quiz", icon: BookOpen },
  { to: "/dashboard/chat", label: "Chat", icon: MessageCircle },
  { to: "/dashboard/progress", label: "Progress", icon: BarChart2 },
  { to: "/dashboard/goals", label: "Goals", icon: Target },
  { to: "/dashboard/analytics", label: "Analytics", icon: Layers },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">LearnSphere</h2>
        <p className="text-sm text-gray-500">Your learning hub</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{it.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto text-xs text-gray-400">v1.0</div>
    </aside>
  );
}
