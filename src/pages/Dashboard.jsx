import {
  Users,
  Calendar,
  Bot,
  Crown,
  ArrowRight,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
  Lock,
  MessageSquare,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function Dashboard() {

  /*
  ========================================
  STATES
  ========================================
  */
  const [loading, setLoading] =
    useState(true);

  const [chatbots, setChatbots] =
    useState([]);

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

  /*
  ========================================
  FETCH DATA
  ========================================
  */
  useEffect(() => {

    fetchDashboardData();

  }, []);

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
          count:
            appointmentCount,
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
                ascending:
                  false,
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

          <div className="relative mb-5">

            <div className="absolute inset-0 bg-purple-500/20 blur-[30px] rounded-full"></div>

            <div className="relative w-12 h-12 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>

          </div>

          <p className="text-gray-400 text-sm">

            Loading your dashboard...

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

  ];

  return (

    <div className="space-y-5 text-white">

      {/* EXPIRED */}
      {stats.expired && (

        <div className="
          rounded-[30px]
          border
          border-red-500/20
          bg-gradient-to-br
          from-red-500/10
          to-red-500/5
          p-6
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          shadow-[0_10px_40px_rgba(239,68,68,0.12)]
        ">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">

              <AlertTriangle
                size={20}
                className="text-red-300"
              />

            </div>

            <div>

              <h3 className="font-semibold text-red-200 mb-1 text-lg">

                Subscription Expired

              </h3>

              <p className="text-sm text-red-100/80 max-w-xl">

                Your chatbot is temporarily paused.
                Renew your plan to continue using all AI features.

              </p>

            </div>

          </div>

          <Link
            to="/app/pricing"
            className="
              h-12
              px-6
              rounded-2xl
              bg-white
              text-black
              font-semibold
              flex
              items-center
              justify-center
              hover:opacity-90
              transition-all
              shrink-0
            "
          >

            Renew Plan

          </Link>

        </div>

      )}

      {/* HERO */}
      <div className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/[0.08]
        bg-gradient-to-br
        from-[#7f5af0]/20
        via-[#111827]
        to-blue-500/10
        p-7
        shadow-[0_20px_80px_rgba(0,0,0,0.35)]
      ">

        <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] bg-purple-500/20 blur-[120px] rounded-full"></div>

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-4">

              <Sparkles
                size={13}
                className="text-purple-300"
              />

              <span className="text-xs text-gray-300">

                Your AI Business Dashboard

              </span>

            </div>

            <h1 className="text-4xl font-black tracking-tight mb-3">

              Welcome Back 👋

            </h1>

            <p className="text-gray-300 text-sm max-w-xl leading-relaxed">

              See your chatbot activity, leads,
              appointments, and plan status in one place.

            </p>

          </div>

          <Link
            to="/app/builder"
            className={`
              h-14
              px-7
              rounded-2xl
              flex
              items-center
              justify-center
              gap-3
              font-semibold
              transition-all
              duration-300
              shrink-0
              ${
                stats.expired
                  ? "bg-white/5 text-gray-500 cursor-not-allowed pointer-events-none"
                  : `
                    bg-gradient-to-r
                    from-[#7f5af0]
                    to-blue-500
                    shadow-[0_10px_40px_rgba(127,90,240,0.35)]
                    hover:scale-[1.02]
                  `
              }
            `}
          >

            <Plus size={18} />

            Create Your AI Chatbot

          </Link>

        </div>

      </div>

      {/* MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                className="
                  rounded-[28px]
                  border
                  border-white/[0.08]
                  bg-gradient-to-br
                  from-white/[0.05]
                  to-white/[0.02]
                  p-5
                  shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                "
              >

                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#7f5af0]/20
                  to-blue-500/10
                  border
                  border-white/[0.06]
                  flex
                  items-center
                  justify-center
                  mb-5
                ">

                  <Icon
                    size={20}
                    className="text-purple-300"
                  />

                </div>

                <h2 className="text-4xl font-black mb-1">

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

      {/* PLAN + QUICK ACTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-4">

        {/* PLAN */}
        <div className="
          rounded-[30px]
          border
          border-white/[0.08]
          bg-gradient-to-br
          from-white/[0.05]
          to-white/[0.02]
          p-6
          shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        ">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-gray-400 text-sm mb-1">

                Current Plan

              </p>

              <h2 className="text-3xl font-black">

                {stats.plan}

              </h2>

            </div>

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-br
              from-[#7f5af0]/20
              to-blue-500/10
              border
              border-white/[0.06]
              flex
              items-center
              justify-center
            ">

              <Crown
                size={20}
                className="text-yellow-300"
              />

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <div className="flex items-center justify-between mb-2">

                <span className="text-sm text-gray-300">

                  AI Messages

                </span>

                <span className="text-sm font-semibold">

                  {stats.messages_used} / {stats.messages_limit}

                </span>

              </div>

              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7f5af0] to-blue-500"
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

            <div className="grid grid-cols-2 gap-3">

              <SimpleInfoCard
                label="Days Left"
                value={
                  stats.expired
                    ? "0"
                    : daysLeft
                }
                icon={Zap}
              />

              <SimpleInfoCard
                label="Chatbots"
                value={
                  stats.chatbots
                }
                icon={Bot}
              />

            </div>

            <Link
              to="/app/pricing"
              className="
                w-full
                h-12
                rounded-2xl
                bg-white
                text-black
                font-semibold
                flex
                items-center
                justify-center
                hover:opacity-90
                transition-all
              "
            >

              {stats.expired
                ? "Renew Subscription"
                : "Manage Subscription"}

            </Link>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="
          rounded-[30px]
          border
          border-white/[0.08]
          bg-gradient-to-br
          from-white/[0.05]
          to-white/[0.02]
          p-6
          shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        ">

          <div className="mb-5">

            <h2 className="text-2xl font-bold mb-2">

              Quick Actions

            </h2>

            <p className="text-sm text-gray-400">

              Easy shortcuts to manage your AI business.

            </p>

          </div>

          <div className="space-y-3">

            <ActionCard
              to="/app/builder"
              icon={Bot}
              title="Create AI Chatbot"
              desc="Build your chatbot in minutes"
              disabled={
                stats.expired
              }
            />

            <ActionCard
              to="/app/leads"
              icon={Users}
              title="View Leads"
              desc="See customer inquiries"
              disabled={false}
            />

            <ActionCard
              to="/app/integrations"
              icon={Phone}
              title="Connect WhatsApp"
              desc="Connect your social channels"
              disabled={false}
            />

            <ActionCard
              to="/app/pricing"
              icon={Crown}
              title="Manage Subscription"
              desc="Upgrade or renew your plan"
              disabled={false}
            />

          </div>

        </div>

      </div>

      {/* CHATBOTS */}
      <div className="
        rounded-[30px]
        border
        border-white/[0.08]
        bg-gradient-to-br
        from-white/[0.05]
        to-white/[0.02]
        p-6
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
      ">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold mb-1">

              Your Chatbots

            </h2>

            <p className="text-sm text-gray-400">

              Manage all your AI assistants here.

            </p>

          </div>

          <div className="
            px-4
            py-2
            rounded-xl
            bg-white/[0.04]
            border
            border-white/[0.06]
            text-sm
            text-gray-300
          ">

            {stats.chatbots} Total

          </div>

        </div>

        {chatbots.length === 0 ? (

          <div className="
            rounded-[26px]
            border
            border-dashed
            border-white/[0.08]
            p-10
            text-center
          ">

            <div className="
              w-16
              h-16
              rounded-3xl
              bg-gradient-to-br
              from-[#7f5af0]/20
              to-blue-500/10
              border
              border-white/[0.06]
              flex
              items-center
              justify-center
              mx-auto
              mb-5
            ">

              <Bot
                size={28}
                className="text-purple-300"
              />

            </div>

            <h3 className="text-xl font-semibold mb-2">

              No Chatbots Yet

            </h3>

            <p className="text-gray-400 text-sm mb-6">

              Create your first AI chatbot to start collecting leads and automating replies.

            </p>

            <Link
              to="/app/builder"
              className="
                inline-flex
                items-center
                gap-2
                px-5
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-[#7f5af0]
                to-blue-500
                font-semibold
                shadow-[0_10px_40px_rgba(127,90,240,0.35)]
              "
            >

              <Plus size={16} />

              Create Chatbot

            </Link>

          </div>

        ) : (

          <div className="space-y-3">

            {chatbots.map(
              (bot) => (

                <div
                  key={bot.id}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-[24px]
                    border
                    border-white/[0.08]
                    bg-white/[0.03]
                    p-4
                  "
                >

                  <div className="flex items-center gap-4">

                    <div className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-br
                      from-[#7f5af0]/20
                      to-blue-500/10
                      border
                      border-white/[0.06]
                      flex
                      items-center
                      justify-center
                    ">

                      <MessageSquare
                        size={18}
                        className="text-purple-300"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold">

                        {bot.bot_name ||
                          "AI Assistant"}

                      </h3>

                      <p className="text-sm text-gray-400">

                        Created on{" "}
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
                      w-11
                      h-11
                      rounded-2xl
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
                        size={16}
                      />
                    ) : (
                      <Trash2
                        size={16}
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
  title,
  desc,
  disabled,
}) {

  if (disabled) {

    return (

      <div className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-white/[0.06]
        bg-white/[0.03]
        p-4
        opacity-60
        cursor-not-allowed
      ">

        <div className="flex items-center gap-4">

          <div className="
            w-11
            h-11
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/[0.06]
            flex
            items-center
            justify-center
          ">

            <Lock size={17} />

          </div>

          <div>

            <h3 className="font-semibold text-sm">

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
      className="
        group
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        p-4
        hover:bg-white/[0.05]
        transition-all
      "
    >

      <div className="flex items-center gap-4">

        <div className="
          w-11
          h-11
          rounded-2xl
          bg-gradient-to-br
          from-[#7f5af0]/20
          to-blue-500/10
          border
          border-white/[0.06]
          flex
          items-center
          justify-center
        ">

          <Icon
            size={18}
            className="text-purple-300"
          />

        </div>

        <div>

          <h3 className="font-semibold text-sm">

            {title}

          </h3>

          <p className="text-xs text-gray-400">

            {desc}

          </p>

        </div>

      </div>

      <ArrowRight
        size={17}
        className="group-hover:translate-x-1 transition-all text-gray-400"
      />

    </Link>

  );
}

/*
========================================
SIMPLE INFO CARD
========================================
*/
function SimpleInfoCard({
  label,
  value,
  icon: Icon,
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-white/[0.08]
      bg-white/[0.03]
      p-4
    ">

      <div className="flex items-center justify-between mb-3">

        <p className="text-xs text-gray-400">

          {label}

        </p>

        <Icon
          size={15}
          className="text-purple-300"
        />

      </div>

      <h3 className="text-2xl font-bold">

        {value}

      </h3>

    </div>

  );
}