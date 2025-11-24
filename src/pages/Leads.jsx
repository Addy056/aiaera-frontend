// src/pages/Leads.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

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

const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";

// -----------------------------------------------------
// PAGE
// -----------------------------------------------------
export default function Leads() {
  const [userEmail, setUserEmail] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

  // -----------------------------------------------------
  // INIT (AUTH + SUBSCRIPTION + LEADS)
  // -----------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserEmail(user.email);

        // Free ACCESS override (PRO)
        if (user.email === FREE_ACCESS_EMAIL) {
          setPlan("pro");
          await fetchLeads(user.id);
          return setLoading(false);
        }

        // Check subscription
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!sub) {
          setPlan("free");
          return setLoading(false);
        }

        const expired = isExpired(sub.expires_at);
        const activePlan = sub.plan === "free" ? "free" : expired ? "free" : sub.plan;

        setPlan(activePlan);

        // Only load data for PRO
        if (activePlan === "pro") {
          await fetchLeads(user.id);
        }

      } catch (err) {
        console.error("❌ Leads init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -----------------------------------------------------
  // FETCH LEADS
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // FILTER
  // -----------------------------------------------------
  const filteredLeads = useMemo(() => {
    if (plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL) return [];
    const q = search.toLowerCase();
    return leads.filter((l) =>
      [l.name, l.email, l.message]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q))
    );
  }, [search, leads, plan]);

  // -----------------------------------------------------
  // STATS
  // -----------------------------------------------------
  const trend7 = useMemo(() => {
    if (plan !== "pro") return [];
    const now = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const c = leads.filter(
        (l) => new Date(l.created_at).toDateString() === d.toDateString()
      ).length;

      arr.push({ label: d.toLocaleDateString("en-GB"), count: c });
    }

    return arr;
  }, [leads, plan]);

  const last7 = plan === "pro" ? trend7.reduce((a, b) => a + b.count, 0) : null;

  // -----------------------------------------------------
  // CSV EXPORT
  // -----------------------------------------------------
  const exportCSV = () => {
    if (plan !== "pro") return alert("Upgrade to PRO to export leads.");
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

  // -----------------------------------------------------
  // LOADING
  // -----------------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading Leads...
        </div>
      </ProtectedRoute>
    );
  }

  // -----------------------------------------------------
  // MAIN UI (always visible)
  // -----------------------------------------------------
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#141131] to-[#081427] text-white relative overflow-hidden">
        
        <FloatingMenu userEmail={userEmail} />

        {/* Header */}
        <div className="relative px-5 sm:px-10 pt-14 pb-20 ml-0 md:ml-28 max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#8d77ff] bg-clip-text text-transparent">
                Leads Intelligence
              </h1>
              <p className="text-gray-400 mt-2">
                Your AI assistant brings leads here in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex items-center bg-white/10 rounded-xl px-3">
                <Search className="w-5 h-5 text-[#bfa7ff] mr-2" />
                <input
                  className="bg-transparent outline-none py-2 text-sm text-white"
                  placeholder="Search name, email or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={plan !== "pro"}
                />
              </div>

              <button
                onClick={exportCSV}
                disabled={plan !== "pro"}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg 
                  ${plan === "pro"
                    ? "bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                  }`}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 mb-6 space-x-3">
            <Tab id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Sparkles />} label="Dashboard" />
            <Tab id="timeline" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MessageSquare />} label="Timeline" />
            <Tab id="universe" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Users />} label="Universe" />
          </div>

          {/* Content */}
          <div className="min-h-[420px]">

            {activeTab === "dashboard" &&
              <DashboardView
                leads={filteredLeads}
                trend7={trend7}
                last7={last7}
                plan={plan}
                userEmail={userEmail}
              />
            }

            {activeTab === "timeline" &&
              (plan === "pro" || userEmail === FREE_ACCESS_EMAIL
                ? <TimelineView leads={filteredLeads} />
                : <LockedSection message="Timeline is available only on Pro plan." />
              )
            }

            {activeTab === "universe" &&
              (plan === "pro" || userEmail === FREE_ACCESS_EMAIL
                ? <UniverseGridView leads={filteredLeads} />
                : <LockedSection message="Universe view is available only on Pro plan." />
              )
            }

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}

// -----------------------------------------------------
// COMPONENTS
// -----------------------------------------------------
function Tab({ id, activeTab, setActiveTab, icon, label }) {
  const active = id === activeTab;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border 
        ${active
          ? "border-[#bfa7ff]/40 bg-white/10 shadow-lg"
          : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
    >
      <span className={active ? "text-[#bfa7ff]" : "text-white"}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl text-gray-400 shadow-xl">
      <Lock className="w-8 h-8 text-[#bfa7ff] mb-3" />
      <p className="text-center">{message}</p>
    </div>
  );
}

// -----------------------------------------------------
// DASHBOARD VIEW (SOFT LOCKED FOR FREE USERS)
// -----------------------------------------------------
function DashboardView({ leads, trend7, last7, plan }) {
  const total = plan === "pro" ? leads.length : "—";
  const last7Val = plan === "pro" ? last7 : "—";
  const avg = plan === "pro" ? (last7 / 7).toFixed(1) : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <KPI title="Total Leads" value={total} icon={<Users />} locked={plan !== "pro"} />
        <KPI title="Last 7 Days" value={last7Val} icon={<Calendar />} locked={plan !== "pro"} />
        <KPI title="Avg / Day" value={avg} icon={<Sparkles />} locked={plan !== "pro"} />
      </div>

      {/* Trend chart */}
      {plan === "pro" ? (
        <TrendSparkline trend7={trend7} />
      ) : (
        <LockedSection message="Statistics are available only on Pro plan." />
      )}
    </motion.div>
  );
}

function KPI({ title, value, icon, locked }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          {icon}
          {title}
        </div>
        <div className="text-2xl font-bold text-[#bfa7ff]">
          {locked ? "—" : value}
        </div>
      </div>
    </motion.div>
  );
}

function TrendSparkline({ trend7 }) {
  const width = 800;
  const height = 120;
  const pad = 8;

  const points = useMemo(() => {
    if (trend7.length < 2) return [];
    const max = Math.max(...trend7.map((t) => t.count), 1);
    const stepX = (width - pad * 2) / (trend7.length - 1);

    return trend7.map((t, i) => {
      const x = pad + i * stepX;
      const y = height - pad - (t.count / max) * (height - pad * 2);
      return [x, y];
    });
  }, [trend7]);

  const path = points.length
    ? "M " + points.map((p) => p.join(",")).join(" L ")
    : "";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px] mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
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

// -----------------------------------------------------
// TIMELINE
// -----------------------------------------------------
function TimelineView({ leads }) {
  if (!leads.length) {
    return <LockedSection message="No leads yet or this feature is Pro only." />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="relative pl-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

        <div className="space-y-6">
          {leads.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }} className="relative">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"></div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between">
                  <div className="font-semibold text-white">{l.name || "—"}</div>
                  <div className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</div>
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

// -----------------------------------------------------
// UNIVERSE VIEW
// -----------------------------------------------------
function UniverseGridView({ leads }) {
  if (!leads.length)
    return <LockedSection message="No leads yet to visualize." />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.slice(0, 60).map((l, i) => (
        <motion.div
          key={l.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.02, type: "spring", stiffness: 120 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-white/90 truncate">{l.name || "Lead"}</h3>
          <p className="text-[#00eaff] text-sm mt-1 truncate">{l.email}</p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-3">{l.message || "No message"}</p>

          <div className="text-xs text-gray-400 mt-3">{new Date(l.created_at).toLocaleString()}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-gray-300">
      {text}
    </div>
  );
}
