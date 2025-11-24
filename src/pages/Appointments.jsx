// src/pages/Appointments.jsx

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, Sparkles, Lock } from "lucide-react";
import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

export default function Appointments() {
  const [userEmail, setUserEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subscriptionActive, setSubscriptionActive] = useState(true); // FREE users allowed
  const [plan, setPlan] = useState("free");

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";

  const isExpired = (dateStr) =>
    !dateStr || new Date(dateStr) < new Date();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) return;
        setUserEmail(user.email);

        // -----------------------------------------------
        // FREE ACCESS EMAIL (always PRO)
        // -----------------------------------------------
        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          setPlan("pro");
          await fetchAppointments(user.id);
          setLoading(false);
          return;
        }

        // -----------------------------------------------
        // CHECK SUBSCRIPTION
        // -----------------------------------------------
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (!sub) {
          // No subscription rows → user is FREE PLAN but can still access UI
          setSubscriptionActive(true);
          setPlan("free");
          setLoading(false);
          return;
        }

        const expired = isExpired(sub.expires_at);

        const active =
          sub.plan === "free" ? true : !expired;

        setSubscriptionActive(active);
        setPlan(sub.plan || "free");

        if (active) {
          await fetchAppointments(user.id);
        }
      } catch (err) {
        console.error("Error loading appointments:", err.message);
        setSubscriptionActive(true); // fallback
        setPlan("free");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // -----------------------------------------------
  // Fetch Appointments
  // -----------------------------------------------
  const fetchAppointments = async (userId) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("id, customer_name, customer_email, calendly_event_link, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setAppointments(data || []);
  };

  // -----------------------------------------------
  // CSV Export (only for PRO)
  // -----------------------------------------------
  const exportCSV = () => {
    if (plan !== "pro") return alert("Upgrade to Pro to export appointments.");
    if (!appointments.length) return alert("No appointments to export.");

    const headers = ["Name", "Email", "Calendly Link", "Date"];
    const rows = appointments.map((a) => [
      a.customer_name,
      a.customer_email,
      a.calendly_event_link,
      new Date(a.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
  };

  // -----------------------------------------------
  // Analytics – PRO only
  // -----------------------------------------------
  const last7 = useMemo(() => {
    if (plan !== "pro") return [];
    const now = new Date();
    return appointments.filter((a) => (now - new Date(a.created_at)) / 86400000 <= 7);
  }, [appointments, plan]);

  // -----------------------------------------------
  // LOADING UI
  // -----------------------------------------------
  if (loading)
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
          <p>⏳ Loading your appointments...</p>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0e0b24] via-[#141131] to-[#081427] text-white relative overflow-hidden">
        <FloatingMenu userEmail={userEmail} />

        {/* --------------------------------------------- */}
        {/* HEADER */}
        {/* --------------------------------------------- */}
        <div className="p-6 sm:p-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#b892ff] to-[#6be7ff] text-transparent bg-clip-text">
            Appointments
          </h1>
          <p className="text-gray-300 mt-2">
            View all bookings made via your AI assistant.
          </p>
        </div>

        {/* --------------------------------------------- */}
        {/* CONTENT WRAPPER */}
        {/* --------------------------------------------- */}
        <div className="px-6 sm:px-10">

          {/* --------------------------------------------- */}
          {/* TABLE HEADERS (Visible for ALL users) */}
          {/* --------------------------------------------- */}
          <div className="grid grid-cols-4 gap-4 py-3 border-b border-white/10 text-gray-300 text-sm uppercase tracking-wider">
            <div>Name</div>
            <div>Email</div>
            <div>Event</div>
            <div>Date</div>
          </div>

          {/* --------------------------------------------- */}
          {/* PRO: REAL DATA */}
          {/* FREE: LOCKED ROWS */}
          {/* --------------------------------------------- */}
          <div className="mt-4 flex flex-col gap-3">
            {appointments.length === 0 ? (
              <p className="text-gray-400 mt-4">No appointments yet.</p>
            ) : (
              appointments.map((a, idx) => (
                <div
                  key={a.id}
                  className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  {plan === "pro" ? (
                    <>
                      <div>{a.customer_name}</div>
                      <div>{a.customer_email}</div>
                      <div className="truncate">{a.calendly_event_link}</div>
                      <div>{new Date(a.created_at).toLocaleString()}</div>
                    </>
                  ) : (
                    <>
                      <LockedCell />
                      <LockedCell />
                      <LockedCell />
                      <LockedCell />
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* --------------------------------------------- */}
          {/* EXPORT BUTTON */}
          {/* --------------------------------------------- */}
          <div className="mt-8">
            <button
              onClick={exportCSV}
              className="px-6 py-3 rounded-xl bg-[#7f5af0] hover:bg-[#9b7ff7] transition-all shadow-lg"
            >
              Export CSV (Pro Only)
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* --------------------------------------------- */
/* LOCKED CELL COMPONENT */
/* --------------------------------------------- */
function LockedCell() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Lock className="w-4 h-4" />
      <span className="blur-sm select-none">Locked</span>
    </div>
  );
}
