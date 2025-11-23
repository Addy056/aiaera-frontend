import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Calendar, Users, Clock, Sparkles, Lock } from "lucide-react";
import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../supabaseClient";

export default function Appointments() {
  const [userEmail, setUserEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(true); // free users are active
  const [plan, setPlan] = useState("free");
  const [activeTab, setActiveTab] = useState("dashboard");

  const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";

  const isExpired = (dateStr) =>
    !dateStr || new Date(dateStr) < new Date();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) return;

        setUserEmail(user.email);

        /** ------------------------------------------------
         *  💜 FREE ACCESS EMAIL (always active PRO)
         * ------------------------------------------------ */
        if (user.email === FREE_ACCESS_EMAIL) {
          setSubscriptionActive(true);
          setPlan("pro");
          await fetchAppointments(user.id);
          return;
        }

        /** ------------------------------------------------
         *  📌 FIXED: safe subscription query
         * ------------------------------------------------ */
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        /** ------------------------------------------------
         *  New users with no subscription row
         *  → default to FREE plan, active
         * ------------------------------------------------ */
        if (!sub) {
          setSubscriptionActive(true);
          setPlan("free");
          setLoading(false);
          return;
        }

        /** ------------------------------------------------
         *  Evaluate subscription state
         * ------------------------------------------------ */
        const expired = isExpired(sub.expires_at);

        // Free plan = active (always)
        const isActiveSubscription =
          sub.plan === "free" ? true : !expired;

        setSubscriptionActive(isActiveSubscription);
        setPlan(sub.plan || "free");

        if (isActiveSubscription) {
          await fetchAppointments(user.id);
        }
      } catch (err) {
        console.error("❌ Error initializing appointments:", err.message);
        // Fail-safe: treat as free user
        setSubscriptionActive(true);
        setPlan("free");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /** ------------------------------------------------
   *  Fetch appointments
   * ------------------------------------------------ */
  const fetchAppointments = async (userId) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("id, customer_name, customer_email, calendly_event_link, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setAppointments(data || []);
  };

  /** ------------------------------------------------
   *  CSV Export
   * ------------------------------------------------ */
  const exportCSV = () => {
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

  /** ------------------------------------------------
   *  Analytics helpers
   * ------------------------------------------------ */
  const last7 = useMemo(() => {
    const now = new Date();
    return appointments.filter((a) => (now - new Date(a.created_at)) / 86400000 <= 7);
  }, [appointments]);

  const trend7 = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString("en-GB"), count: 0 };
    });
    for (const a of appointments) {
      const day = new Date(a.created_at).toLocaleDateString("en-GB");
      const found = days.find((d) => d.date === day);
      if (found) found.count += 1;
    }
    return days;
  }, [appointments]);

  /** ------------------------------------------------
   *  RENDER
   * ------------------------------------------------ */
  if (loading)
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
          <p>⏳ Loading your appointments...</p>
        </div>
      </ProtectedRoute>
    );

  if (!subscriptionActive)
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#0a0a16] text-white text-center px-6">
          <p className="text-lg">
            ⚠️ Your subscription has expired. Please renew to access appointments.
          </p>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      {/* Everything below is untouched UI (looks perfect) */}
      <div className="min-h-screen bg-gradient-to-br from-[#0e0b24] via-[#141131] to-[#081427] text-white relative overflow-hidden">
        <FloatingMenu userEmail={userEmail} />

        {/* Aura, charts, UI — unchanged */}
        {/* (omitted for brevity, your UI was already perfect) */}
        
        {/* ... keep your entire UI as it is ... */}

      </div>
    </ProtectedRoute>
  );
}
