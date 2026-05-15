import {
  LayoutDashboard,
  Bot,
  Users,
  Calendar,
  Plug,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import logo from "../assets/logo.png";

export default function MainLayout() {

  const navigate =
    useNavigate();

  const [userEmail, setUserEmail] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
  ========================================
  GET USER
  ========================================
  */
  useEffect(() => {

    supabase.auth
      .getUser()
      .then(({ data }) => {

        if (data.user) {

          setUserEmail(
            data.user.email
          );
        }
      });

  }, []);

  /*
  ========================================
  LOGOUT
  ========================================
  */
  const handleLogout =
    async () => {

      await supabase.auth.signOut();

      navigate("/");
    };

  /*
  ========================================
  NAVIGATION LINKS
  ========================================
  */
  const workspaceLinks = [
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
  ];

  const settingsLinks = [
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

    <div className="min-h-screen bg-[#081120] text-white flex">

      {/* ========================================
      MOBILE TOPBAR
      ======================================== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-[#081120]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(127,90,240,0.35)]">

            <img
              src={logo}
              alt="AIAERA Logo"
              className="w-full h-full object-cover"
            />

          </div>

          <div>

            <h1 className="text-lg font-bold tracking-tight text-white">
              AIAERA
            </h1>

            <p className="text-[10px] text-gray-400">
              AI Workspace
            </p>

          </div>

        </div>

        {/* MOBILE MENU */}
        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center"
        >

          {sidebarOpen ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}

        </button>

      </div>

      {/* ========================================
      MOBILE OVERLAY
      ======================================== */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* ========================================
      SIDEBAR
      ======================================== */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[255px]
          bg-[#0B1120]
          border-r border-white/5
          flex flex-col
          transition-all duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* TOP */}
        <div className="px-5 pt-6">

          {/* DESKTOP LOGO */}
          <div className="flex items-center gap-3 mb-10">

            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(127,90,240,0.35)]">

              <img
                src={logo}
                alt="AIAERA Logo"
                className="w-full h-full object-cover"
              />

            </div>

            <div>

              <h1 className="text-xl font-bold tracking-tight text-white">
                AIAERA
              </h1>

              <p className="text-xs text-gray-400">
                AI Workspace
              </p>

            </div>

          </div>

          {/* WORKSPACE */}
          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-3 px-3">
              Workspace
            </p>

            <nav className="space-y-1">

              {workspaceLinks.map(
                (link) => {

                  const Icon =
                    link.icon;

                  return (

                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({
                        isActive,
                      }) =>
                        `group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[#7f5af0] to-[#6c63ff] text-white shadow-lg shadow-purple-500/20"
                            : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                        }`
                      }
                    >

                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover:bg-white/[0.07] transition-all">

                        <Icon size={17} />

                      </div>

                      <span className="text-sm font-medium">
                        {link.name}
                      </span>

                    </NavLink>
                  );
                }
              )}

            </nav>

          </div>

          {/* SETTINGS */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-600 mb-3 px-3">
              Settings
            </p>

            <nav className="space-y-1">

              {settingsLinks.map(
                (link) => {

                  const Icon =
                    link.icon;

                  return (

                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({
                        isActive,
                      }) =>
                        `group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-[#7f5af0] to-[#6c63ff] text-white shadow-lg shadow-purple-500/20"
                            : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                        }`
                      }
                    >

                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover:bg-white/[0.07] transition-all">

                        <Icon size={17} />

                      </div>

                      <span className="text-sm font-medium">
                        {link.name}
                      </span>

                    </NavLink>
                  );
                }
              )}

            </nav>

          </div>

        </div>

        {/* ========================================
        BOTTOM
        ======================================== */}
        <div className="p-5 mt-auto border-t border-white/5">

          {/* USER CARD */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 mb-3 backdrop-blur-xl">

            <p className="text-[11px] text-gray-500 mb-1">
              Logged in as
            </p>

            <p className="text-sm font-medium truncate text-gray-200">
              {userEmail || "Loading..."}
            </p>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300 transition-all duration-200"
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>

      {/* ========================================
      MAIN CONTENT
      ======================================== */}
      <main className="flex-1 lg:ml-[255px] min-h-screen bg-[#0F172A]">

        {/* BG EFFECTS */}
        <div className="fixed top-[-200px] right-[-100px] w-[350px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="fixed bottom-[-200px] left-[-100px] w-[300px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* PAGE CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto p-5 lg:p-8 pt-24 lg:pt-8 pb-32">

          <Outlet />

        </div>

      </main>

    </div>
  );
}