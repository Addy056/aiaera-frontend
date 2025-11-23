// src/components/FloatingMenu.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Users,
  CalendarCheck,
  Puzzle,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";

// Supabase client
import { supabase } from "@/supabaseClient";

// Navigation Items
const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/builder", label: "Builder", icon: Bot },
  { path: "/leads", label: "Leads", icon: Users },
  { path: "/appointments", label: "Appointments", icon: CalendarCheck },
  { path: "/integrations", label: "Integrations", icon: Puzzle },
  { path: "/pricing", label: "Pricing", icon: CreditCard },
  { path: "/settings", label: "Settings", icon: Settings },
];

// SAFER logout: backend redirectTo must match Supabase settings
const FRONTEND_LOGIN = import.meta.env.VITE_APP_BASE_URL + "/login";

export default function FloatingMenu() {
  const handleLogout = async () => {
    try {
      // Redirect method for Supabase auth v2
      const { error } = await supabase.auth.signOut({
        scope: "local",
        redirectTo: FRONTEND_LOGIN,
      });

      if (error) throw error;

      // Fallback for browsers that ignore redirectTo
      window.location.href = FRONTEND_LOGIN;
    } catch (err) {
      console.error("Logout failed:", err.message);
      window.location.href = FRONTEND_LOGIN;
    }
  };

  return (
    <>
      {/* 💻 Desktop Sidebar */}
      <div
        className="hidden md:flex fixed top-1/2 left-4 -translate-y-1/2 
        flex-col items-center gap-4 p-3 rounded-2xl 
        bg-gradient-to-b from-purple-700/40 to-purple-900/30 
        backdrop-blur-xl border border-white/20 shadow-xl z-50"
      >
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center justify-center w-10 h-10 
              rounded-xl transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-purple-600 text-white shadow-purple-500/40 shadow-md scale-105"
                  : "text-gray-300 hover:bg-white/10 hover:scale-105"
              }`
            }
          >
            <Icon className="w-5 h-5" />

            {/* Tooltip */}
            <span
              className="absolute left-14 opacity-0 group-hover:opacity-100 
              bg-black/70 text-white text-xs rounded-md px-2 py-1 transition-all 
              duration-200 whitespace-nowrap shadow-md"
            >
              {label}
            </span>
          </NavLink>
        ))}

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-10 h-10 rounded-xl 
          bg-gradient-to-r from-red-500 to-red-600 text-white 
          hover:scale-110 transition-all duration-200 shadow-md shadow-red-500/40"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 📱 Mobile Bottom Dock */}
      <div
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 
        flex items-center justify-around 
        w-[90%] max-w-sm px-3 py-2 rounded-2xl 
        bg-gradient-to-r from-purple-800/40 to-purple-900/30 
        backdrop-blur-xl border border-white/20 shadow-md 
        shadow-purple-900/30 z-50"
      >
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-2 py-1 rounded-lg 
              transition-all duration-200
              ${
                isActive
                  ? "text-purple-400 scale-110 drop-shadow-lg"
                  : "text-gray-300 hover:text-purple-300"
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[9px]">{label}</span>
          </NavLink>
        ))}

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center 
          px-2 py-1 text-red-400 hover:text-red-500 transition-all"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span className="text-[9px]">Logout</span>
        </button>
      </div>
    </>
  );
}
