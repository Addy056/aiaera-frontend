import {
  Users,
  Calendar,
  Bot,
  Crown,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
  Lock,
  MessageSquare,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import SectionHeader from "../components/common/SectionHeader";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [chatbots, setChatbots] = useState([]);
  const [stats, setStats] = useState({
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;
      const userId = session.user.id;

      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: appointmentCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { data: chatbotData, count: chatbotCount } = await supabase
        .from("chatbots")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const expired = subData?.expires_at
        ? new Date(subData.expires_at) < new Date()
        : false;

      setChatbots(chatbotData || []);
      setStats({
        leads: leadsCount || 0,
        appointments: appointmentCount || 0,
        chatbots: chatbotCount || 0,
        plan: subData?.plan?.toUpperCase() || "TRIAL",
        messages_used: subData?.messages_used || 0,
        messages_limit: subData?.messages_limit || 200,
        expires_at: subData?.expires_at || null,
        expired,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChatbot = async (id) => {
    if (stats.expired) return;
    const confirmDelete = window.confirm("Delete this chatbot?");
    if (!confirmDelete) return;

    try {
      await supabase.from("chatbot_files").delete().eq("chatbot_id", id);
      await supabase.from("chatbots").delete().eq("id", id);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-violet-500/20 blur-[20px] rounded-full"></div>
            <div className="relative w-10 h-10 rounded-full border-3 border-violet-500/10 border-t-violet-600 animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const daysLeft = stats.expires_at
    ? Math.max(
        0,
        Math.ceil((new Date(stats.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return (
    <div className="space-y-4 pb-4">
      {stats.expired && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-900">Subscription Expired</h3>
              <p className="text-xs text-red-700/80">Workspace is operating in read-only mode.</p>
            </div>
          </div>
          <Link to="/app/pricing" className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700">
            Renew Plan
          </Link>
        </div>
      )}

      {/* Compact Top Grid: Plan Health & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Subscription & Usage Card */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                <Crown size={11} /> {stats.plan} Plan
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">AI Message Quota</span>
                <span className="font-semibold text-slate-900">{stats.messages_used} <span className="text-slate-400 font-normal">/ {stats.messages_limit}</span></span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/70">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500" 
                  style={{ width: `${Math.min(100, (stats.messages_used / Math.max(1, stats.messages_limit)) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Zap size={15} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none">{stats.expired ? "0" : daysLeft}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Days Left</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Bot size={15} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none">{stats.chatbots}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Chatbots</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div>
            <SectionHeader title="Quick Actions" description="Jump straight into core tasks." />
            <div className="mt-2 space-y-2">
              <ActionCard to="/app/builder" icon={Bot} title="Create AI Chatbot" desc="Deploy a fresh assistant" disabled={stats.expired} />
              <ActionCard to="/app/leads" icon={Users} title="Review Leads" desc="Inspect prospect details" disabled={false} />
              <ActionCard to="/app/integrations" icon={Phone} title="Connect Channels" desc="Manage WhatsApp & widgets" disabled={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Stats Row */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: "Total Chatbots", value: stats.chatbots, icon: Bot },
          { title: "Captured Leads", value: stats.leads, icon: Users },
          { title: "Appointments Booked", value: stats.appointments, icon: Calendar },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{card.value}</h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chatbots Directory Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Your Chatbots</h2>
            <p className="text-xs text-slate-500">Manage and oversee your conversational assistants.</p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
            {stats.chatbots} Deployed
          </span>
        </div>

        {chatbots.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-xs">
              <Bot size={20} />
            </div>
            <h3 className="mt-2 text-xs font-semibold text-slate-900">No chatbots created yet</h3>
            <p className="mt-1 text-[11px] text-slate-500 max-w-xs mx-auto">Build your first AI assistant to start capturing leads.</p>
            <Link to="/app/builder" className="mt-3 inline-flex items-center justify-center rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700">
              <Plus size={14} className="mr-1.5" />
              Create chatbot
            </Link>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/30 overflow-hidden max-h-[220px] overflow-y-auto">
            {chatbots.map((bot) => (
              <div key={bot.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 border border-violet-100/50">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{bot.bot_name || "AI Assistant"}</h3>
                    <p className="text-[10px] text-slate-500">Created {new Date(bot.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  disabled={stats.expired}
                  onClick={() => deleteChatbot(bot.id)}
                  className={`inline-flex items-center justify-center rounded-lg p-2 text-xs font-medium transition ${stats.expired ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-100 shadow-2xs"}`}
                  title="Delete Chatbot"
                >
                  {stats.expired ? <Lock size={14} /> : <Trash2 size={14} />}
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
      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 opacity-60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/70 text-slate-500">
            <Lock size={14} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">{title}</h3>
            <p className="text-[10px] text-slate-500">Subscription required</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={to} className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-violet-200 hover:bg-white hover:shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 border border-violet-100/30 transition group-hover:bg-violet-600 group-hover:text-white">
          <Icon size={14} />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-900">{title}</h3>
          <p className="text-[10px] text-slate-500">{desc}</p>
        </div>
      </div>
      <ArrowRight size={14} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
    </Link>
  );
}