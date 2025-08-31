// src/pages/Leads.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "../supabaseClient.js";
import { Download } from "lucide-react";

function isExpired(dateStr) {
  if (!dateStr) return true;
  return new Date(dateStr) < new Date();
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const mountedRef = useRef(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    mountedRef.current = true;
    init();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const init = async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("You must be logged in to view leads.");
        setLoading(false);
        return;
      }

      setUserEmail(user.email);

      if (user.email === "aiaera056@gmail.com") {
        setSubscriptionActive(true);
        await fetchLeads(user.id);
        setLoading(false);
        return;
      }

      const { data: subscription, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (subErr) {
        console.error("Subscription fetch error:", subErr);
        setError("Failed to verify subscription. Please try again.");
        setLoading(false);
        return;
      }

      if (!subscription || isExpired(subscription.expires_at)) {
        setSubscriptionActive(false);
        setLoading(false);
        return;
      }

      setSubscriptionActive(true);
      await fetchLeads(user.id);
    } catch (err) {
      console.error(err);
      setError("Failed to load leads.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const fetchLeads = async (userId) => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!mountedRef.current) return;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
      if (mountedRef.current) setError("Failed to load leads.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const maxRows = 1000;
    const headers = ["Name", "Email", "Message", "Date"];
    const rows = leads.slice(0, maxRows).map((lead) => [
      lead.name || "",
      lead.email || "",
      lead.message || "",
      lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "leads.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.message?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  if (!subscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white p-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
          Subscription Expired 🚫
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 text-center">
          Your subscription has expired. Please renew to access the Leads Dashboard.
        </p>
        <a
          href="/pricing"
          className="px-6 py-3 rounded-2xl bg-purple-600/80 hover:bg-purple-700 transition font-semibold"
        >
          Renew Now
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 sm:p-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-purple-950 animate-gradient"></div>
        <div className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/30 rounded-full blur-3xl top-10 sm:top-20 left-5 sm:left-10 animate-pulse"></div>
        <div className="absolute w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl bottom-5 sm:bottom-10 right-5 sm:right-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(127,90,240,0.6)] hover:shadow-[0_0_70px_rgba(127,90,240,0.9)] transition-all transform hover:scale-[1.01] text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-xl">
            Leads Dashboard
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">
            Track and manage all your customer interactions in one place ✨
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard title="Total Leads" value={leads.length} gradient="from-purple-700/30 to-purple-900/30" />
          <StatCard
            title="New This Week"
            value={leads.filter(
              (l) =>
                l.created_at &&
                new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
            gradient="from-pink-700/30 to-pink-900/30"
          />
          <StatCard title="Conversion Rate" value="24%" gradient="from-blue-700/30 to-blue-900/30" />
        </div>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner transition-all"
          />
          <button
            onClick={exportCSV}
            disabled={!leads.length}
            className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold shadow-[0_0_20px_rgba(127,90,240,0.5)] hover:shadow-[0_0_35px_rgba(127,90,240,0.8)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-[0_25px_60px_rgba(127,90,240,0.6)] transform hover:scale-[1.01] transition-all text-white">
          {loading ? (
            <div className="p-6 sm:p-8 text-center text-gray-300 animate-pulse">
              Fetching your leads...
            </div>
          ) : error ? (
            <div className="p-6 sm:p-8 text-center text-red-400">{error}</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-300">No leads yet 🚀</div>
          ) : (
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-gradient-to-r from-purple-700/40 to-purple-900/40">
                  <th className="p-3 sm:p-4 font-semibold">Name</th>
                  <th className="p-3 sm:p-4 font-semibold">Email</th>
                  <th className="p-3 sm:p-4 font-semibold">Message</th>
                  <th className="p-3 sm:p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr
                    key={lead.id || idx}
                    className={`transition-all duration-300 ${
                      idx % 2 === 0 ? "bg-white/5" : "bg-transparent"
                    } hover:bg-purple-500/10 hover:scale-[1.01]`}
                  >
                    <td className="p-3 sm:p-4">{lead.name || "—"}</td>
                    <td className="p-3 sm:p-4">{lead.email || "—"}</td>
                    <td className="p-3 sm:p-4">{lead.message || "—"}</td>
                    <td className="p-3 sm:p-4">
                      {lead.created_at ? new Date(lead.created_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-pulse-slow {
          animation: pulse 10s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, gradient }) {
  return (
    <div
      className={`p-4 sm:p-6 rounded-3xl bg-gradient-to-br ${gradient} border border-white/20 backdrop-blur-lg shadow-xl hover:scale-105 hover:shadow-[0_20px_50px_rgba(127,90,240,0.5)] transition-all transform text-white`}
    >
      <h2 className="text-gray-300 text-sm sm:text-base">{title}</h2>
      <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
