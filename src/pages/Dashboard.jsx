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
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import PageHeader from "../components/common/PageHeader";
import SectionHeader from "../components/common/SectionHeader";

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
    <div className="space-y-6">
      {stats.expired && (
        <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-700">Subscription Expired</h3>
              <p className="mt-1 text-sm leading-6 text-red-600/80">Your workspace is in read-only mode until renewal.</p>
            </div>
          </div>
          <Link to="/app/pricing" className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
            Renew Plan
          </Link>
        </div>
      )}

      <PageHeader
        eyebrow="Workspace overview"
        title={stats.expired ? "Your workspace needs a quick refresh" : "Keep your business automation moving."}
        description="Review your assistants, leads, appointments, and plan health from one streamlined view."
        actionLabel="Open Builder"
        actionTo="/app/builder"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Current plan</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{stats.plan}</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Crown size={18} />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>AI messages</span>
              <span className="font-medium text-slate-900">{stats.messages_used} / {stats.messages_limit}</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-violet-600" style={{ width: `${Math.min(100, (stats.messages_used / Math.max(1, stats.messages_limit)) * 100)}%` }} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SimpleInfoCard label="Days left" value={stats.expired ? "0" : daysLeft} icon={Zap} />
            <SimpleInfoCard label="Chatbots" value={stats.chatbots} icon={Bot} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Quick actions" description="Move through the most common tasks without friction." />
            <div className="mt-4 space-y-3">
              <ActionCard to="/app/builder" icon={Bot} title="Create AI chatbot" desc="Build your chatbot in minutes" disabled={stats.expired} />
              <ActionCard to="/app/leads" icon={Users} title="Review leads" desc="See the latest customer inquiries" disabled={false} />
              <ActionCard to="/app/integrations" icon={Phone} title="Connect channels" desc="Wire up WhatsApp and other tools" disabled={false} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Snapshot</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">This week at a glance</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BarChart3 size={18} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{stats.leads}</p>
                <p className="mt-1 text-sm text-slate-600">Leads captured</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{stats.appointments}</p>
                <p className="mt-1 text-sm text-slate-600">Appointments booked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon size={18} />
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.title}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Your chatbots</h2>
            <p className="mt-1 text-sm text-slate-600">Keep your assistants organized and ready to respond.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">{stats.chatbots} total</div>
        </div>

        {chatbots.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Bot size={24} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No chatbots yet</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create your first AI assistant to start capturing leads and booking appointments.</p>
            <Link to="/app/builder" className="mt-5 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
              <Plus size={16} className="mr-2" />
              Create chatbot
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {chatbots.map((bot) => (
              <div key={bot.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{bot.bot_name || "AI Assistant"}</h3>
                    <p className="text-sm text-slate-600">Created on {new Date(bot.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  disabled={stats.expired}
                  onClick={() => deleteChatbot(bot.id)}
                  className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition ${stats.expired ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-white text-red-600 hover:bg-red-50"}`}
                >
                  {stats.expired ? <Lock size={16} /> : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc, disabled }) {
  if (disabled) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Lock size={16} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">Subscription expired</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={to} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={16} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{desc}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5" />
    </Link>
  );
}

function SimpleInfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{label}</p>
        <Icon size={15} className="text-violet-600" />
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900">{value}</h3>
    </div>
  );
}