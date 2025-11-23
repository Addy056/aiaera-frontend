// src/pages/Dashboard.jsx

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  BoltIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [kpiData, setKpiData] = useState({
    chatbots: 0,
    leads: 0,
    newLeadsThisWeek: 0,
    appointments: 0,
  });

  const [activity, setActivity] = useState([]);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const mountedRef = useRef(false);
  const navigate = useNavigate();

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
  const API_BASE = import.meta.env.VITE_API_URL;

  const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

  // ------------------------------
  // INIT DASHBOARD
  // ------------------------------
  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr || !user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email);

        // ----- FREE ACCESS -----
        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          await fetchKpiAndActivity(user.id);
          setLoading(false);
          return;
        }

        // ----- SUBSCRIPTION CHECK -----
        const { data: subscription, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subErr) console.error(subErr);

        const active = subscription && !isExpired(subscription.expires_at);
        setSubscriptionActive(active);

        await fetchKpiAndActivity(user.id);
      } catch (err) {
        console.error("❌ Dashboard init failed:", err);
      }

      setLoading(false);
    };

    init();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ------------------------------
  // FETCH KPI + ACTIVITY
  // ------------------------------
  const fetchKpiAndActivity = async (userId) => {
    try {
      const { count: chatbotCount } = await supabase
        .from("chatbots")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      const { data: leads = [] } = await supabase
        .from("leads")
        .select("id, name, message, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const weekAgo = new Date(Date.now() - 7 * 86400 * 1000);
      const newLeadsWeek = leads.filter(
        (l) => new Date(l.created_at) > weekAgo
      ).length;

      const { data: appointments = [] } = await supabase
        .from("appointments")
        .select("id, customer_name, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!mountedRef.current) return;

      setKpiData({
        chatbots: chatbotCount || 0,
        leads: leads.length,
        newLeadsThisWeek: newLeadsWeek,
        appointments: appointments.length,
      });

      const recent = [
        ...leads.slice(0, 5).map((l) => ({
          label: `New lead: ${l.name}`,
          time: new Date(l.created_at).toLocaleTimeString(),
          created_at: l.created_at,
        })),
        ...appointments.slice(0, 5).map((a) => ({
          label: `Appointment: ${a.customer_name}`,
          time: new Date(a.created_at).toLocaleTimeString(),
          created_at: a.created_at,
        })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setActivity(recent);
    } catch (err) {
      console.error("❌ KPI fetch error:", err);
    }
  };

  // ------------------------------
  // QUICK ACTIONS
  // ------------------------------
  const handleActionClick = async (title) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    switch (title) {
      case "Build New Bot":
        navigate("/builder");
        break;

      case "Import FAQs":
        alert("Coming soon: Upload FAQs via CSV/JSON!");
        break;

      case "Get Embed":
        const { data: bots } = await supabase
          .from("chatbots")
          .select("id, name")
          .eq("user_id", user.id);

        if (!bots?.length) return alert("No chatbots found.");

        const embed = bots
          .map(
            (b) =>
              `<script src="${API_BASE}/api/embed/${b.id}.js" async></script>`
          )
          .join("\n");

        setEmbedCode(embed);
        setEmbedModalOpen(true);
        break;

      case "View Leads":
        navigate("/leads");
        break;

      default:
        break;
    }
  };

  // ------------------------------
  // RENDER
  // ------------------------------

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="h-screen flex items-center justify-center text-white bg-[#03040a]">
          Loading dashboard...
        </div>
      </ProtectedRoute>
    );
  }

  if (!subscriptionActive) {
    return (
      <ProtectedRoute>
        <div className="h-screen flex items-center justify-center text-center text-white bg-[#03040a]">
          <p className="text-lg px-6">
            ⚠️ Your subscription is inactive.  
            Please upgrade to continue using AIAERA.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] relative text-white">

        {/* Floating Sidebar */}
        <FloatingMenu userEmail={userEmail} />

        {/* Background Glow Effects */}
        <div className="pointer-events-none absolute -left-40 -top-40 w-[28rem] h-[28rem] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(0,234,255,0.1),transparent)]" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 w-[30rem] h-[30rem] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(255,215,128,0.1),transparent)]" />

        {/* Content Wrapper */}
        <div className="relative px-6 pt-10 pb-20 md:ml-28">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center md:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, {userEmail.split("@")[0]} 👋
            </h1>
            <p className="text-gray-300 mt-2">
              Your AI performance overview at a glance.
            </p>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Chatbots",
                icon: <ChatBubbleLeftIcon className="w-8 h-8 text-[#00eaff]" />,
                value: `${kpiData.chatbots} Active`,
                sub: "Live on Web & WhatsApp",
                accent: "from-[#00eaff]/30 to-[#0077b6]/20",
                delay: 0.05,
              },
              {
                title: "Leads",
                icon: <UsersIcon className="w-8 h-8 text-[#ffd780]" />,
                value: `${kpiData.leads} Total`,
                sub: `${kpiData.newLeadsThisWeek} New This Week`,
                accent: "from-[#ffd780]/30 to-[#ffb800]/20",
                delay: 0.1,
              },
              {
                title: "Appointments",
                icon: <CalendarIcon className="w-8 h-8 text-[#ff6b6b]" />,
                value: `${kpiData.appointments} booked`,
                sub: "Auto-scheduled",
                accent: "from-[#ff6b6b]/30 to-[#ff3b3b]/20",
                delay: 0.15,
              },
              {
                title: "Conversion",
                icon: <ArrowTrendingUpIcon className="w-8 h-8 text-[#7afcff]" />,
                value: "12.4%",
                sub: "7-day uplift",
                accent: "from-[#7afcff]/30 to-[#00b3b3]/20",
                delay: 0.2,
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: c.delay }}
                className={`relative overflow-hidden p-6 rounded-3xl bg-gradient-to-tr ${c.accent} border border-white/10 shadow-xl`}
              >
                <div className="absolute inset-0 bg-white/5 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <div className="shrink-0 rounded-2xl bg-black/30 border border-white/10 p-3">
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">{c.title}</div>
                    <div className="text-2xl font-bold text-white">
                      {c.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-white">
                  Realtime Activity
                </h2>
                <span className="text-xs text-gray-400">last 24h</span>
              </div>

              <div className="space-y-4">
                {activity.length ? (
                  activity.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-black/30 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#00eaff] mt-2" />
                      <div className="flex-1">
                        <div className="text-sm text-white">{row.label}</div>
                        <div className="text-xs text-gray-400">{row.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">
                    No recent activity.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Build New Bot",
                    icon: <BoltIcon className="w-5 h-5" />,
                    hint: "Launch a tailored bot",
                  },
                  {
                    title: "Import FAQs",
                    icon: <ChatBubbleLeftIcon className="w-5 h-5" />,
                    hint: "Seed with content",
                  },
                  {
                    title: "Get Embed",
                    icon: <ArrowTopRightOnSquareIcon className="w-5 h-5" />,
                    hint: "Add to website",
                  },
                  {
                    title: "View Leads",
                    icon: <UsersIcon className="w-5 h-5" />,
                    hint: "Qualify + export",
                  },
                ].map((q) => (
                  <button
                    key={q.title}
                    onClick={() => handleActionClick(q.title)}
                    className="group rounded-2xl p-4 border border-white/10 bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-white">
                      <span className="rounded-xl bg-white/10 p-2 border border-white/10">
                        {q.icon}
                      </span>
                      <span className="font-medium">{q.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{q.hint}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-gray-300">
                  Connect{" "}
                  <span className="text-[#00eaff]">Integrations</span> to enable
                  WhatsApp + Calendly automation.
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Embed Modal */}
        {embedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
            <div className="bg-[#020205] rounded-3xl p-6 w-full max-w-lg">
              <h3 className="text-white text-lg font-semibold mb-3">
                Embed Code
              </h3>
              <textarea
                className="w-full h-40 p-3 rounded-xl bg-black/20 text-white text-sm font-mono"
                value={embedCode}
                readOnly
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEmbedModalOpen(false)}
                  className="px-5 py-2 bg-[#7f5af0] text-white rounded-xl hover:bg-[#9f5afc] transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
