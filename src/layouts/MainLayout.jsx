import {
  LayoutDashboard,
  Bot,
  Users,
  Calendar,
  Plug,
  CreditCard,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import logo from "../assets/aiaera-logo.png";
export default function MainLayout() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 GET USER
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔥 SIDEBAR LINKS
  const links = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/app/dashboard",
    },
    {
      name: "Builder",
      icon: Bot,
      path: "/app/builder",
    },
    {
      name: "Leads",
      icon: Users,
      path: "/app/leads",
    },
    {
      name: "Appointments",
      icon: Calendar,
      path: "/app/appointments",
    },
    {
      name: "Integrations",
      icon: Plug,
      path: "/app/integrations",
    },
    {
      name: "Pricing",
      icon: CreditCard,
      path: "/app/pricing",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060816] text-white flex overflow-hidden relative">

      {/* 🔥 MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 z-50 bg-[#060816]/80 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-5">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="text-xl font-black">
              AIAERA
            </h1>

            <p className="text-[10px] text-gray-400">
              AI Chatbot Builder
            </p>
          </div>

        </div>

        {/* MENU BUTTON */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* 🔥 SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[280px]
          bg-white/5 backdrop-blur-2xl border-r border-white/10
          p-6 flex flex-col justify-between
          transition-all duration-300
          
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="hidden lg:flex items-center gap-3 mb-10">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles />
            </div>

            <div>
              <h1 className="text-2xl font-black">
                AIAERA
              </h1>

              <p className="text-xs text-gray-400">
                AI Chatbot Builder
              </p>
            </div>

          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3 mt-20 lg:mt-0">

            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20"
                        : "hover:bg-white/10 text-gray-300 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {link.name}
                  </span>
                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* BOTTOM */}
        <div>

          {/* USER CARD */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">

            <p className="text-xs text-gray-400 mb-1">
              Logged in as
            </p>

            <p className="text-sm font-medium truncate">
              {userEmail || "Loading..."}
            </p>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 py-3 rounded-2xl text-red-300 hover:bg-red-500/20 transition-all duration-300"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>

      </aside>

      {/* 🔥 MAIN CONTENT */}
      <main className="flex-1 lg:ml-[280px] pt-24 lg:pt-8 p-5 lg:p-8 overflow-y-auto">

        {/* BACKGROUND GLOW */}
        <div className="fixed top-[-150px] left-[-100px] w-[350px] h-[350px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="fixed bottom-[-150px] right-[-100px] w-[350px] h-[350px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none"></div>

        {/* PAGE */}
        <div className="relative z-10">
          <Outlet />
        </div>

      </main>

    </div>
  );
}