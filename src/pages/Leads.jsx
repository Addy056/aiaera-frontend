// src/pages/Leads.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import {
  Search,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Lock,
} from "lucide-react";

import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

// -----------------------------------------------
// MAIN PAGE
// -----------------------------------------------
export default function Leads() {
  const [userEmail, setUserEmail] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [plan, setPlan] = useState("free");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
  const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

  // -----------------------------
  // INIT: Auth + Subscription + Leads
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserEmail(user.email);

        // Free access override
        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          setPlan("pro");
          await fetchLeads(user.id);
          return;
        }

        // Sub check
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .single();

        const active = sub && !isExpired(sub.expires_at);
        setSubscriptionActive(active);
        setPlan(sub?.plan || "free");

        if (active) await fetchLeads(user.id);
      } catch (err) {
        console.error("❌ Leads init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // -----------------------------
  // Fetch Leads
  // -----------------------------
  const fetchLeads = async (userId) => {
    try {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setLeads(data || []);
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
    }
  };

  // -----------------------------
  // Filtered Leads (search)
  // -----------------------------
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) =>
      [l.name, l.email, l.message]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [search, leads]);

  // -----------------------------
  // Stats
  // -----------------------------
  const trend7 = useMemo(() => {
    const now = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const count = leads.filter(
        (l) =>
          new Date(l.created_at).toDateString() === d.toDateString()
      ).length;

      arr.push({ label: d.toLocaleDateString("en-GB"), count });
    }

    return arr;
  }, [leads]);

  const last7 = trend7.reduce((a, b) => a + b.count, 0);

  // -----------------------------
  // CSV Export
  // -----------------------------
  const exportCSV = () => {
    if (!leads.length) return alert("No leads to export.");

    const headers = ["Name", "Email", "Message", "Date"];
    const rows = leads.map((l) => [
      l.name || "",
      l.email || "",
      `"${(l.message || "").replace(/"/g, '""')}"`,
      new Date(l.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  // -----------------------------
  // LOADING / BLOCKED
  // -----------------------------
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
          Loading your leads...
        </div>
      </ProtectedRoute>
    );
  }

  if (!subscriptionActive) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#0d0d18] text-white px-6 text-center">
          <p className="text-xl">⚠️ Your subscription has expired.</p>
          <p className="text-gray-400 mt-2">Renew to access your Leads page.</p>
          <a
            href="/pricing"
            className="mt-6 px-6 py-3 rounded-xl bg-[#7f5af0] text-white font-semibold"
          >
            Renew Now
          </a>
        </div>
      </ProtectedRoute>
    );
  }

  // -----------------------------
  // MAIN VIEW
  // -----------------------------
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#141131] to-[#081427] text-white relative overflow-hidden">
        <FloatingMenu userEmail={userEmail} />

        {/* Background glows */}
        <motion.div
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 16 }}
          className="pointer-events-none absolute -top-48 -left-48 w-[520px] h-[520px] rounded-full blur-[120px] bg-gradient-to-br from-[#bfa7ff]/25 via-[#7f5af0]/15 to-[#00eaff]/15"
        />

        <div className="relative px-5 sm:px-10 pt-14 pb-20 ml-0 md:ml-28 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#8d77ff] bg-clip-text text-transparent">
                Leads Intelligence
              </h1>
              <p className="text-gray-400 mt-2">
                Explore, analyze & export leads from your chatbot.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/10 rounded-xl px-3">
                <Search className="w-5 h-5 text-[#bfa7ff] mr-2" />
                <input
                  className="bg-transparent outline-none py-2 text-sm text-white placeholder-gray-400"
                  placeholder="Search name, email or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {leads.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] text-white font-semibold shadow-lg hover:shadow-purple-500/30"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="flex overflow-x-auto pb-2 mb-6 space-x-3">
            <Tab id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Sparkles className="w-4 h-4" />} label="Dashboard" />
            <Tab id="timeline" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MessageSquare className="w-4 h-4" />} label="Timeline" />
            <Tab id="universe" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Users className="w-4 h-4" />} label="Universe" />
          </div>

          {/* TAB CONTENT */}
          <div className="min-h-[420px]">
            {activeTab === "dashboard" && (
              <DashboardView leads={filteredLeads} trend7={trend7} last7={last7} />
            )}

            {activeTab === "timeline" && (
              <TimelineView leads={filteredLeads} />
            )}

            {activeTab === "universe" && (
              plan === "pro" || userEmail === FREE_ACCESS_EMAIL ? (
                <UniverseGridView leads={filteredLeads} />
              ) : (
                <LockedSection message="🔒 Universe grid view available only on Pro plan." />
              )
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// -----------------------------------------------
// TAB Component
// -----------------------------------------------
function Tab({ id, activeTab, setActiveTab, icon, label }) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
        active
          ? "border-[#bfa7ff]/40 bg-white/10 shadow-lg"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <span className={active ? "text-[#bfa7ff]" : "text-white/80"}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

// -----------------------------------------------
// LOCKED SECTION
// -----------------------------------------------
function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] text-gray-400 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-xl">
      <Lock className="w-8 h-8 text-[#bfa7ff] mb-3" />
      <p>{message}</p>
    </div>
  );
}

// -----------------------------------------------
// DASHBOARD VIEW (KPIs + Chart)
// -----------------------------------------------
function DashboardView({ leads, trend7, last7 }) {
  const total = leads.length;
  const avg = (last7 / 7).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPI
          title="Total Leads"
          value={total}
          icon={<Users className="w-5 h-5 text-[#bfa7ff]" />}
        />
        <KPI
          title="Last 7 Days"
          value={last7}
          icon={<Calendar className="w-5 h-5 text-[#bfa7ff]" />}
        />
        <KPI
          title="Avg / Day"
          value={avg}
          icon={<Sparkles className="w-5 h-5 text-[#bfa7ff]" />}
        />
      </div>

      {/* SPARKLINE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <h3 className="font-semibold text-white/90 mb-3">Weekly Trend</h3>
        <Sparkline data={trend7.map((t) => t.count)} />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {trend7.map((t) => (
            <span key={t.label}>{t.label.split("/").slice(0, 2).join("/")}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function KPI({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          {icon}
          {title}
        </div>
        <div className="text-2xl font-bold text-[#bfa7ff]">{value}</div>
      </div>
    </motion.div>
  );
}

function Sparkline({ data }) {
  const width = 800;
  const height = 120;
  const pad = 8;

  const points = useMemo(() => {
    if (data.length < 2) return [];
    const max = Math.max(...data, 1);
    const stepX = (width - pad * 2) / (data.length - 1);

    return data.map((val, i) => {
      const x = pad + i * stepX;
      const y = height - pad - (val / max) * (height - pad * 2);
      return [x, y];
    });
  }, [data]);

  const path = points.length
    ? "M " + points.map((p) => p.join(",")).join(" L ")
    : "";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px]">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9b8cff" />
          <stop offset="100%" stopColor="#bfa7ff" />
        </linearGradient>
      </defs>

      {path && (
        <motion.path
          d={path}
          fill="none"
          stroke="url(#spark)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}

      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#bfa7ff" />
      ))}
    </svg>
  );
}

// -----------------------------------------------
// TIMELINE VIEW
// -----------------------------------------------
function TimelineView({ leads }) {
  if (!leads.length)
    return <EmptyState text="No leads yet. They will appear in real-time here." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
    >
      <div className="relative pl-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

        <div className="space-y-6">
          {leads.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="relative"
            >
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"></div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between">
                  <div className="font-semibold text-white">{l.name || "—"}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(l.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="text-[#00eaff] text-sm">{l.email || "—"}</div>
                <p className="text-sm text-gray-300 mt-1 line-clamp-3">
                  {l.message || "—"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------
// UNIVERSE VIEW — Option C (Animated Grid)
// -----------------------------------------------
function UniverseGridView({ leads }) {
  if (!leads.length)
    return <EmptyState text="No leads yet to visualize in the Universe grid." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {leads.slice(0, 60).map((l, i) => (
        <motion.div
          key={l.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            type: "spring",
            stiffness: 120,
          }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl hover:shadow-purple-400/20 transition-all"
        >
          <h3 className="text-lg font-semibold text-white/90 truncate">
            {l.name || "Unknown Lead"}
          </h3>

          <p className="text-[#00eaff] text-sm mt-1 truncate">{l.email}</p>

          <p className="text-gray-300 text-sm mt-2 line-clamp-3">
            {l.message || "No message"}
          </p>

          <div className="text-xs text-gray-400 mt-3">
            {new Date(l.created_at).toLocaleString()}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// -----------------------------------------------
// EMPTY STATE
// -----------------------------------------------
function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-gray-300">
      {text}
    </div>
  );
}
