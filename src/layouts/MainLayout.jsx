import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔥 BETTER ACTIVE CHECK
  const navItem = (path, label) => {
    const isActive = location.pathname.startsWith(path);

    return (
      <Link
        to={path}
        className={`block px-4 py-2 rounded-xl transition ${
          isActive
            ? "bg-gradient-to-r from-[#7f5af0] to-[#9f7aea] text-white shadow-lg"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0c1a] via-[#15112a] to-[#1a1625] text-white">

      {/* SIDEBAR */}
      <div className="w-64 p-6 flex flex-col justify-between bg-white/5 backdrop-blur-2xl border-r border-white/10">

        {/* TOP */}
        <div>
          <h1 className="text-2xl font-bold text-[#7f5af0] mb-10 tracking-wide">
            AIAERA
          </h1>

          <nav className="space-y-3">
            {navItem("/dashboard", "Dashboard")}
            {navItem("/builder", "Builder")}
            {navItem("/leads", "Leads")}
            {navItem("/appointments", "Appointments")}
            {navItem("/integrations", "Integrations")}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="space-y-4">

          {/* 🔥 FIXED: PRICING WITH SIDEBAR */}
          <Link
            to="/app/pricing"
            className={`block px-4 py-2 rounded-xl transition ${
              location.pathname.startsWith("/app/pricing")
                ? "bg-gradient-to-r from-[#7f5af0] to-[#9f7aea] text-white shadow-lg"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            Pricing
          </Link>

          {/* USER CARD */}
          {user && (
            <div className="bg-white/10 border border-white/10 rounded-xl p-3 text-sm">
              <p className="text-gray-400 text-xs">Logged in as</p>
              <p className="truncate">{user.email}</p>
            </div>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}