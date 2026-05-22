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
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import logo from "../assets/logo.png";

export default function MainLayout() {

  /*
  ========================================
  STATES
  ========================================
  */
  const [userEmail, setUserEmail] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [subscription, setSubscription] =
    useState(null);

  const [isExpired, setIsExpired] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /*
  ========================================
  LOAD USER
  ========================================
  */
  const loadUser =
    async () => {

      try {

        setLoading(true);

        /*
        ========================================
        GET USER
        ========================================
        */
        const {
          data,
          error,
        } =
          await supabase.auth.getUser();

        /*
        ========================================
        NO USER
        ========================================
        */
        if (
          error ||
          !data?.user
        ) {

          setUserEmail("");

          setSubscription(
            null
          );

          setIsExpired(
            false
          );

          setLoading(
            false
          );

          return;
        }

        /*
        ========================================
        USER EMAIL
        ========================================
        */
        setUserEmail(
          data.user.email || ""
        );

        /*
        ========================================
        GET SUBSCRIPTION
        ========================================
        */
        const {
          data: subData,
          error: subError,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .select("*")
            .eq(
              "user_id",
              data.user.id
            )
            .maybeSingle();

        /*
        ========================================
        NO SUBSCRIPTION
        ========================================
        */
        if (
          subError ||
          !subData
        ) {

          setSubscription(
            null
          );

          setIsExpired(
            false
          );

          setLoading(
            false
          );

          return;
        }

        /*
        ========================================
        SET SUBSCRIPTION
        ========================================
        */
        setSubscription(
          subData
        );

        /*
        ========================================
        EXPIRED CHECK
        ========================================
        */
        const expired =
          subData?.expires_at
            ? new Date(
                subData.expires_at
              ).getTime() <
              Date.now()
            : false;

        setIsExpired(
          expired
        );

      } catch (err) {

        console.error(
          "LOAD USER ERROR:",
          err
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  /*
  ========================================
  AUTH LISTENER
  ========================================
  */
  useEffect(() => {

    loadUser();

    const {
      data:
        authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          /*
          ========================================
          SIGNED OUT
          ========================================
          */
          if (
            event ===
            "SIGNED_OUT"
          ) {

            setUserEmail("");

            setSubscription(
              null
            );

            setIsExpired(
              false
            );

            setSidebarOpen(
              false
            );

            /*
            ========================================
            REDIRECT
            ========================================
            */
            window.location.href =
              "/";

            return;
          }

          /*
          ========================================
          SIGNED IN
          ========================================
          */
          if (
            event ===
              "SIGNED_IN" &&
            session?.user
          ) {

            await loadUser();
          }

          /*
          ========================================
          TOKEN REFRESH
          ========================================
          */
          if (
            event ===
            "TOKEN_REFRESHED"
          ) {

            console.log(
              "Session refreshed"
            );
          }
        }
      );

    return () => {

      authListener
        ?.subscription
        ?.unsubscribe();
    };

  }, []);

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

        /*
        ========================================
        SIGN OUT
        ========================================
        */
        const {
          error,
        } =
          await supabase.auth.signOut({

            scope:
              "global",
          });

        if (error) {

          console.error(
            "Logout Error:",
            error.message
          );

          return;
        }

        /*
        ========================================
        CLEAR STATES
        ========================================
        */
        setUserEmail("");

        setSubscription(
          null
        );

        setIsExpired(
          false
        );

        /*
        ========================================
        REDIRECT
        ========================================
        */
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

      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

        <div className="flex flex-col items-center gap-4">

          <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>

          <p className="text-sm text-gray-400">

            Loading Workspace...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed top-[-200px] left-[-200px] w-[400px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full"></div>

      <div className="fixed bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full"></div>

      {/* MOBILE TOPBAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-[#081120]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="absolute inset-0 bg-purple-500/20 blur-[20px] rounded-2xl"></div>

            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white/5 border border-white/10">

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
          className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[280px]
          bg-[#0B1120]/95
          backdrop-blur-3xl
          border-r border-white/5
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
        <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full"></div>

        {/* LOGO */}
        <div className="relative z-10 px-6 pt-6 pb-5 border-b border-white/5">

          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-purple-500/20 blur-[20px] rounded-3xl"></div>

              <div className="relative w-14 h-14 rounded-3xl overflow-hidden border border-white/10 bg-white/5">

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

          <div className="mx-4 mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

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
                          h-[58px]
                          rounded-2xl
                          transition-all
                          border
                          ${
                            isActive
                              ? `
                                bg-gradient-to-r
                                from-[#7f5af0]
                                to-blue-500
                                border-purple-400/30
                                shadow-[0_10px_40px_rgba(127,90,240,0.35)]
                              `
                              : `
                                bg-white/[0.03]
                                border-white/5
                                hover:bg-white/[0.05]
                              `
                          }
                        `
                      }
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">

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
                          h-[58px]
                          rounded-2xl
                          transition-all
                          border
                          ${
                            isActive
                              ? `
                                bg-gradient-to-r
                                from-[#7f5af0]
                                to-blue-500
                                border-purple-400/30
                              `
                              : `
                                bg-white/[0.03]
                                border-white/5
                                hover:bg-white/[0.05]
                              `
                          }
                        `
                      }
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">

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
        <div className="relative z-10 p-4 border-t border-white/5">

          {/* USER */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-4 mb-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7f5af0] to-blue-500 flex items-center justify-center font-bold text-lg">

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
                    "trial"}{" "}
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
              h-[56px]
              rounded-2xl
              bg-red-500/10
              border
              border-red-500/10
              hover:bg-red-500/20
              transition-all
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
      <main className="flex-1 lg:ml-[280px] min-h-screen">

        <div className="p-4 lg:p-8 pt-20 lg:pt-8 relative z-10">

          <Outlet />

        </div>

      </main>

    </div>
  );
}