import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Leads() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

  // =============================
  // INIT
  // =============================
  useEffect(() => {
    if (!user) return;
    init();
  }, [user]);

  const init = async () => {
    try {
      // CHECK SUBSCRIPTION
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!sub || new Date(sub.expires_at) < new Date()) {
        setIsSubscribed(false);
      } else {
        setIsSubscribed(true);
      }

      // FETCH LEADS (still fetch for UI consistency)
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // =============================
  // CSV EXPORT
  // =============================
  const exportCSV = () => {
    if (!isSubscribed) return;

    const headers = ["Name", "Email", "Message", "Date"];

    const escapeCSV = (value) =>
      `"${String(value || "").replace(/"/g, '""')}"`;

    const rows = leads.map((lead) => [
      escapeCSV(lead.name),
      escapeCSV(lead.email),
      escapeCSV(lead.message),
      escapeCSV(new Date(lead.created_at).toLocaleString()),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "leads.csv";
    document.body.appendChild(link);
    link.click();
  };

  if (authLoading || loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading leads...
      </div>
    );
  }

  return (
    <div>

      {/* 🔴 UPGRADE BANNER */}
      {!isSubscribed && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex justify-between items-center">
          <p className="text-sm text-red-300">
            Upgrade your plan to view and export leads
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Leads</h2>
          <p className="text-gray-400 mt-2">
            Manage and track your customer leads
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={!isSubscribed || leads.length === 0}
          className={`px-6 py-2 rounded-xl ${
            isSubscribed
              ? "bg-gradient-to-r from-[#7f5af0] to-[#9f7aea]"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubscribed ? "Export CSV" : "Upgrade Required"}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold">All Leads</h3>
          <span className="text-sm text-gray-400">
            {leads.length} total
          </span>
        </div>

        {/* LOCKED STATE */}
        {!isSubscribed ? (
          <div className="p-20 text-center text-gray-400">
            🔒 Upgrade to view your leads
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="text-gray-400 text-sm border-b border-white/10">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 font-medium">
                        {lead.name || "Unknown"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {lead.email || "-"}
                      </td>

                      <td className="p-4 text-gray-300 max-w-xs truncate">
                        {lead.message || "-"}
                      </td>

                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
}