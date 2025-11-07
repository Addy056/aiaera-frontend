import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Search, Users, Calendar, MessageSquare, Sparkles, Lock } from "lucide-react";
import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

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

  // --------------------------------
  // Init: auth + subscription + leads
  // --------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) return;
        setUserEmail(user.email);

        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          setPlan("pro");
          await fetchLeads(user.id);
          return;
        }

        const { data: sub, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .single();

        if (subErr) throw subErr;

        const active = sub && !isExpired(sub.expires_at);
        setSubscriptionActive(active);
        setPlan(sub?.plan || "free");
        if (active) await fetchLeads(user.id);
      } catch (err) {
        console.error("❌ Leads init error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchLeads = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("id,name,email,message,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("❌ Leads fetch error:", err.message);
    }
  };

  // --------------------------------
  // Derived data
  // --------------------------------
  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.message].filter(Boolean).some((f) => f.toLowerCase().includes(q))
    );
  }, [leads, search]);

  const last7 = useMemo(() => {
    const now = new Date();
    return leads.filter((l) => (now - new Date(l.created_at)) / 86400000 <= 7);
  }, [leads]);

  const trend7 = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { label: d.toLocaleDateString("en-GB"), date: new Date(d.getFullYear(), d.getMonth(), d.getDate()), count: 0 };
    });
    for (const l of leads) {
      const d = new Date(l.created_at);
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const idx = buckets.findIndex((b) => b.date.getTime() === day);
      if (idx >= 0) buckets[idx].count += 1;
    }
    return buckets;
  }, [leads]);

  // --------------------------------
  // CSV export
  // --------------------------------
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

  // --------------------------------
  // UI States
  // --------------------------------
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
          <p>⏳ Loading your leads...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!subscriptionActive) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#0a0a16] text-white text-center px-6">
          <p className="text-lg">⚠️ Your subscription has expired. Please renew to access your leads.</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0e0b24] via-[#141131] to-[#081427] relative text-white overflow-hidden">
        <FloatingMenu userEmail={userEmail} />

        {/* Aurora glows */}
        <motion.div
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 16 }}
          className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[120px] bg-gradient-to-br from-[#bfa7ff]/25 via-[#7f5af0]/15 to-[#00eaff]/15"
        />
        <motion.div
          animate={{ opacity: [0.45, 0.75, 0.45], scale: [1.08, 1, 1.08] }}
          transition={{ repeat: Infinity, duration: 18 }}
          className="pointer-events-none absolute -bottom-40 -right-40 w-[620px] h-[620px] rounded-full blur-[140px] bg-gradient-to-tr from-[#7f5af0]/25 via-[#00eaff]/15 to-[#bfa7ff]/10"
        />

        <div className="relative px-5 sm:px-10 pt-12 pb-20 ml-0 md:ml-28 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#9b8cff] bg-clip-text text-transparent">
                Leads Intelligence
              </h1>
              <p className="text-gray-400 mt-1">Analyze, visualize and export your chatbot leads.</p>
            </div>

            <div className="flex items-center gap-2">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] text-white font-semibold shadow-lg hover:shadow-[0_0_24px_rgba(155,140,255,0.35)] transition-all"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex w-full overflow-x-auto pb-2 mb-6">
            <Tab active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<Sparkles className="w-4 h-4" />} label="Dashboard" />
            <Tab active={activeTab === "timeline"} onClick={() => setActiveTab("timeline")} icon={<MessageSquare className="w-4 h-4" />} label="Timeline" />
            <Tab active={activeTab === "universe"} onClick={() => setActiveTab("universe")} icon={<Users className="w-4 h-4" />} label="Universe" />
          </div>

          {/* Views */}
          <div className="min-h-[420px]">
            {activeTab === "dashboard" && (
              <DashboardView leads={filteredLeads} trend7={trend7} last7={last7.length} />
            )}
            {activeTab === "timeline" && <TimelineView leads={filteredLeads} />}
            {activeTab === "universe" &&
              (plan === "pro" || userEmail === FREE_ACCESS_EMAIL ? (
                <UniverseView leads={filteredLeads} />
              ) : (
                <LockedSection message="🔒 Universe visualization is available only in the Pro plan." />
              ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------------- Tabs ---------------- */
function Tab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`mr-2 px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
        active
          ? "border-[#bfa7ff]/40 bg-white/10 shadow-lg"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <span className={`${active ? "text-[#bfa7ff]" : "text-white/80"}`}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

/* ---------- Locked Pro Section ---------- */
function LockedSection({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
      <Lock className="w-8 h-8 mb-3 text-[#bfa7ff]" />
      <p>{message}</p>
    </div>
  );
}

/* --------------- Dashboard View --------------- */
function DashboardView({ leads, trend7, last7 }) {
  const total = leads.length;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPI icon={<Users className="w-5 h-5 text-[#bfa7ff]" />} title="Total Leads" value={total} />
        <KPI icon={<Calendar className="w-5 h-5 text-[#bfa7ff]" />} title="Last 7 Days" value={last7} />
        <KPI icon={<Sparkles className="w-5 h-5 text-[#bfa7ff]" />} title="Avg / Day (7d)" value={(trend7.reduce((a, b) => a + b.count, 0) / 7).toFixed(1)} />
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white/90">Weekly Trend</h3>
          <p className="text-xs text-gray-400">Last 7 days</p>
        </div>
        <Sparkline data={trend7.map((t) => t.count)} />
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          {trend7.map((t, i) => (
            <span key={i}>{t.label.split("/").slice(0, 2).join("/")}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function KPI({ icon, title, value }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="text-gray-300 flex items-center gap-2">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <div className="text-2xl font-bold text-[#bfa7ff]">{value}</div>
      </div>
    </motion.div>
  );
}

function Sparkline({ data = [] }) {
  const width = 800;
  const height = 120;
  const pad = 8;
  const points = useMemo(() => {
    const n = Math.max(data.length, 2);
    const max = Math.max(...data, 1);
    const stepX = (width - pad * 2) / (n - 1);
    return data.map((v, i) => {
      const x = pad + i * stepX;
      const y = height - pad - (v / max) * (height - pad * 2);
      return [x, y];
    });
  }, [data]);
  const d = useMemo(() => (points.length < 2 ? "" : "M " + points.map((p) => p.join(",")).join(" L ")), [points]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[140px]">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9b8cff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bfa7ff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1="0" x2={width} y1={height * p} y2={height * p} stroke="rgba(255,255,255,0.08)" />
      ))}
      <motion.path d={d} fill="none" stroke="url(#spark)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#bfa7ff" />
      ))}
    </svg>
  );
}

/* --------------- Timeline --------------- */
function TimelineView({ leads }) {
  if (!leads.length) return <EmptyState text="No leads yet. Your new leads will appear here in a timeline view." />;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <div className="relative pl-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-6">
          {leads.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }} className="relative">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]" />
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white/90">{l.name || "—"}</div>
                  <div className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</div>
                </div>
                <div className="text-[#00eaff] text-sm">{l.email || "—"}</div>
                <p className="text-sm text-gray-300 mt-1 line-clamp-3">{l.message || "—"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* --------------- Universe View --------------- */
function UniverseView({ leads }) {
  if (!leads.length) return <EmptyState text="No leads to visualize yet." />;
  const bubbles = leads.slice(0, 60);
  const pos = (id, i, maxW, maxH) => {
    const seed = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) + i * 17;
    const rx = (Math.sin(seed) + 1) / 2;
    const ry = (Math.cos(seed) + 1) / 2;
    const x = 60 + rx * (maxW - 120);
    const y = 60 + ry * (maxH - 160);
    const size = 18 + (seed % 22);
    return { x, y, size };
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-4 shadow-xl">
      <div className="relative h-[520px] overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-transparent">
        <div className="absolute inset-0">
          {bubbles.map((b, i) => {
            const { x, y, size } = pos(b.id, i, 1200, 520);
            return (
              <motion.div key={b.id} initial={{ x, y, opacity: 0 }} animate={{ x: [x, x + (i % 2 ? 8 : -8), x], y: [y, y + (i % 3 ? -6 : 6), y], opacity: 1 }} transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut" }} className="absolute" title={`${b.name || "—"} • ${b.email || ""}`}>
                <div className="rounded-full shadow-[0_0_30px_rgba(155,140,255,0.25)]" style={{ width: size, height: size, background: "radial-gradient( circle at 30% 30%, rgba(191,167,255,0.9), rgba(127,90,240,0.5) )", border: "1px solid rgba(255,255,255,0.15)" }} />
              </motion.div>
            );
          })}
        </div>
        <div className="absolute bottom-3 left-3 text-xs text-gray-400">Floating bubbles sized & positioned by a deterministic pattern</div>
      </div>
    </motion.div>
  );
}

/* --------------- Shared --------------- */
function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-gray-400 shadow-xl">
      {text}
    </div>
  );
}
