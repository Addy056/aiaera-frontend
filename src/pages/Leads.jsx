// src/pages/Leads.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Search, Users, Calendar, MessageSquare, Sparkles, Lock } from "lucide-react";

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

  const isExpired = (d) => !d || new Date(d) < new Date();

  // INITIAL LOAD
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserEmail(user.email);

        // Free access = PRO
        if (user.email === FREE_ACCESS_EMAIL) {
          setPlan("pro");
          await fetchLeads(user.id);
          return setLoading(false);
        }

        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!sub) {
          setPlan("free");
          return setLoading(false);
        }

        const activePlan =
          sub.plan === "free" ? "free" : isExpired(sub.expires_at) ? "free" : sub.plan;

        setPlan(activePlan);

        if (activePlan === "pro") {
          await fetchLeads(user.id);
        }
      } catch (err) {
        console.error("❌ Init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchLeads = async (uid) => {
    try {
      const { data } = await supabase
        .from("leads")
        .select("id, name, email, message, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      setLeads(data || []);
    } catch (err) {
      console.error("❌ Fetch leads error:", err);
      setLeads([]); // fallback prevents crash
    }
  };

  // SAFE FILTER (CRASH PROOF)
  const filteredLeads = useMemo(() => {
    if (plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL) return [];

    const q = search.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter((l) => {
      const name = String(l?.name || "").toLowerCase();
      const email = String(l?.email || "").toLowerCase();
      const msg = String(l?.message || "").toLowerCase();
      return name.includes(q) || email.includes(q) || msg.includes(q);
    });
  }, [search, leads, plan]);

  // STATS (SAFE)
  const trend7 = useMemo(() => {
    if (plan !== "pro") return [];

    const now = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const count = leads.filter(
        (l) => new Date(l.created_at).toDateString() === d.toDateString()
      ).length;

      arr.push({ label: d.toLocaleDateString("en-GB"), count });
    }

    return arr;
  }, [leads, plan]);

  const last7 = trend7?.reduce((a, b) => a + b.count, 0) || 0;

  // CSV
  const exportCSV = () => {
    if (plan !== "pro") return alert("Upgrade to PRO to export leads.");
    if (!leads.length) return alert("No leads to export.");

    const headers = ["Name", "Email", "Message", "Date"];
    const rows = leads.map((l) => [
      l.name || "",
      l.email || "",
      `"${String(l.message || "").replace(/"/g, '""')}"`,
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading Leads...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#141131] to-[#081427] text-white relative">

        <FloatingMenu userEmail={userEmail} />

        <div className="px-5 sm:px-10 pt-14 pb-20 ml-0 md:ml-28 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#8d77ff] bg-clip-text text-transparent">
                Leads Intelligence
              </h1>
              <p className="text-gray-400 mt-2">
                Your AI assistant collects leads in real-time.
              </p>
            </div>

            {/* SEARCH + EXPORT */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/10 rounded-xl px-3">
                <Search className="w-5 h-5 text-[#bfa7ff] mr-2" />
                <input
                  className="bg-transparent outline-none py-2 text-sm text-white"
                  placeholder="Search lead..."
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

          {/* TABS */}
          <div className="flex overflow-x-auto pb-2 mb-6 space-x-3">
            <Tab id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Sparkles />} label="Dashboard" />
            <Tab id="timeline" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MessageSquare />} label="Timeline" />
            <Tab id="universe" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Users />} label="Universe" />
          </div>

          {/* CONTENT */}
          <div className="min-h-[420px]">

            {activeTab === "dashboard" &&
              <DashboardView
                leads={filteredLeads}
                trend7={trend7}
                last7={last7}
                plan={plan}
              />
            }

            {activeTab === "timeline" &&
              (plan === "pro"
                ? <TimelineView leads={filteredLeads} />
                : <Locked text="Timeline is Pro only." />)
            }

            {activeTab === "universe" &&
              (plan === "pro"
                ? <UniverseGridView leads={filteredLeads} />
                : <Locked text="Universe view is Pro only." />)
            }

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* TAB */
function Tab({ id, activeTab, setActiveTab, icon, label }) {
  const active = id === activeTab;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border 
        ${active ? "border-[#bfa7ff]/40 bg-white/10 shadow-lg" : "border-white/10 bg-white/5"}`}
    >
      <span className={active ? "text-[#bfa7ff]" : "text-white"}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

/* LOCKED BOX */
function Locked({ text }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] bg-white/5 border border-white/10 rounded-2xl text-gray-400">
      <Lock className="w-8 h-8 text-[#bfa7ff] mb-3" />
      <p>{text}</p>
    </div>
  );
}

/* DASHBOARD VIEW */
function DashboardView({ leads, trend7, last7, plan }) {
  const total = plan === "pro" ? leads.length : "—";
  const last = plan === "pro" ? last7 : "—";
  const avg = plan === "pro" ? (last7 / 7).toFixed(1) : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <KPI title="Total Leads" value={total} icon={<Users />} locked={plan !== "pro"} />
        <KPI title="Past 7 Days" value={last} icon={<Calendar />} locked={plan !== "pro"} />
        <KPI title="Avg / Day" value={avg} icon={<Sparkles />} locked={plan !== "pro"} />
      </div>

      {plan === "pro"
        ? <Sparkline trend7={trend7} />
        : <Locked text="Statistics available only on Pro." />}
    </motion.div>
  );
}

/* KPI CARD */
function KPI({ title, value, icon, locked }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">{icon}{title}</div>
        <div className="text-2xl font-bold text-[#bfa7ff]">{locked ? "—" : value}</div>
      </div>
    </motion.div>
  );
}

/* SPARKLINE */
function Sparkline({ trend7 }) {
  const width = 800, height = 120, pad = 8;

  const points = trend7.length
    ? trend7.map((t, i) => {
        const max = Math.max(...trend7.map((x) => x.count));
        const stepX = (width - pad * 2) / (trend7.length - 1);
        const x = pad + i * stepX;
        const y = height - pad - (t.count / max) * (height - pad * 2);
        return [x, y];
      })
    : [];

  const path =
    points.length > 1
      ? "M " + points.map((p) => p.join(",")).join(" L ")
      : "";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px] bg-white/5 rounded-2xl p-4 mt-4 border border-white/10">
      {path && <motion.path d={path} fill="none" stroke="#bfa7ff" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
      {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#bfa7ff" />)}
    </svg>
  );
}

/* TIMELINE */
function TimelineView({ leads }) {
  if (!leads?.length) return <Locked text="No leads yet." />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-white/10 bg-white/5 p-6 rounded-2xl">
      {leads.map((l, i) => (
        <div key={l.id} className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="font-semibold text-white">{l.name}</div>
          <div className="text-[#00eaff] text-sm">{l.email}</div>
          <p className="text-gray-300 text-sm mt-1">{l.message}</p>
          <div className="text-xs text-gray-400 mt-2">{new Date(l.created_at).toLocaleString()}</div>
        </div>
      ))}
    </motion.div>
  );
}

/* UNIVERSE GRID */
function UniverseGridView({ leads }) {
  if (!leads?.length) return <Locked text="No leads yet." />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((l) => (
        <div key={l.id} className="border border-white/10 bg-white/5 p-5 rounded-xl">
          <h3 className="text-lg font-semibold">{l.name}</h3>
          <p className="text-[#00eaff] text-sm">{l.email}</p>
          <p className="text-gray-300 text-sm mt-2">{l.message}</p>
        </div>
      ))}
    </motion.div>
  );
}
