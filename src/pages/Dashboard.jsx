// src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
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
import ProtectedRoute from "../components/ProtectedRoute";
import FloatingMenu from "../components/FloatingMenu";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [subscriptionActive, setSubscriptionActive] = useState(false);
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
  const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) return;

        setUserEmail(user.email);

        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          await fetchKpiAndActivity(user.id);
          return;
        }

        const { data: subscription, error: subErr } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", user.id)
          .single();

        if (subErr) throw subErr;

        setSubscriptionActive(subscription && !isExpired(subscription.expires_at));
        await fetchKpiAndActivity(user.id);
      } catch (err) {
        console.error("Error initializing Dashboard:", err);
      }
    };

    init();
    return () => { mountedRef.current = false; };
  }, []);

  const fetchKpiAndActivity = async (userId) => {
    try {
      const { count: chatbotCount } = await supabase
        .from("chatbot_configs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      const { data: leads } = await supabase
        .from("leads")
        .select("id, name, message, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newLeadsThisWeek = leads.filter(l => new Date(l.created_at) > oneWeekAgo).length;

      const { data: appointments } = await supabase
        .from("appointments")
        .select("id, customer_name, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (mountedRef.current) {
        setKpiData({
          chatbots: chatbotCount || 0,
          leads: leads.length,
          newLeadsThisWeek,
          appointments: appointments.length,
        });

        const recentActivity = [
          ...leads.slice(0, 5).map(l => ({
            label: `New lead captured: ${l.name}`,
            meta: `• ${new Date(l.created_at).toLocaleTimeString()}`,
            created_at: l.created_at,
          })),
          ...appointments.slice(0, 5).map(a => ({
            label: `Appointment booked: ${a.customer_name}`,
            meta: `• ${new Date(a.created_at).toLocaleTimeString()}`,
            created_at: a.created_at,
          })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setActivity(recentActivity);
      }
    } catch (err) {
      console.error("Error fetching KPI/activity:", err);
    }
  };

  const handleActionClick = async (title) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    switch (title) {
      case "Build New Bot":
        navigate("/builder");
        break;
      case "Import FAQs":
        alert("✅ Feature coming soon: Upload CSV/JSON to seed your bot!");
        break;
      case "Get Embed":
        const { data: bots } = await supabase
          .from("chatbot_configs")
          .select("id, businessName")
          .eq("user_id", user.id);

        if (bots && bots.length > 0) {
          const code = bots.map(b => `<script src="https://yourdomain.com/embed/${b.id}.js" async></script>`).join("\n");
          setEmbedCode(code);
          setEmbedModalOpen(true);
        } else {
          alert("No bots found. Create a bot first!");
        }
        break;
      case "View Leads":
        navigate("/leads");
        break;
      default:
        console.log("Unknown action:", title);
    }
  };

  if (!subscriptionActive) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] text-white">
          <p className="text-xl text-center px-4">
            ⚠️ Subscription inactive. Please upgrade to continue using AIAERA.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-[#03040a] via-[#071026] to-[#020205] relative">
        <FloatingMenu userEmail={userEmail} />

        {/* Decorative glows */}
        <div className="pointer-events-none absolute -left-40 -top-40 w-[20rem] sm:w-[28rem] h-[20rem] sm:h-[28rem] rounded-full blur-3xl bg-gradient-radial from-[#00eaff]/10 to-transparent" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 w-[22rem] sm:w-[30rem] h-[22rem] sm:h-[30rem] rounded-full blur-3xl bg-gradient-radial from-[#ffd780]/10 to-transparent" />

        <div className="relative px-4 sm:px-8 pt-8 pb-16 ml-0 md:ml-28">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-2 sm:gap-3 mb-10 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Welcome back{userEmail ? `, ${userEmail.split("@")[0]}` : ""} 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-300">Your AI revenue engine at a glance.</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8 mb-10">
            {[
              { title: "Chatbots", icon: <ChatBubbleLeftIcon className="w-7 h-7 md:w-9 md:h-9 text-[#00eaff]" />, value: `${kpiData.chatbots} Active`, sub: "Deployed across Web & WhatsApp", accent: "from-[#00eaff]/30 to-[#0077b6]/20", delay: 0.05 },
              { title: "Leads", icon: <UsersIcon className="w-7 h-7 md:w-9 md:h-9 text-[#ffd780]" />, value: `${kpiData.leads} Total`, sub: `${kpiData.newLeadsThisWeek} New This Week`, accent: "from-[#ffd780]/30 to-[#ffb800]/20", delay: 0.1 },
              { title: "Appointments", icon: <CalendarIcon className="w-7 h-7 md:w-9 md:h-9 text-[#ff6b6b]" />, value: `${kpiData.appointments} Total`, sub: "Auto-scheduled", accent: "from-[#ff6b6b]/30 to-[#ff3b3b]/20", delay: 0.15 },
              { title: "Conversion", icon: <ArrowTrendingUpIcon className="w-7 h-7 md:w-9 md:h-9 text-[#7afcff]" />, value: "12.4%", sub: "7-day uplift", accent: "from-[#7afcff]/30 to-[#00b3b3]/20", delay: 0.2 },
            ].map(c => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: c.delay }} className={`relative overflow-hidden p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-tr ${c.accent} border border-white/10 shadow-lg`}>
                <div className="absolute inset-0 bg-white/5 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-3 sm:gap-4">
                  <div className="shrink-0 rounded-xl sm:rounded-2xl bg-black/30 border border-white/10 p-2 sm:p-3">{c.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm text-gray-300">{c.title}</div>
                    <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">{c.value}</div>
                    <div className="text-[11px] sm:text-xs text-gray-400 mt-1">{c.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
            {/* Activity Stream */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }} className="xl:col-span-2 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white">Realtime Activity</h2>
                <span className="text-xs text-gray-400">last 24h</span>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {activity.length ? activity.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 hover:bg-black/25 transition-colors">
                    <div className="mt-[2px] h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#00eaff]" />
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm md:text-base text-white">{row.label}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400">{row.meta}</div>
                    </div>
                  </div>
                )) : <div className="text-gray-400 text-sm">No recent activity.</div>}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }} className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Build New Bot", icon: <BoltIcon className="w-4 h-4 sm:w-5 sm:h-5" />, hint: "Launch a tailored assistant" },
                  { title: "Import FAQs", icon: <ChatBubbleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />, hint: "Seed with content" },
                  { title: "Get Embed", icon: <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />, hint: "Drop into your site" },
                  { title: "View Leads", icon: <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />, hint: "Qualify & export" },
                ].map(a => (
                  <button key={a.title} onClick={() => handleActionClick(a.title)} className="group text-left rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 text-white">
                      <span className="rounded-lg sm:rounded-xl bg-white/10 p-2 border border-white/10">{a.icon}</span>
                      <span className="font-medium text-sm sm:text-base">{a.title}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{a.hint}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 rounded-lg sm:rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-300">
                  Tip: Connect <span className="text-[#00eaff]">Integrations</span> to unlock WhatsApp + Calendly automation.
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Embed Modal */}
        {embedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
            <div className="bg-[#020205] rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-lg">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3">Embed Code</h3>
              <textarea
                className="w-full h-40 p-3 rounded-lg bg-black/20 text-white text-xs font-mono"
                value={embedCode}
                readOnly
              />
              <div className="flex justify-end mt-4">
                <button onClick={() => setEmbedModalOpen(false)} className="px-4 py-2 bg-[#7f5af0] text-white rounded-lg sm:rounded-xl hover:bg-[#995afc] transition-colors text-sm sm:text-base">
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
