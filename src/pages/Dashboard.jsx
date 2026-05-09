import {
  Users,
  Calendar,
  Bot,
  Crown,
  ArrowRight,
  Activity,
  Sparkles,
  Plus,
  TrendingUp,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [chatbots, setChatbots] = useState([]);

  const [stats, setStats] = useState({
    leads: 0,
    appointments: 0,
    chatbots: 0,
    plan: "FREE",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // FETCH DATA
  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const userId = session.user.id;

      // LEADS
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId);

      // APPOINTMENTS
      const { count: appointmentCount } = await supabase
        .from("appointments")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId);

      // CHATBOTS
      const {
        data: chatbotData,
        count: chatbotCount,
      } = await supabase
        .from("chatbots")
        .select("*", {
          count: "exact",
        })
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        });

      // PLAN
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", userId)
        .maybeSingle();

      setChatbots(chatbotData || []);

      setStats({
        leads: leadsCount || 0,
        appointments: appointmentCount || 0,
        chatbots: chatbotCount || 0,
        plan:
          subscription?.plan?.toUpperCase()
          || "FREE",
      });

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // DELETE CHATBOT
  const deleteChatbot = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this chatbot?"
    );

    if (!confirmDelete) return;

    try {

      // DELETE FILES
      await supabase
        .from("chatbot_files")
        .delete()
        .eq("chatbot_id", id);

      // DELETE BOT
      await supabase
        .from("chatbots")
        .delete()
        .eq("id", id);

      fetchDashboardData();

    } catch (err) {

      console.error(err);

    }
  };

  // LOADING
  if (loading) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4"></div>

          <p className="text-gray-400 text-sm">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  const statCards = [
    {
      title: "Chatbots",
      value: stats.chatbots,
      icon: Bot,
    },
    {
      title: "Leads",
      value: stats.leads,
      icon: Users,
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: Calendar,
    },
    {
      title: "Plan",
      value: stats.plan,
      icon: Crown,
    },
  ];

  return (
    <div className="space-y-4 text-white">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-2">

            <Sparkles
              size={12}
              className="text-purple-400"
            />

            <span className="text-[11px] text-gray-300">
              AI Workspace Overview
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Dashboard
          </h1>

          <p className="text-gray-400 text-sm">
            Monitor and manage your AI workspace.
          </p>

        </div>

        <Link
          to="/app/builder"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all duration-200 font-medium text-sm"
        >

          <Plus size={15} />

          Create Chatbot

        </Link>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {statCards.map((card, index) => {

          const Icon = card.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
            >

              <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">

                <Icon size={17} />

              </div>

              <h2 className="text-2xl font-bold mb-1">
                {card.value}
              </h2>

              <p className="text-gray-400 text-sm">
                {card.title}
              </p>

            </div>
          );
        })}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-3">

        {/* LEFT */}
        <div className="space-y-3">

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

            <div className="mb-4">

              <h2 className="text-base font-semibold mb-1">
                Quick Actions
              </h2>

              <p className="text-gray-400 text-xs">
                Manage your workspace
              </p>

            </div>

            <div className="space-y-3">

              {/* BUILDER */}
              <Link
                to="/app/builder"
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all duration-200"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#7f5af0]/20 flex items-center justify-center">
                    <Bot size={17} />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      Build Chatbot
                    </h3>

                    <p className="text-xs text-gray-400">
                      Create AI assistants
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-all"
                />

              </Link>

              {/* INTEGRATIONS */}
              <Link
                to="/app/integrations"
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all duration-200"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Activity size={17} />
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      Integrations
                    </h3>

                    <p className="text-xs text-gray-400">
                      Connect channels
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-all"
                />

              </Link>

            </div>

          </div>

          {/* CHATBOTS */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-base font-semibold mb-1">
                  Your Chatbots
                </h2>

                <p className="text-xs text-gray-400">
                  Manage created assistants
                </p>

              </div>

            </div>

            {chatbots.length === 0 ? (

              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">

                <Bot
                  size={24}
                  className="mx-auto text-gray-500 mb-3"
                />

                <h3 className="font-medium mb-1">
                  No Chatbots
                </h3>

                <p className="text-sm text-gray-400">
                  Create your first chatbot.
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {chatbots.map((bot) => (

                  <div
                    key={bot.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-[#7f5af0]/15 flex items-center justify-center">

                        <Bot
                          size={16}
                          className="text-purple-400"
                        />

                      </div>

                      <div>

                        <h3 className="text-sm font-medium">
                          {bot.bot_name
                            || "AI Assistant"}
                        </h3>

                        <p className="text-xs text-gray-400">
                          {new Date(
                            bot.created_at
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        deleteChatbot(bot.id)
                      }
                      className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center justify-center"
                    >

                      <Trash2
                        size={15}
                        className="text-red-400"
                      />

                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-3">

          {/* GRAPH */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-base font-semibold mb-1">
                  AI Performance
                </h2>

                <p className="text-gray-400 text-xs">
                  Weekly chatbot activity
                </p>

              </div>

              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">

                <TrendingUp
                  size={16}
                  className="text-purple-400"
                />

              </div>

            </div>

            <div className="flex items-end justify-between gap-2 h-[180px]">

              {[45, 70, 55, 90, 65, 80, 100].map(
                (height, index) => (

                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end gap-2"
                  >

                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#7f5af0] to-[#5B8CFF]"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>

                    <span className="text-[10px] text-gray-500">
                      {
                        ["M", "T", "W", "T", "F", "S", "S"][index]
                      }
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

          {/* PLAN */}
          <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#7f5af0]/20 to-blue-500/10 p-4">

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-xs text-gray-300 mb-1">
                  Active Plan
                </p>

                <h2 className="text-3xl font-bold">
                  {stats.plan}
                </h2>

              </div>

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

                <Crown size={18} />

              </div>

            </div>

            <div className="space-y-3 mb-5">

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-300">
                  Chatbots
                </span>

                <span>
                  {stats.chatbots}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-300">
                  Leads
                </span>

                <span>
                  {stats.leads}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-300">
                  Appointments
                </span>

                <span>
                  {stats.appointments}
                </span>

              </div>

            </div>

            <Link
              to="/app/pricing"
              className="w-full flex items-center justify-center py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-all text-sm"
            >

              Manage Plan

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}