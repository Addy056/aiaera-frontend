import { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
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

      // FETCH APPOINTMENTS
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // LOADING
  // =============================
  if (authLoading || loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading appointments...
      </div>
    );
  }

  return (
    <div>

      {/* 🔴 UPGRADE BANNER */}
      {!isSubscribed && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex justify-between items-center">
          <p className="text-sm text-red-300">
            Upgrade your plan to view and manage appointments
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
      <div className="mb-10">
        <h2 className="text-3xl font-bold">Appointments</h2>
        <p className="text-gray-400 mt-2">
          All booked meetings from your chatbot
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

        {/* TOP BAR */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold">All Appointments</h3>

          <span className="text-sm text-gray-400">
            {appointments.length} total
          </span>
        </div>

        {/* LOCKED STATE */}
        {!isSubscribed ? (
          <div className="p-20 text-center text-gray-400">
            🔒 Upgrade to access appointments
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="text-gray-400 text-sm border-b border-white/10">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Meeting</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <tr
                      key={appt.id}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="p-4 font-medium">
                        {appt.customer_name || "Unknown"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {appt.customer_email || "-"}
                      </td>

                      <td className="p-4">
                        {appt.calendly_event_link ? (
                          <a
                            href={appt.calendly_event_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-400 hover:underline font-medium"
                          >
                            View Meeting
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not available
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(appt.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">
                      No appointments yet
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