import {
  Search,
  Download,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Sparkles,
  Crown,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Leads() {

  const { user, loading: authLoading } = useContext(AuthContext);

  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isSubscribed, setIsSubscribed] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);

  // 🔥 INIT
  useEffect(() => {
    if (!user) return;

    fetchLeads();

    // 🔥 REALTIME
    const channel = supabase
      .channel("realtime-leads")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [user]);

  // 🔥 SEARCH FILTER
  useEffect(() => {

    const filtered = leads.filter((lead) =>
      `${lead.name} ${lead.email} ${lead.message}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredLeads(filtered);

  }, [search, leads]);

  // 🔥 FETCH
  const fetchLeads = async () => {

    try {

      setLoading(true);

      // 🔥 CHECK SUB
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (
        sub?.expires_at &&
        new Date(sub.expires_at) < new Date()
      ) {
        setIsSubscribed(false);
      } else {
        setIsSubscribed(true);
      }

      // 🔥 FETCH LEADS
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      setFilteredLeads(data || []);

    } catch (err) {
      console.error("Leads Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CSV EXPORT
  const exportCSV = () => {

    if (!isSubscribed || filteredLeads.length === 0) return;

    const headers = ["Name", "Email", "Message", "Date"];

    const rows = filteredLeads.map((lead) => [
      lead.name || "",
      lead.email || "",
      lead.message || "",
      new Date(lead.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);

    link.setAttribute("download", "aiaera-leads.csv");

    document.body.appendChild(link);

    link.click();
  };

  // 🔥 LOADING
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-5"></div>

          <p className="text-gray-400">
            Loading leads...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="text-white min-h-screen relative">

      {/* BG GLOW */}
      <div className="fixed top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="fixed bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        <div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-5">

            <Sparkles className="w-4 h-4 text-purple-400" />

            <span className="text-sm text-gray-300">
              AI Lead Management
            </span>

          </div>

          <h1 className="text-5xl font-black mb-3">
            Leads Dashboard
          </h1>

          <p className="text-gray-400 text-lg">
            Manage and monitor all captured customer leads.
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={fetchLeads}
            className="h-[56px] px-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3"
          >

            <RefreshCw size={18} />

            Refresh

          </button>

          <button
            onClick={exportCSV}
            disabled={!isSubscribed || filteredLeads.length === 0}
            className={`h-[56px] px-7 rounded-2xl font-semibold flex items-center gap-3 transition-all ${
              isSubscribed
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.03] shadow-lg shadow-purple-500/20"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >

            <Download size={18} />

            Export CSV

          </button>

        </div>

      </div>

      {/* SUB WARNING */}
      {!isSubscribed && (

        <div className="mb-8 p-6 rounded-[28px] border border-red-500/20 bg-red-500/10 backdrop-blur-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Crown className="text-red-400" />
            </div>

            <div>

              <h3 className="text-2xl font-bold mb-2">
                Subscription Required
              </h3>

              <p className="text-red-200/80">
                Upgrade your plan to unlock lead management and exports.
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/app/pricing")}
            className="px-7 py-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-all font-semibold"
          >
            Upgrade Plan
          </button>

        </div>

      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <StatCard
          icon={<Users />}
          title="Total Leads"
          value={filteredLeads.length}
          color="from-purple-600 to-indigo-600"
        />

        <StatCard
          icon={<Mail />}
          title="Emails Collected"
          value={
            filteredLeads.filter((l) => l.email).length
          }
          color="from-blue-600 to-cyan-600"
        />

        <StatCard
          icon={<MessageSquare />}
          title="Messages"
          value={
            filteredLeads.filter((l) => l.message).length
          }
          color="from-pink-600 to-red-600"
        />

      </div>

      {/* SEARCH */}
      <div className="mb-8">

        <div className="relative">

          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[64px] rounded-3xl bg-white/5 border border-white/10 pl-14 pr-6 text-white placeholder-gray-500 outline-none focus:border-purple-500 backdrop-blur-2xl"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden">

        <div className="flex items-center justify-between p-8 border-b border-white/10">

          <div>

            <h2 className="text-2xl font-black mb-2">
              All Leads
            </h2>

            <p className="text-gray-400">
              {filteredLeads.length} total leads found
            </p>

          </div>

        </div>

        {!isSubscribed ? (

          <div className="p-24 text-center">

            <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">

              <Crown className="text-red-400" size={32} />

            </div>

            <h3 className="text-3xl font-black mb-3">
              Leads Locked
            </h3>

            <p className="text-gray-400 mb-8">
              Upgrade your subscription to access customer leads.
            </p>

          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="p-24 text-center">

            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">

              <Users className="text-gray-400" size={32} />

            </div>

            <h3 className="text-3xl font-black mb-3">
              No Leads Yet
            </h3>

            <p className="text-gray-400">
              Leads captured by your chatbot will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/10">

                <tr className="text-left text-gray-400 text-sm">

                  <th className="p-6">Name</th>

                  <th className="p-6">Email</th>

                  <th className="p-6">Message</th>

                  <th className="p-6">Date</th>

                  <th className="p-6">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredLeads.map((lead) => (

                  <tr
                    key={lead.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-all"
                  >

                    <td className="p-6 font-semibold">
                      {lead.name || "Unknown"}
                    </td>

                    <td className="p-6 text-gray-300">
                      {lead.email || "-"}
                    </td>

                    <td className="p-6 text-gray-400 max-w-[300px] truncate">
                      {lead.message || "-"}
                    </td>

                    <td className="p-6 text-gray-500 text-sm">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>

                    <td className="p-6">

                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                      >

                        <Eye size={18} />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      {selectedLead && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">

          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0B1020] p-8 relative">

            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >

              <X size={18} />

            </button>

            <h2 className="text-3xl font-black mb-8">
              Lead Details
            </h2>

            <div className="space-y-6">

              <DetailItem
                icon={<Users />}
                label="Name"
                value={selectedLead.name}
              />

              <DetailItem
                icon={<Mail />}
                label="Email"
                value={selectedLead.email}
              />

              <DetailItem
                icon={<MessageSquare />}
                label="Message"
                value={selectedLead.message}
              />

              <DetailItem
                icon={<Calendar />}
                label="Created"
                value={new Date(
                  selectedLead.created_at
                ).toLocaleString()}
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* 🔥 STAT CARD */
function StatCard({ icon, title, value, color }) {

  return (
    <div className={`relative overflow-hidden rounded-[30px] p-7 bg-gradient-to-br ${color} shadow-xl`}>

      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-white/10 rounded-full"></div>

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-white/70 text-sm mb-3">
            {title}
          </p>

          <h2 className="text-5xl font-black mb-2">
            {value}
          </h2>

        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* 🔥 DETAIL ITEM */
function DetailItem({ icon, label, value }) {

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

      <div className="flex items-center gap-4 mb-3">

        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          {icon}
        </div>

        <div>

          <p className="text-gray-400 text-sm">
            {label}
          </p>

          <h3 className="font-semibold text-lg">
            {value || "-"}
          </h3>

        </div>

      </div>

    </div>
  );
}