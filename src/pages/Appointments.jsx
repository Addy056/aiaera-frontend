// src/pages/Appointments.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { Download } from "lucide-react";

const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const mountedRef = useRef(false);
  const realtimeChannelRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    const { data: authListener } = supabase.auth.onAuthStateChange(() => init());
    init();
    return () => {
      mountedRef.current = false;
      if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(appointments);
    setFiltered(
      appointments.filter(
        (a) =>
          (a.customer_name || "").toLowerCase().includes(q) ||
          (a.customer_email || "").toLowerCase().includes(q) ||
          (a.calendly_event_link || "").toLowerCase().includes(q)
      )
    );
  }, [appointments, search]);

  const init = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("Authentication error. Please sign in.");
        setLoading(false);
        return;
      }
      setUserEmail(user.email);

      if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
        setSubscriptionActive(true);
        await fetchAppointments(user.id);
        setLoading(false);
        return;
      }

      const { data: subscription, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", user.id)
        .single();

      if (subErr && subErr.code !== "PGRST116") throw subErr;
      if (!subscription || isExpired(subscription.expires_at)) {
        setSubscriptionActive(false);
        setLoading(false);
        return;
      }

      setSubscriptionActive(true);
      await fetchAppointments(user.id);

      const channel = supabase
        .channel(`appointments_user_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "appointments",
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchAppointments(user.id)
        )
        .subscribe();
      realtimeChannelRef.current = channel;
    } catch (err) {
      console.error("Init error:", err);
      if (mountedRef.current) setError("Failed to load appointments.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const fetchAppointments = async (userId) => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!mountedRef.current) return;
      setAppointments(data || []);
      setFiltered(data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      if (mountedRef.current) setError("Failed to fetch appointments.");
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Calendly Link", "Date"];
    const rows = (filtered.length ? filtered : appointments).map((appt) => [
      appt.customer_name ?? "",
      appt.customer_email ?? "",
      appt.calendly_event_link ?? "",
      appt.created_at ? new Date(appt.created_at).toLocaleString() : "",
    ]);
    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "appointments.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!subscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white p-8">
        <h1 className="text-5xl font-bold mb-4">Subscription Expired 🚫</h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          Your subscription has expired. Please renew to access the Appointments Dashboard.
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
    <div className="relative min-h-screen p-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-purple-950 animate-gradient"></div>
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 text-white">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(127,90,240,0.6)] hover:shadow-[0_0_70px_rgba(127,90,240,0.9)] transition-all transform hover:scale-[1.01]">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-xl">
            Appointments Dashboard
          </h1>
          <p className="mt-2 text-gray-300">
            Track and manage all your scheduled appointments in one place ✨
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-700/30 to-purple-900/30 border border-purple-500/30 backdrop-blur-lg shadow-xl hover:scale-105 transition-all transform">
            <h2 className="text-gray-300 text-sm">Total Appointments</h2>
            <p className="text-3xl font-bold mt-2">{appointments.length}</p>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-700/30 to-pink-900/30 border border-pink-500/30 backdrop-blur-lg shadow-xl hover:scale-105 transition-all transform">
            <h2 className="text-gray-300 text-sm">New This Week</h2>
            <p className="text-3xl font-bold mt-2">
              {
                appointments.filter(
                  (a) =>
                    new Date(a.created_at) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-700/30 to-blue-900/30 border border-blue-500/30 backdrop-blur-lg shadow-xl hover:scale-105 transition-all transform">
            <h2 className="text-gray-300 text-sm">Links Clicked</h2>
            <p className="text-3xl font-bold mt-2">24%</p>
          </div>
        </div>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner transition-all"
          />
          <button
            onClick={exportCSV}
            disabled={loading || appointments.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold shadow-[0_0_20px_rgba(127,90,240,0.5)] hover:shadow-[0_0_35px_rgba(127,90,240,0.8)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Appointments Table / Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-6 text-center text-gray-300 animate-pulse">
              Loading appointments...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-300">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-300">
              No appointments found 🚀
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-[0_25px_60px_rgba(127,90,240,0.6)] transform hover:scale-[1.01] transition-all">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-700/40 to-purple-900/40">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Calendly Link</th>
                      <th className="p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt) => (
                      <tr
                        key={appt.id}
                        className="border-t border-white/10 hover:bg-purple-500/10 transition"
                      >
                        <td className="p-4">{appt.customer_name}</td>
                        <td className="p-4">{appt.customer_email}</td>
                        <td className="p-4">
                          <a
                            href={appt.calendly_event_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline"
                          >
                            View
                          </a>
                        </td>
                        <td className="p-4">
                          {appt.created_at
                            ? new Date(appt.created_at).toLocaleString()
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {filtered.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-semibold">Name:</span>
                      <span>{appt.customer_name}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-300 font-semibold">Email:</span>
                      <span>{appt.customer_email}</span>
                    </div>
                    <div className="flex justify-between mt-2 break-all">
                      <span className="text-gray-300 font-semibold">Calendly:</span>
                      <a
                        href={appt.calendly_event_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline"
                      >
                        View
                      </a>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-300 font-semibold">Date:</span>
                      <span>
                        {appt.created_at
                          ? new Date(appt.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .animate-gradient { background-size: 400% 400%; animation: gradientShift 15s ease infinite; }
        @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        .animate-pulse-slow { animation: pulse 10s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
