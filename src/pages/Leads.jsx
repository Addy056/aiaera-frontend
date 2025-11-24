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

export default function Leads() {
  const [userEmail, setUserEmail] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  const isExpired = (dateStr) =>
    !dateStr || new Date(dateStr).getTime() < Date.now();

  // -------------------------
  // INIT
  // -------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserEmail(user.email);

        // Free access override
        if (user.email === FREE_ACCESS_EMAIL) {
          setPlan("pro");
          await fetchLeads(user.id);
          return setLoading(false);
        }

        // Subscription check
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

        const effectivePlan =
          sub.plan === "free" ? "free" : expired ? "free" : "pro";

        setPlan(effectivePlan);

        if (effectivePlan === "pro") {
          await fetchLeads(user.id);
        }
      } catch (err) {
        console.error("❌ Leads init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------
  // FETCH LEADS (SAFE)
  // -------------------------
  const fetchLeads = async (userId) => {
    try {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setLeads([]);
    }
  };

  // -------------------------
  // FILTER (SAFE)
  // -------------------------
  const filteredLeads = useMemo(() => {
    if (plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL) return [];

    const q = search.toLowerCase();

    return leads.filter((l) => {
      return [l.name, l.email, l.message]
        .filter(Boolean)
        .some((f) => f.toString().toLowerCase().includes(q));
    });
  }, [search, leads, plan]);

  // -------------------------
  // TREND 7 DAYS (SAFE)
  // -------------------------
  const trend7 = useMemo(() => {
    if (plan !== "pro") return [];

    const now = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);

      const dailyCount = leads.filter((l) => {
        if (!l.created_at) return false;
        return (
          new Date(l.created_at).toDateString() === d.toDateString()
        );
      }).length;

      arr.push({
        label: d.toLocaleDateString("en-GB"),
        count: dailyCount,
      });
    }

    return arr;
  }, [leads, plan]);

  const last7 = plan === "pro"
    ? trend7.reduce((a, b) => a + (b.count || 0), 0)
    : null;

  // -------------------------
  // CSV EXPORT
  // -------------------------
  const exportCSV = () => {
    if (plan !== "pro") return alert("Upgrade to PRO to export leads.");
    if (!leads.length) return alert("No leads to export.");

    const headers = ["Name", "Email", "Message", "Date"];

    const rows = leads.map((l) => [
      l.name || "",
      l.email || "",
      `"${(l.message || "").replace(/"/g, '""')}"`,
      l.created_at
        ? new Date(l.created_at).toLocaleString()
        : "",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading Leads...
        </div>
      </ProtectedRoute>
    );
  }

  // -------------------------
  // MAIN UI
  // -------------------------
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#141131] to-[#081427] text-white relative overflow-hidden">

        <FloatingMenu userEmail={userEmail} />

        <div className="relative px-5 sm:px-10 pt-14 pb-20 ml-0 md:ml-28 max-w-7xl mx-auto">

          {/* HEADER */}
          <Header
            search={search}
            setSearch={setSearch}
            plan={plan}
            exportCSV={exportCSV}
          />

          {/* TABS */}
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* CONTENT */}
          <div className="min-h-[420px]">
            {activeTab === "dashboard" && (
              <DashboardView
                leads={filteredLeads}
                trend7={trend7}
                last7={last7}
                plan={plan}
              />
            )}

            {activeTab === "timeline" && (
              plan === "pro" || userEmail === FREE_ACCESS_EMAIL
                ? <TimelineView leads={filteredLeads} />
                : <LockedSection message="Timeline is available only on Pro plan." />
            )}

            {activeTab === "universe" && (
              plan === "pro" || userEmail === FREE_ACCESS_EMAIL
                ? <UniverseGridView leads={filteredLeads} />
                : <LockedSection message="Universe view is available only on Pro plan." />
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}

/* --------------------------------------------
   HEADER COMPONENT
-------------------------------------------- */
function Header({ search, setSearch, plan, exportCSV }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#8d77ff] bg-clip-text text-transparent">
          Leads Intelligence
        </h1>
        <p className="text-gray-400 mt-2">
          Your AI assistant collects leads here.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center bg-white/10 rounded-xl px-3">
          <Search className="w-5 h-5 text-[#bfa7ff] mr-2" />
          <input
            className="bg-transparent outline-none py-2 text-sm text-white"
            placeholder="Search..."
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
  );
}

/* --------------------------------------------
   TABS
-------------------------------------------- */
function Tabs({ activeTab, setActiveTab }) {
  const TabButton = ({ id, label, icon }) => {
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
  };

  return (
    <div className="flex overflow-x-auto pb-2 mb-6 space-x-3">
      <TabButton id="dashboard" label="Dashboard" icon={<Sparkles />} />
      <TabButton id="timeline" label="Timeline" icon={<MessageSquare />} />
      <TabButton id="universe" label="Universe" icon={<Users />} />
    </div>
  );
}

/* --------------------------------------------
   LOCKED SECTION
-------------------------------------------- */
function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl text-gray-400 shadow-xl">
      <Lock className="w-8 h-8 text-[#bfa7ff] mb-3" />
      <p className="text-center">{message}</p>
    </div>
  );
}

/* --------------------------------------------
   DASHBOARD VIEW
-------------------------------------------- */
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

      {/* Analytics */}
      {plan === "pro"
        ? <TrendSparkline trend7={trend7} />
        : <LockedSection message="Statistics are available only on Pro plan." />}
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
        <div className="text-2xl font-bold text-[#bfa7ff]">{locked ? "—" : value}</div>
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
    const max = Math.max(...trend7.map((t) => t.count || 0), 1);
    const stepX = (width - pad * 2) / (trend7.length - 1);

    return trend7.map((t, i) => {
      const x = pad + i * stepX;
      const y = height - pad - ((t.count || 0) / max) * (height - pad * 2);
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

/* --------------------------------------------
   TIMELINE VIEW
-------------------------------------------- */
function TimelineView({ leads }) {
  if (!leads.length)
    return <LockedSection message="No leads yet or this feature is Pro only." />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="relative pl-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

        <div className="space-y-6">
          {leads.map((l, i) => (
            <motion.div key={l.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }} className="relative">

              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]"></div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between">
                  <div className="font-semibold text-white">{l.name || "—"}</div>
                  <div className="text-xs text-gray-400">
                    {l.created_at
                      ? new Date(l.created_at).toLocaleString()
                      : "—"}
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

/* --------------------------------------------
   UNIVERSE
-------------------------------------------- */
function UniverseGridView({ leads }) {
  if (!leads.length)
    return <LockedSection message="No leads yet to visualize." />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.slice(0, 60).map((l, i) => (
        <motion.div
          key={l.id || i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.02, type: "spring", stiffness: 120 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-white/90 truncate">{l.name || "Lead"}</h3>
          <p className="text-[#00eaff] text-sm mt-1 truncate">{l.email || "—"}</p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-3">{l.message || "No message"}</p>

          <div className="text-xs text-gray-400 mt-3">
            {l.created_at
              ? new Date(l.created_at).toLocaleString()
              : "—"}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
