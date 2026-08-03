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
  Search,
  Bell,
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";

import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import { supabase } from "../lib/supabase";

import logo from "../assets/logo.png";

export default function MainLayout() {
  const { user, loading, subscription, isExpired } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userEmail = user?.email || "";

  const handleLogout = async () => {
    try {
      setSidebarOpen(false);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout Error:", error.message);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Logout Failed:", err);
    }
  };

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

  const navLinkClassName = ({ isActive }) =>
    `group flex h-[44px] items-center justify-between rounded-lg border px-2.5 transition-all duration-200 ${
      isActive
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50"
    }`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin"></div>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Loading workspace</p>
            <p className="mt-1 text-sm text-slate-500">Preparing your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:hidden">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <img src={logo} alt="AIAERA" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">AIAERA</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AI Business Automation</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-600"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col border-r border-slate-200 bg-white transition-all duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="border-b border-slate-200 px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white p-1">
              <img src={logo} alt="AIAERA" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">AIAERA</h1>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Sparkles size={9} className="text-violet-500" />
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  AI Business Automation
                </span>
              </div>
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Crown size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-700">Subscription Expired</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-red-600/80">
                  Features are temporarily paused until renewal.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2.5 py-3">
          <div className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Workspace
            </p>
            <div className="space-y-1.5">
              {workspaceLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={navLinkClassName}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                              isActive
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-violet-100 bg-violet-50 text-violet-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>

                        <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Settings
            </p>
            <div className="space-y-1.5">
              {settingsLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={navLinkClassName}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                              isActive
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-violet-100 bg-violet-50 text-violet-600"
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>

                        <ChevronRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-2.5">
          <div className="mb-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
                {userEmail?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">{userEmail || "User"}</h3>
                <p className="truncate text-xs text-slate-500">{subscription?.plan || "Free"} plan</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[220px]">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="hidden flex-1 md:flex">
              <label className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full border-0 bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-600">
                <Bell size={18} />
              </button>

              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-slate-700">{subscription?.plan || "Free"} plan</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-2 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
                  {userEmail?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="hidden pr-1 sm:block">
                  <p className="text-sm font-semibold text-slate-900">{userEmail || "User"}</p>
                  <p className="text-xs text-slate-500">Workspace access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8 lg:py-5 xl:px-10">
          <Outlet />

        </div>
      </main>
    </div>
  );
}