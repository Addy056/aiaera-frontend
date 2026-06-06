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
  Sparkles,
  Crown,
  ChevronRight,
} from "lucide-react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  useContext,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import { supabase } from "../lib/supabase";

import logo from "../assets/logo.png";

export default function MainLayout() {

  /*
  ========================================
  AUTH CONTEXT
  ========================================
  */
  const {
    user,
    loading,
    subscription,
    isExpired,
  } = useContext(
    AuthContext
  );

  /*
  ========================================
  STATES
  ========================================
  */
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  /*
  ========================================
  USER EMAIL
  ========================================
  */
  const userEmail =
    user?.email || "";

  /*
  ========================================
  LOGOUT
  ========================================
  */
  const handleLogout =
    async () => {

      try {

        setSidebarOpen(
          false
        );

        const {
          error,
        } =
          await supabase.auth.signOut();

        if (error) {

          console.error(
            "Logout Error:",
            error.message
          );

          return;
        }

        window.location.href =
          "/";

      } catch (err) {

        console.error(
          "Logout Failed:",
          err
        );
      }
    };

  
  /*
  ========================================
  LINKS
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

  /*
  ========================================
  LOADING
  ========================================
  */
  if (loading) {

    return (

      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white overflow-hidden relative">

        {/* GLOW */}
        <div className="absolute top-[-140px] left-[-140px] w-[320px] h-[320px] bg-purple-600/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-140px] right-[-140px] w-[320px] h-[320px] bg-blue-600/20 blur-[140px] rounded-full"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center gap-5">

          <div className="relative">

            <div className="absolute inset-0 bg-purple-500/20 blur-[35px] rounded-full"></div>

            <div className="relative w-16 h-16 rounded-full border-[5px] border-purple-500/10 border-t-purple-500 animate-spin"></div>

          </div>

          <p className="text-sm text-gray-400 tracking-wide">

            Loading Workspace...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed top-[-220px] left-[-220px] w-[450px] h-[450px] bg-purple-600/10 blur-[160px] rounded-full"></div>

      <div className="fixed bottom-[-220px] right-[-220px] w-[450px] h-[450px] bg-blue-600/10 blur-[160px] rounded-full"></div>

      {/* MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-[rgba(11,17,32,0.78)] backdrop-blur-3xl border-b border-white/[0.06] flex items-center justify-between px-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="absolute inset-0 bg-purple-500/20 blur-[20px] rounded-2xl"></div>

            <div className="
              relative
              w-11
              h-11
              rounded-2xl
              overflow-hidden
              border
              border-white/10
              bg-gradient-to-br
              from-white/[0.08]
              to-white/[0.02]
              backdrop-blur-xl
              shadow-[0_10px_30px_rgba(127,90,240,0.18)]
            ">

              <img
                src={logo}
                alt="AIAERA"
                className="w-full h-full object-cover"
              />

            </div>

          </div>

          <div>

            <h1 className="text-lg font-black tracking-tight">

              AIAERA

            </h1>

            <p className="text-[10px] text-gray-400">

              AI Workspace

            </p>

          </div>

        </div>

        {/* MENU */}
        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="
            w-11
            h-11
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/[0.06]
            flex
            items-center
            justify-center
            backdrop-blur-xl
            shadow-[0_10px_25px_rgba(0,0,0,0.25)]
          "
        >

          {sidebarOpen ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}

        </button>

      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[290px]
          bg-[rgba(11,17,32,0.82)]
          backdrop-blur-3xl
          border-r border-white/[0.06]
          shadow-[0_0_60px_rgba(0,0,0,0.45)]
          flex flex-col
          transition-all duration-300
          overflow-hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        {/* GLOW */}
        <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] bg-purple-500/10 blur-[120px] rounded-full"></div>

        {/* GLASS OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

        {/* LOGO */}
        <div className="relative z-10 px-6 pt-6 pb-5 border-b border-white/[0.05]">

          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-purple-500/20 blur-[20px] rounded-3xl"></div>

              <div className="
                relative
                w-14
                h-14
                rounded-[22px]
                overflow-hidden
                border
                border-white/10
                bg-gradient-to-br
                from-white/[0.08]
                to-white/[0.02]
                shadow-[0_10px_30px_rgba(127,90,240,0.18)]
                backdrop-blur-xl
              ">

                <img
                  src={logo}
                  alt="AIAERA"
                  className="w-full h-full object-cover"
                />

              </div>

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-tight">

                AIAERA

              </h1>

              <div className="flex items-center gap-2 mt-1">

                <Sparkles
                  size={11}
                  className="text-purple-300"
                />

                <span className="text-[11px] text-gray-400">

                  AI Business Automation

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* EXPIRED */}
        {isExpired && (

          <div className="mx-4 mt-4 rounded-[26px] border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(239,68,68,0.08)]">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">

                <Crown
                  size={16}
                  className="text-red-300"
                />

              </div>

              <div>

                <h3 className="text-sm font-semibold text-red-200 mb-1">

                  Subscription Expired

                </h3>

                <p className="text-[11px] text-red-100/70 leading-relaxed">

                  Features are temporarily paused until renewal.

                </p>

              </div>

            </div>

          </div>

        )}

        {/* NAVIGATION */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5">

          {/* WORKSPACE */}
          <div className="mb-8">

            <div className="px-3 mb-3">

              <p className="text-[11px] uppercase tracking-[2px] text-gray-500 font-semibold">

                Workspace

              </p>

            </div>

            <div className="space-y-2">

              {workspaceLinks.map(
                (item) => {

                  const Icon =
                    item.icon;

                  return (

                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                          group
                          flex
                          items-center
                          justify-between
                          px-4
                          h-[60px]
                          rounded-[22px]
                          transition-all
                          duration-300
                          border
                          ${
                            isActive
                              ? `
                                bg-[linear-gradient(135deg,rgba(127,90,240,0.28),rgba(59,130,246,0.22))]
                                border-purple-400/20
                                shadow-[0_10px_50px_rgba(127,90,240,0.28)]
                                backdrop-blur-xl
                              `
                              : `
                                bg-white/[0.025]
                                border-white/[0.04]
                                hover:bg-white/[0.05]
                                hover:border-white/[0.08]
                                hover:translate-x-[2px]
                              `
                          }
                        `
                      }
                    >

                      <div className="flex items-center gap-4">

                        <div className="
                          w-10
                          h-10
                          rounded-xl
                          bg-gradient-to-br
                          from-white/[0.08]
                          to-white/[0.02]
                          border
                          border-white/[0.05]
                          backdrop-blur-xl
                          flex
                          items-center
                          justify-center
                        ">

                          <Icon size={18} />

                        </div>

                        <span className="font-medium">

                          {item.name}

                        </span>

                      </div>

                      <ChevronRight
                        size={16}
                        className="opacity-50 group-hover:translate-x-1 transition-all"
                      />

                    </NavLink>

                  );
                }
              )}

            </div>

          </div>

          {/* SETTINGS */}
          <div>

            <div className="px-3 mb-3">

              <p className="text-[11px] uppercase tracking-[2px] text-gray-500 font-semibold">

                Settings

              </p>

            </div>

            <div className="space-y-2">

              {settingsLinks.map(
                (item) => {

                  const Icon =
                    item.icon;

                  return (

                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                          group
                          flex
                          items-center
                          justify-between
                          px-4
                          h-[60px]
                          rounded-[22px]
                          transition-all
                          duration-300
                          border
                          ${
                            isActive
                              ? `
                                bg-[linear-gradient(135deg,rgba(127,90,240,0.28),rgba(59,130,246,0.22))]
                                border-purple-400/20
                                shadow-[0_10px_50px_rgba(127,90,240,0.28)]
                                backdrop-blur-xl
                              `
                              : `
                                bg-white/[0.025]
                                border-white/[0.04]
                                hover:bg-white/[0.05]
                                hover:border-white/[0.08]
                                hover:translate-x-[2px]
                              `
                          }
                        `
                      }
                    >

                      <div className="flex items-center gap-4">

                        <div className="
                          w-10
                          h-10
                          rounded-xl
                          bg-gradient-to-br
                          from-white/[0.08]
                          to-white/[0.02]
                          border
                          border-white/[0.05]
                          backdrop-blur-xl
                          flex
                          items-center
                          justify-center
                        ">

                          <Icon size={18} />

                        </div>

                        <span className="font-medium">

                          {item.name}

                        </span>

                      </div>

                      <ChevronRight
                        size={16}
                        className="opacity-50 group-hover:translate-x-1 transition-all"
                      />

                    </NavLink>

                  );
                }
              )}

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="relative z-10 p-4 border-t border-white/[0.05]">

          {/* USER */}
          <div className="
            rounded-[28px]
            border
            border-white/[0.06]
            bg-gradient-to-br
            from-white/[0.06]
            to-white/[0.02]
            backdrop-blur-2xl
            p-4
            mb-4
            shadow-[0_10px_40px_rgba(0,0,0,0.25)]
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-[linear-gradient(135deg,#7f5af0,#5b8cff)]
                shadow-[0_10px_30px_rgba(127,90,240,0.35)]
                flex
                items-center
                justify-center
                font-bold
                text-lg
              ">

                {userEmail?.charAt(0)?.toUpperCase() ||
                  "A"}

              </div>

              <div className="min-w-0">

                <h3 className="text-sm font-semibold truncate">

                  {userEmail ||
                    "User"}

                </h3>

                <p className="text-xs text-gray-400 truncate">

                  {subscription?.plan ||
  "Free"}{" "}
plan

                </p>

              </div>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={
              handleLogout
            }
            className="
              w-full
              h-[58px]
              rounded-[22px]
              bg-gradient-to-br
              from-red-500/12
              to-red-500/5
              border
              border-red-500/15
              hover:from-red-500/20
              hover:to-red-500/10
              shadow-[0_8px_30px_rgba(239,68,68,0.12)]
              transition-all
              duration-300
              flex
              items-center
              justify-center
              gap-3
              text-red-300
              font-medium
            "
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-[290px] min-h-screen">

        <div className="p-4 lg:p-10 pt-20 lg:pt-10 relative z-10">

          <Outlet />

        </div>

      </main>

    </div>
  );
}