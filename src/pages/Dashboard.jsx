import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leadsCount, setLeadsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [plan, setPlan] = useState("Free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { count: leads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: appointments } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setLeadsCount(leads || 0);
      setAppointmentsCount(appointments || 0);
      setPlan(sub?.plan || "Free");

    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-400 mt-2">
          Overview of your AI chatbot performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <StatCard
          title="Total Leads"
          value={leadsCount}
          color="from-purple-600 to-indigo-600"
        />

        <StatCard
          title="Appointments"
          value={appointmentsCount}
          color="from-green-500 to-emerald-600"
        />

        <StatCard
          title="Active Chats"
          value={leadsCount * 2}
          color="from-pink-500 to-red-500"
        />

        <StatCard
          title="Plan"
          value={plan}
          color="from-blue-500 to-cyan-600"
        />

      </div>

      {/* ACTION CARDS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div
          onClick={() => navigate("/builder")}
          className="cursor-pointer bg-gradient-to-r from-[#7f5af0] to-[#9f7aea] p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition"
        >
          <h3 className="text-xl font-semibold">Build Chatbot</h3>
          <p className="mt-2 text-sm text-white/80">
            Create or update your AI assistant
          </p>
        </div>

        <div
          onClick={() => navigate("/leads")}
          className="cursor-pointer bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:scale-[1.02] transition"
        >
          <h3 className="text-xl font-semibold">View Leads</h3>
          <p className="text-gray-400 mt-2">
            Manage and track customer leads
          </p>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT ACTIVITY */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

          {leadsCount === 0 ? (
            <p className="text-gray-400">
              No activity yet. Start building your chatbot 🚀
            </p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-300">
              <li>New lead captured</li>
              <li>Appointment booked</li>
              <li>Chatbot interacted with users</li>
            </ul>
          )}
        </div>

        {/* PERFORMANCE */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Performance</h3>

          <div className="space-y-3 text-sm text-gray-300">
            <p>Conversion Rate: 32%</p>
            <p>Response Time: Instant</p>
            <p>Engagement: High</p>
          </div>
        </div>

      </div>

    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ title, value, color }) {
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}>
      <p className="text-sm text-white/80">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}