// src/pages/Appointments.jsx

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  Lock,
  MessageSquare,
} from "lucide-react";

import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";

export default function Appointments() {
  const [userEmail, setUserEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");

  const [activeTab, setActiveTab] = useState("dashboard");

  const isExpired = (dateStr) =>
    !dateStr || new Date(dateStr) < new Date();

  // ---------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserEmail(user.email);

        // DEV OVERRIDE (always PRO)
        if (user.email === FREE_ACCESS_EMAIL) {
          setPlan("pro");
          await fetchAppointments(user.id);
          await fetchLeads(user.id);
          setLoading(false);
          return;
        }

        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!sub) {
          setPlan("free");
          setLoading(false);
          return;
        }

        const activePlan =
          sub.plan === "free"
            ? "free"
            : isExpired(sub.expires_at)
            ? "free"
            : sub.plan;

        setPlan(activePlan);

        if (activePlan === "pro") {
          await fetchAppointments(user.id);
          await fetchLeads(user.id);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ---------------------------------------------
  // FETCH APPOINTMENTS
  // ---------------------------------------------
  const fetchAppointments = async (userId) => {
    const { data } = await supabase
      .from("appointments")
      .select(
        "id, customer_name, customer_email, calendly_event_link, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setAppointments(data || []);
  };

  // ---------------------------------------------
  // FETCH LEADS (for conversion metric)
  // ---------------------------------------------
  const fetchLeads = async (userId) => {
    const { data } = await supabase
      .from("leads")
      .select("email, created_at")
      .eq("user_id", userId);

    setLeads(data || []);
  };

  // ---------------------------------------------
  // EXPORT CSV (PRO ONLY)
  // ---------------------------------------------
  const exportCSV = () => {
    if (plan !== "pro") return alert("Upgrade to PRO to export.");
    if (!appointments.length) return alert("No appointments to export.");

    const rows = [
      ["Name", "Email", "Calendly Link", "Date"],
      ...appointments.map((a) => [
        a.customer_name,
        a.customer_email,
        a.calendly_event_link,
        new Date(a.created_at).toLocaleString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
  };

  // ---------------------------------------------
  // SPARKLINE DATA — LAST 7 DAYS
  // ---------------------------------------------
  const trend7 = useMemo(() => {
    if (plan !== "pro") return [];

    const now = new Date();
    const arr = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const count = appointments.filter(
        (a) =>
          new Date(a.created_at).toDateString() === d.toDateString()
      ).length;

      arr.push({
        label: d.toLocaleDateString("en-GB"),
        count,
      });
    }

    return arr;
  }, [appointments, plan]);

  const last7 = trend7.reduce((a, b) => a + b.count, 0);

  // ---------------------------------------------
  // BUSINESS KPIs (Option C)
  // ---------------------------------------------
  const total = plan === "pro" ? appointments.length : "—";

  const conversionRate = useMemo(() => {
    if (plan !== "pro") return "—";

    const matched = appointments.filter((appt) =>
      leads.some((l) => l.email === appt.customer_email)
    );

    if (!leads.length) return "—";

    return ((matched.length / leads.length) * 100).toFixed(1) + "%";
  }, [appointments, leads, plan]);

  const avgTime = useMemo(() => {
    if (plan !== "pro") return "—";

    let totalHours = 0;
    let count = 0;

    appointments.forEach((appt) => {
      const lead = leads.find((l) => l.email === appt.customer_email);
      if (!lead) return;

      const diff =
        (new Date(appt.created_at) - new Date(lead.created_at)) /
        3600000; // hours

      if (diff > 0) {
        totalHours += diff;
        count++;
      }
    });

    if (count === 0) return "—";

    return (totalHours / count).toFixed(1) + " hrs";
  }, [appointments, leads, plan]);

  // ---------------------------------------------
  // LOADING UI
  // ---------------------------------------------
  if (loading)
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading Appointments...
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#141131] to-[#081427] text-white relative">

        <FloatingMenu />

        {/* HEADER */}
        <div className="px-5 sm:px-10 pt-14 pb-10 ml-0 md:ml-28">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#bfa7ff] to-[#8d77ff] bg-clip-text text-transparent">
            Appointments Intelligence
          </h1>
          <p className="text-gray-400 mt-2">
            View your AI-driven customer bookings.
          </p>
        </div>

        {/* TABS */}
        <div className="flex ml-0 md:ml-28 px-5 sm:px-10 space-x-4 mb-6">
          <Tab id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Sparkles />} label="Dashboard" />
          <Tab id="timeline" activeTab={activeTab} setActiveTab={setActiveTab} icon={<MessageSquare />} label="Timeline" />
          <Tab id="universe" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Users />} label="Universe" />
        </div>

        {/* CONTENT AREA */}
        <div className="px-5 sm:px-10 ml-0 md:ml-28 pb-20">

          {activeTab === "dashboard" &&
            <DashboardView
              total={total}
              conversionRate={conversionRate}
              avgTime={avgTime}
              trend7={trend7}
              plan={plan}
            />
          }

          {activeTab === "timeline" &&
            (plan === "pro"
              ? <TimelineView appointments={appointments} />
              : <Locked text="Timeline is Pro only." />)
          }

          {activeTab === "universe" &&
            (plan === "pro"
              ? <UniverseGridView appointments={appointments} />
              : <Locked text="Universe is Pro only." />)
          }

          {/* Export button */}
          <div className="mt-10">
            <button
              onClick={exportCSV}
              className="bg-[#7f5af0] px-5 py-3 rounded-xl hover:bg-[#9b7ff7] transition-all shadow-lg"
            >
              Export CSV (Pro Only)
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------------------------------------------------- */
/* TAB COMPONENT */
/* ---------------------------------------------------- */
function Tab({ id, activeTab, setActiveTab, icon, label }) {
  const active = id === activeTab;

  return (
    <motion.button
      onClick={() => setActiveTab(id)}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl border 
      ${active
        ? "border-[#bfa7ff]/50 bg-white/10 shadow-lg text-[#bfa7ff]"
        : "border-white/10 bg-white/5 text-gray-300"}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}

/* ---------------------------------------------------- */
/* LOCKED BOX */
/* ---------------------------------------------------- */
function Locked({ text }) {
  return (
    <div className="flex flex-col items-center justify-center h-[380px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-gray-400">
      <Lock className="w-8 h-8 mb-3 text-[#bfa7ff]" />
      <p>{text}</p>
    </div>
  );
}

/* ---------------------------------------------------- */
/* DASHBOARD VIEW */
/* ---------------------------------------------------- */
function DashboardView({ total, conversionRate, avgTime, trend7, plan }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

        <KPI title="Total Appointments" value={total} icon={<Calendar />} locked={plan !== "pro"} />

        <KPI title="Conversion Rate" value={conversionRate} icon={<Users />} locked={plan !== "pro"} />

        <KPI title="Avg Lead → Appointment" value={avgTime} icon={<Clock />} locked={plan !== "pro"} />

      </div>

      {plan === "pro"
        ? <Sparkline trend7={trend7} />
        : <Locked text="Stats available on Pro plan only." />}
    </motion.div>
  );
}

/* ---------------------------------------------------- */
/* KPI CARD */
/* ---------------------------------------------------- */
function KPI({ title, value, icon, locked }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300">
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

/* ---------------------------------------------------- */
/* SPARKLINE */
/* ---------------------------------------------------- */
function Sparkline({ trend7 }) {
  const width = 800;
  const height = 120;
  const pad = 8;

  const points = trend7.map((t, i) => {
    const max = Math.max(...trend7.map((x) => x.count));
    const stepX = (width - pad * 2) / (trend7.length - 1);
    const x = pad + i * stepX;
    const y =
      height - pad - (t.count / max) * (height - pad * 2);
    return [x, y];
  });

  const path =
    points.length > 1
      ? "M " + points.map((p) => p.join(",")).join(" L ")
      : "";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-[140px] bg-white/5 rounded-2xl p-4 mt-4 border border-white/10"
    >
      <motion.path
        d={path}
        fill="none"
        stroke="#bfa7ff"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#bfa7ff" />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------- */
/* TIMELINE VIEW */
/* ---------------------------------------------------- */
function TimelineView({ appointments }) {
  if (!appointments.length) return <Locked text="No appointments yet." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 bg-white/5 p-6 rounded-2xl"
    >
      {appointments.map((a) => (
        <div key={a.id} className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="font-semibold text-white">{a.customer_name}</div>
          <div className="text-[#00eaff] text-sm">{a.customer_email}</div>
          <p className="text-gray-300 text-sm mt-1 truncate">
            {a.calendly_event_link}
          </p>
          <div className="text-xs text-gray-400 mt-2">
            {new Date(a.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ---------------------------------------------------- */
/* UNIVERSE GRID */
/* ---------------------------------------------------- */
function UniverseGridView({ appointments }) {
  if (!appointments.length) return <Locked text="No appointments yet." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {appointments.map((a) => (
        <div key={a.id} className="border border-white/10 bg-white/5 p-5 rounded-xl">
          <h3 className="text-lg font-semibold">{a.customer_name}</h3>
          <p className="text-[#00eaff] text-sm">{a.customer_email}</p>
          <p className="text-gray-300 text-sm mt-2 truncate">{a.calendly_event_link}</p>
        </div>
      ))}
    </motion.div>
  );
}
