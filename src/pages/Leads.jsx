// src/pages/Appointments.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { Download } from "lucide-react";

const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
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

  const init = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("Authentication error. Please sign in.");
        setLoading(false);
        return;
      }
      setUserEmail(user.email);

      if (user.email === "aiaera056@gmail.com") {
        setSubscriptionActive(true);
        await fetchAppointments(user.id);
        setLoading(false);
        return;
      }

      const { data: subscription, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (subErr) throw subErr;
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
          { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${user.id}` },
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
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (mountedRef.current) setAppointments(data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      if (mountedRef.current) setError("Failed to fetch appointments.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!appointments.length) return;
    const headers = ["Name", "Email", "Calendly Link", "Date"];
    const rows = appointments.map((appt) => [
      appt.customer_name || "",
      appt.customer_email || "",
      appt.calendly_event_link || "",
      appt.created_at ? new Date(appt.created_at).toLocaleString() : "",
    ]);
    const csvContent = "\uFEFF" + [headers, ...rows]
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

  const filteredAppointments = useMemo(() => {
    const q = search.toLowerCase();
    return appointments.filter(
      (appt) =>
        appt.customer_name?.toLowerCase().includes(q) ||
        appt.customer_email?.toLowerCase().includes(q) ||
        appt.calendly_event_link?.toLowerCase().includes(q)
    );
  }, [appointments, search]);

  if (!subscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white p-8">
        <h1 className="text-5xl font-bold mb-4 text-center">Subscription Expired 🚫</h1>
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

  const newAppointmentsThisWeek = appointments.filter(
    (a) => a.created_at && new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="relative min-h-screen p-4 sm:p-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-purple-950 animate-gradient"></div>
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 text-white">
        {/* Header */}
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-[0_0_60px_rgba(127,90,240,0.35)] transition-all transform hover:scale-[1.01]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00eaff] via-[#7afcff] to-[#0077b6] bg-clip-text text-transparent drop-shadow-xl">
            Appointments Dashboard
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">
            Track and manage all your scheduled appointments in one place ✨
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard title="Total Appointments" value={appointments.length} gradient="from-[#ffd780]/40 to-[#ffb800]/25" />
          <StatCard title="New This Week" value={newAppointmentsThisWeek} gradient="from-[#00eaff]/40 to-[#0077b6]/25" />
          <StatCard title="Links Clicked" value="24%" gradient="from-[#7afcff]/40 to-[#00b3b3]/25" />
        </div>

        {/* Search + Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00eaff] shadow-inner transition-all"
          />
          <button
            onClick={exportCSV}
            disabled={!appointments.length}
            className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00eaff]/40 via-[#7afcff]/30 to-[#0077b6]/40 text-white font-semibold shadow-lg hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 hover:shadow-[0_25px_60px_rgba(0,245,255,0.25)] transform hover:scale-[1.01] transition-all text-white">
          {loading ? (
            <div className="p-6 sm:p-8 text-center text-gray-300 animate-pulse">Fetching appointments...</div>
          ) : error ? (
            <div className="p-6 sm:p-8 text-center text-red-400">{error}</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-300">No appointments yet 🚀</div>
          ) : (
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="bg-gradient-to-r from-[#00eaff]/20 to-[#7afcff]/20">
                  <th className="p-3 sm:p-4 font-semibold">Name</th>
                  <th className="p-3 sm:p-4 font-semibold">Email</th>
                  <th className="p-3 sm:p-4 font-semibold">Calendly Link</th>
                  <th className="p-3 sm:p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt, idx) => (
                  <tr
                    key={appt.id || idx}
                    className={`transition-all duration-300 ${idx % 2 === 0 ? "bg-white/5" : "bg-transparent"} hover:bg-gradient-to-r hover:from-[#7f5af0]/20 hover:to-[#00eaff]/20 hover:scale-[1.01]`}
                  >
                    <td className="p-3 sm:p-4">{appt.customer_name || "—"}</td>
                    <td className="p-3 sm:p-4">{appt.customer_email || "—"}</td>
                    <td className="p-3 sm:p-4 break-all">
                      <a
                        href={appt.calendly_event_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00eaff] hover:underline"
                      >
                        {appt.calendly_event_link ? "View Link" : "—"}
                      </a>
                    </td>
                    <td className="p-3 sm:p-4">{appt.created_at ? new Date(appt.created_at).toLocaleString() : "—"}</td>
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
      className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-tr ${gradient} border border-white/10 backdrop-blur-xl shadow-lg hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(0,245,255,0.35)] transition-all text-white`}
    >
      <h2 className="text-gray-200 text-sm sm:text-base font-semibold">{title}</h2>
      <p className="text-2xl sm:text-3xl font-extrabold mt-2">{value}</p>
    </div>
  );
}
