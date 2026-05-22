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
  Clock3,
  AlertTriangle,
  Zap,
  Lock,
} from "lucide-react";

import { Link } from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function Dashboard() {

  const [loading, setLoading] =
    useState(true);

  const [chatbots, setChatbots] =
    useState([]);

  const [subscription, setSubscription] =
    useState(null);

  const [stats, setStats] =
    useState({
      leads: 0,
      appointments: 0,
      chatbots: 0,
      plan: "TRIAL",
      messages_used: 0,
      messages_limit: 200,
      expires_at: null,
      expired: false,
    });

  useEffect(() => {

    fetchDashboardData();

  }, []);

  /*
  ========================================
  FETCH DATA
  ========================================
  */
  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session?.user)
          return;

        const userId =
          session.user.id;

        /*
        ========================================
        LEADS
        ========================================
        */
        const {
          count: leadsCount,
        } =
          await supabase
            .from("leads")
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              userId
            );

        /*
        ========================================
        APPOINTMENTS
        ========================================
        */
        const {
          count: appointmentCount,
        } =
          await supabase
            .from(
              "appointments"
            )
            .select("*", {
              count: "exact",
              head: true,
            })
            .eq(
              "user_id",
              userId
            );

        /*
        ========================================
        CHATBOTS
        ========================================
        */
        const {
          data: chatbotData,
          count: chatbotCount,
        } =
          await supabase
            .from("chatbots")
            .select("*", {
              count: "exact",
            })
            .eq(
              "user_id",
              userId
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

        /*
        ========================================
        SUBSCRIPTION
        ========================================
        */
        const {
          data: subData,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .select("*")
            .eq(
              "user_id",
              userId
            )
            .maybeSingle();

        const expired =
          subData?.expires_at
            ? new Date(
                subData.expires_at
              ) < new Date()
            : false;

        setSubscription(
          subData
        );

        setChatbots(
          chatbotData || []
        );

        setStats({
          leads:
            leadsCount || 0,

          appointments:
            appointmentCount || 0,

          chatbots:
            chatbotCount || 0,

          plan:
            subData?.plan?.toUpperCase() ||
            "TRIAL",

          messages_used:
            subData?.messages_used ||
            0,

          messages_limit:
            subData?.messages_limit ||
            200,

          expires_at:
            subData?.expires_at ||
            null,

          expired,
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

  /*
  ========================================
  DELETE CHATBOT
  ========================================
  */
  const deleteChatbot =
    async (id) => {

      if (
        stats.expired
      ) {
        return;
      }

      const confirmDelete =
        window.confirm(
          "Delete this chatbot?"
        );

      if (!confirmDelete)
        return;

      try {

        await supabase
          .from(
            "chatbot_files"
          )
          .delete()
          .eq(
            "chatbot_id",
            id
          );

        await supabase
          .from("chatbots")
          .delete()
          .eq("id", id);

        fetchDashboardData();

      } catch (err) {

        console.error(err);

      }
    };

  /*
  ========================================
  LOADING
  ========================================
  */
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

  /*
  ========================================
  DAYS LEFT
  ========================================
  */
  const daysLeft =
    stats.expires_at
      ? Math.max(
          0,
          Math.ceil(
            (
              new Date(
                stats.expires_at
              ) -
              new Date()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              )
          )
        )
      : 0;

  /*
  ========================================
  STATS
  ========================================
  */
  const statCards = [
    {
      title: "Chatbots",
      value:
        stats.chatbots,
      icon: Bot,
    },
    {
      title: "Leads",
      value:
        stats.leads,
      icon: Users,
    },
    {
      title:
        "Appointments",
      value:
        stats.appointments,
      icon: Calendar,
    },
    {
      title: "Plan",
      value:
        stats.plan,
      icon: Crown,
    },
  ];

  return (

    <div className="space-y-4 text-white">

      {/* EXPIRED BANNER */}
      {stats.expired && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="w-11 h-11 rounded-2xl bg-red-500/20 flex items-center justify-center">

              <AlertTriangle
                size={20}
                className="text-red-300"
              />

            </div>

            <div>

              <h3 className="font-semibold text-red-200 mb-1">

                Subscription Expired

              </h3>

              <p className="text-sm text-red-100/80">

                Your chatbot and automations are paused.
                Renew your subscription to reactivate all features.

              </p>

            </div>

          </div>

          <Link
            to="/app/pricing"
            className="h-11 px-5 rounded-xl bg-white text-black font-medium flex items-center justify-center"
          >

            Renew Plan

          </Link>

        </div>

      )}

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

        <button
          disabled={
            stats.expired
          }
          className={`
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-2xl
            font-medium
            text-sm
            transition-all
            duration-200
            ${
              stats.expired
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : "bg-[#7f5af0] hover:opacity-90"
            }
          `}
        >

          <Plus size={15} />

          Create Chatbot

        </button>

      </div>

      {/* PLAN STATUS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

        {/* PLAN CARD */}
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#7f5af0]/20 to-blue-500/10 p-5 xl:col-span-2 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-500/10 blur-[120px] rounded-full"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">

                <Crown
                  size={13}
                  className="text-yellow-300"
                />

                <span className="text-xs font-medium">

                  {stats.plan} PLAN

                </span>

              </div>

              <h2 className="text-3xl font-bold mb-2">

                {stats.expired
                  ? "Plan Expired"
                  : `${daysLeft} Days Remaining`}

              </h2>

              <p className="text-gray-300 text-sm max-w-lg">

                {stats.expired
                  ? "Your AI chatbot and automations are paused until renewal."
                  : "Your subscription is active and all available features are working normally."}

              </p>

            </div>

            <div className="flex flex-col gap-3 min-w-[240px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm text-gray-300">

                    AI Messages

                  </span>

                  <span className="text-sm font-medium">

                    {stats.messages_used} / {stats.messages_limit}

                  </span>

                </div>

                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                    style={{
                      width: `${
                        (
                          stats.messages_used /
                          stats.messages_limit
                        ) * 100
                      }%`,
                    }}
                  />

                </div>

              </div>

              <Link
                to="/app/pricing"
                className="h-12 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >

                {stats.expired
                  ? "Renew Subscription"
                  : "Manage Plan"}

                <ArrowRight size={16} />

              </Link>

            </div>

          </div>

        </div>

        {/* USAGE CARD */}
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs text-gray-400 mb-1">

                Current Usage

              </p>

              <h3 className="text-xl font-bold">

                Workspace Stats

              </h3>

            </div>

            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center">

              <Zap
                size={18}
                className="text-purple-400"
              />

            </div>

          </div>

          <div className="space-y-4">

            <UsageItem
              label="Chatbots"
              value={stats.chatbots}
            />

            <UsageItem
              label="Leads"
              value={stats.leads}
            />

            <UsageItem
              label="Appointments"
              value={
                stats.appointments
              }
            />

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">

        {statCards.map(
          (
            card,
            index
          ) => {

            const Icon =
              card.icon;

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
          }
        )}

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

              <ActionCard
                to="/app/builder"
                icon={Bot}
                color="bg-[#7f5af0]/20"
                title="Build Chatbot"
                desc="Create AI assistants"
                disabled={
                  stats.expired
                }
              />

              <ActionCard
                to="/app/integrations"
                icon={Activity}
                color="bg-blue-500/20"
                title="Integrations"
                desc="Connect channels"
                disabled={false}
              />

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

            {chatbots.length ===
            0 ? (

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

                {chatbots.map(
                  (bot) => (

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

                            {bot.bot_name ||
                              "AI Assistant"}

                          </h3>

                          <p className="text-xs text-gray-400">

                            {new Date(
                              bot.created_at
                            ).toLocaleDateString()}

                          </p>

                        </div>

                      </div>

                      <button
                        disabled={
                          stats.expired
                        }
                        onClick={() =>
                          deleteChatbot(
                            bot.id
                          )
                        }
                        className={`
                          w-9
                          h-9
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          transition-all
                          ${
                            stats.expired
                              ? "bg-white/5 text-gray-500 cursor-not-allowed"
                              : "bg-red-500/10 hover:bg-red-500/20"
                          }
                        `}
                      >

                        {stats.expired ? (
                          <Lock
                            size={15}
                          />
                        ) : (
                          <Trash2
                            size={15}
                            className="text-red-400"
                          />
                        )}

                      </button>

                    </div>

                  )
                )}

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
                (
                  height,
                  index
                ) => (

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
                        [
                          "M",
                          "T",
                          "W",
                          "T",
                          "F",
                          "S",
                          "S",
                        ][index]
                      }

                    </span>

                  </div>

                )
              )}

            </div>

          </div>

          {/* PLAN CARD */}
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

              <PlanRow
                label="Chatbots"
                value={
                  stats.chatbots
                }
              />

              <PlanRow
                label="Leads"
                value={
                  stats.leads
                }
              />

              <PlanRow
                label="Appointments"
                value={
                  stats.appointments
                }
              />

              <PlanRow
                label="Messages"
                value={`${stats.messages_used}/${stats.messages_limit}`}
              />

            </div>

            <Link
              to="/app/pricing"
              className="w-full flex items-center justify-center py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition-all text-sm"
            >

              {stats.expired
                ? "Renew Subscription"
                : "Manage Plan"}

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

/*
========================================
ACTION CARD
========================================
*/
function ActionCard({
  to,
  icon: Icon,
  color,
  title,
  desc,
  disabled,
}) {

  if (disabled) {

    return (

      <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 opacity-60 cursor-not-allowed">

        <div className="flex items-center gap-3">

          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>

            <Lock size={16} />

          </div>

          <div>

            <h3 className="text-sm font-semibold">

              {title}

            </h3>

            <p className="text-xs text-gray-400">

              Subscription expired

            </p>

          </div>

        </div>

      </div>

    );
  }

  return (

    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all duration-200"
    >

      <div className="flex items-center gap-3">

        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>

          <Icon size={17} />

        </div>

        <div>

          <h3 className="text-sm font-semibold">

            {title}

          </h3>

          <p className="text-xs text-gray-400">

            {desc}

          </p>

        </div>

      </div>

      <ArrowRight
        size={15}
        className="group-hover:translate-x-1 transition-all"
      />

    </Link>

  );
}

/*
========================================
USAGE ITEM
========================================
*/
function UsageItem({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between">

      <span className="text-sm text-gray-400">

        {label}

      </span>

      <span className="font-semibold">

        {value}

      </span>

    </div>

  );
}

/*
========================================
PLAN ROW
========================================
*/
function PlanRow({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between text-sm">

      <span className="text-gray-300">

        {label}

      </span>

      <span>

        {value}

      </span>

    </div>

  );
}