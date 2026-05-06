import {
  Users,
  Calendar,
  MessageSquare,
  Crown,
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Bot,
  Zap,
  Loader2,
  Globe,
  BrainCircuit,
  Rocket,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    leads: 0,
    appointments: 0,
    chatbots: 0,
    plan: "FREE",
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const userId = session.user.id;

      // 🔥 LEADS
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 🔥 APPOINTMENTS
      const { count: appointmentCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 🔥 CHATBOTS
      const { count: chatbotCount } = await supabase
        .from("chatbots")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // 🔥 SUBSCRIPTION
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      // 🔥 RECENT LEADS
      const { data: recentLeads } = await supabase
        .from("leads")
        .select("name, email, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        leads: leadsCount || 0,
        appointments: appointmentCount || 0,
        chatbots: chatbotCount || 0,
        plan: subscription?.plan?.toUpperCase() || "FREE",
      });

      setActivities(recentLeads || []);

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADER
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060816]">

        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-600/20 blur-[140px] rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center">

          <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-6"></div>

          <h2 className="text-white text-2xl font-bold mb-2">
            Loading Dashboard
          </h2>

          <p className="text-gray-400">
            Preparing your AI workspace...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="text-white min-h-screen relative">

      {/* BACKGROUND GLOW */}
      <div className="fixed top-[-150px] left-[-150px] w-[350px] h-[350px] bg-purple-600/20 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="fixed bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-blue-600/20 blur-[160px] rounded-full pointer-events-none"></div>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl p-8 lg:p-12 mb-8 shadow-2xl shadow-purple-500/10">

        {/* GLOW */}
        <div className="absolute top-[-120px] right-[-120px] w-[300px] h-[300px] bg-purple-500/20 blur-[150px] rounded-full"></div>

        <div className="absolute bottom-[-120px] left-[-120px] w-[300px] h-[300px] bg-blue-500/20 blur-[150px] rounded-full"></div>

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">

              <Sparkles className="w-4 h-4 text-purple-400" />

              <span className="text-sm text-gray-300">
                AI Business Command Center
              </span>

            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">

              Welcome Back
              <br />

              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                To AIAERA
              </span>

            </h1>

            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              Build powerful AI chatbots, automate conversations,
              collect leads, and scale your business using
              advanced AI workflows.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/app/builder"
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center gap-3"
              >

                Build AI Chatbot

                <ChevronRight className="group-hover:translate-x-1 transition-all" />

              </Link>

              <Link
                to="/app/leads"
                className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 font-semibold"
              >
                View Leads
              </Link>

            </div>

          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-5 w-full xl:w-[450px]">

            <div className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl">

              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-5">
                <BrainCircuit className="text-purple-400" />
              </div>

              <h3 className="text-3xl font-black mb-1">
                {stats.chatbots}
              </h3>

              <p className="text-gray-400 text-sm">
                AI Assistants
              </p>

            </div>

            <div className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-5">
                <Users className="text-blue-400" />
              </div>

              <h3 className="text-3xl font-black mb-1">
                {stats.leads}
              </h3>

              <p className="text-gray-400 text-sm">
                Leads Captured
              </p>

            </div>

            <div className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl">

              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-5">
                <Calendar className="text-pink-400" />
              </div>

              <h3 className="text-3xl font-black mb-1">
                {stats.appointments}
              </h3>

              <p className="text-gray-400 text-sm">
                Appointments
              </p>

            </div>

            <div className="rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl">

              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-5">
                <Rocket className="text-green-400" />
              </div>

              <h3 className="text-3xl font-black mb-1">
                {stats.plan}
              </h3>

              <p className="text-gray-400 text-sm">
                Active Plan
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="2xl:col-span-2 space-y-6">

          {/* ANALYTICS */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl p-8 shadow-xl shadow-black/20">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-black mb-2">
                  AI Performance
                </h2>

                <p className="text-gray-400">
                  Real-time business automation insights
                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                <TrendingUp className="text-purple-400" />
              </div>

            </div>

            <div className="space-y-7">

              {/* ITEM */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-gray-400">
                    Lead Conversion
                  </span>

                  <span className="font-bold text-lg">
                    84%
                  </span>

                </div>

                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">

                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>

                </div>

              </div>

              {/* ITEM */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-gray-400">
                    AI Response Speed
                  </span>

                  <span className="font-bold text-lg">
                    Instant
                  </span>

                </div>

                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">

                  <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>

                </div>

              </div>

              {/* ITEM */}
              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-gray-400">
                    User Engagement
                  </span>

                  <span className="font-bold text-lg">
                    High
                  </span>

                </div>

                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">

                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-pink-500 to-red-500"></div>

                </div>

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* BUILDER */}
            <Link
              to="/app/builder"
              className="group relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border border-white/10 shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300"
            >

              <div className="absolute top-[-60px] right-[-60px] w-40 h-40 bg-white/10 rounded-full"></div>

              <div className="relative z-10">

                <div className="flex items-center justify-between mb-8">

                  <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
                    <Bot size={40} />
                  </div>

                  <ArrowRight className="group-hover:translate-x-2 transition-all duration-300" />

                </div>

                <h2 className="text-4xl font-black mb-4">
                  Build Chatbot
                </h2>

                <p className="text-white/80 text-lg leading-relaxed">
                  Create and deploy AI assistants for your business.
                </p>

              </div>

            </Link>

            {/* INTEGRATIONS */}
            <Link
              to="/app/integrations"
              className="group relative overflow-hidden rounded-[32px] p-8 border border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white/10 transition-all duration-300"
            >

              <div className="relative z-10">

                <div className="flex items-center justify-between mb-8">

                  <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center">
                    <Globe size={40} />
                  </div>

                  <ArrowRight className="group-hover:translate-x-2 transition-all duration-300" />

                </div>

                <h2 className="text-4xl font-black mb-4">
                  Integrations
                </h2>

                <p className="text-gray-400 text-lg leading-relaxed">
                  Connect WhatsApp, Facebook, Instagram, and Calendly.
                </p>

              </div>

            </Link>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* CURRENT PLAN */}
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl p-8 shadow-xl shadow-purple-500/10">

            <div className="flex items-center justify-between mb-8">

              <div>

                <p className="text-gray-400 text-sm mb-2">
                  Current Subscription
                </p>

                <h2 className="text-4xl font-black">
                  {stats.plan}
                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <Crown size={30} />
              </div>

            </div>

            <Link
              to="/app/pricing"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition-all duration-300"
            >

              Upgrade Plan

              <ArrowRight size={18} />

            </Link>

          </div>

          {/* ACTIVITY */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl p-8">

            <div className="flex items-center gap-4 mb-8">

              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <Activity className="text-purple-400" />
              </div>

              <div>

                <h2 className="text-2xl font-black">
                  Recent Activity
                </h2>

                <p className="text-gray-400 text-sm">
                  Latest business events
                </p>

              </div>

            </div>

            {activities.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

                <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center mb-5">
                  <Bot className="text-gray-400" size={28} />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  No activity yet
                </h3>

                <p className="text-gray-400">
                  Your chatbot activity will appear here.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {activities.map((item, index) => (

                  <div
                    key={index}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="font-semibold text-lg mb-1">
                          {item.name || "New Lead"}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          {item.email || "Lead captured successfully"}
                        </p>

                      </div>

                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={16} className="text-purple-400" />
                      </div>

                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      {new Date(item.created_at).toLocaleString()}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}