import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  Calendar,
  Crown,
  Loader2,
  Sparkles,
  ExternalLink,
  Users,
  Video,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

export default function Appointments() {

  const {
    user,
    loading: authLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  /*
  ========================================
  ADMIN EMAILS
  ========================================
  */

  const ADMIN_EMAILS = [
    "dhawaleaditya077@gmail.com",
  ];

  const isAdmin =
    user &&
    ADMIN_EMAILS.includes(user.email);

  /*
  ========================================
  STATES
  ========================================
  */

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isSubscribed, setIsSubscribed] =
    useState(true);

  /*
  ========================================
  INIT
  ========================================
  */

  useEffect(() => {

    if (!user) return;

    init();

  }, [user]);

  /*
  ========================================
  INIT FUNCTION
  ========================================
  */

  const init = async () => {

    try {

      /*
      ====================================
      CHECK SUBSCRIPTION
      ====================================
      */

      const { data: sub } =
        await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

      /*
      ====================================
      ADMIN BYPASS
      ====================================
      */

      if (isAdmin) {

        setIsSubscribed(true);

      } else if (
        !sub ||
        !sub.expires_at ||
        new Date(sub.expires_at) <
          new Date()
      ) {

        setIsSubscribed(false);

      } else {

        setIsSubscribed(true);

      }

      /*
      ====================================
      FETCH APPOINTMENTS
      ====================================
      */

      const {
        data,
        error,
      } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setAppointments(data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  /*
  ========================================
  PROVIDER BADGE
  ========================================
  */

  const getProviderBadge = (
    provider
  ) => {

    switch (provider) {

      case "zoom":
        return "Zoom";

      case "teams":
        return "Teams";

      case "meet":
        return "Google Meet";

      case "calendly":
        return "Calendly";

      case "custom":
        return "Custom";

      default:
        return "Meeting";
    }
  };

  /*
  ========================================
  LOADING
  ========================================
  */

  if (
    authLoading ||
    loading
  ) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2
            className="animate-spin text-purple-500 mb-4"
            size={34}
          />

          <p className="text-sm text-gray-400">
            Loading appointments...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-3">

            <Sparkles
              size={12}
              className="text-purple-400"
            />

            <span className="text-[11px] text-gray-300">
              AI Appointment Manager
            </span>

          </div>

          <h1 className="text-3xl font-bold mb-1">
            Appointments
          </h1>

          <p className="text-gray-400 text-sm">
            Manage all customer meetings
            booked through your AI chatbot.
          </p>

        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">

            <Calendar size={20} />

          </div>

          <div>

            <h3 className="text-xl font-bold">
              {appointments.length}
            </h3>

            <p className="text-xs text-gray-400">
              Total Appointments
            </p>

          </div>

        </div>

      </div>

      {/* SUBSCRIPTION BANNER */}

      {!isSubscribed && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">

              <Crown
                size={18}
                className="text-red-400"
              />

            </div>

            <div>

              <h3 className="font-semibold">
                Subscription Required
              </h3>

              <p className="text-sm text-red-200/70">
                Upgrade your plan to
                access appointments.
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate("/pricing")
            }
            className="px-4 h-10 rounded-xl bg-red-500 hover:bg-red-600 transition-all text-sm font-medium"
          >

            Upgrade

          </button>

        </div>

      )}

      {/* TABLE */}

      <div className="rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl overflow-hidden">

        {/* TOP */}

        <div className="flex items-center justify-between p-6 border-b border-white/5">

          <div>

            <h2 className="text-lg font-semibold mb-1">
              All Appointments
            </h2>

            <p className="text-sm text-gray-400">
              View and manage customer
              meetings.
            </p>

          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">

            <Users size={15} />

            {appointments.length} total

          </div>

        </div>

        {/* LOCKED */}

        {!isSubscribed ? (

          <div className="p-20 text-center">

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">

              <Crown
                className="text-red-400"
                size={24}
              />

            </div>

            <h3 className="text-xl font-bold mb-2">
              Appointments Locked
            </h3>

            <p className="text-gray-400 text-sm">
              Upgrade your subscription
              to access appointments.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/5 text-left text-xs text-gray-400">

                <tr>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Provider
                  </th>

                  <th className="px-6 py-4">
                    Meeting Link
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {appointments.length >
                0 ? (

                  appointments.map(
                    (appt) => (

                      <tr
                        key={appt.id}
                        className="border-t border-white/5 hover:bg-white/[0.03] transition-all"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-5 font-medium">

                          {appt.customer_name ||
                            "Unknown"}

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-5 text-gray-300 text-sm">

                          {appt.customer_email ||
                            "-"}

                        </td>

                        {/* PROVIDER */}

                        <td className="px-6 py-5">

                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">

                            <Video size={12} />

                            {getProviderBadge(
                              appt.provider
                            )}

                          </div>

                        </td>

                        {/* LINK */}

                        <td className="px-6 py-5">

                          {appt.meeting_link ? (

                            <a
                              href={
                                appt.meeting_link
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all text-sm font-medium"
                            >

                              Open Meeting

                              <ExternalLink
                                size={14}
                              />

                            </a>

                          ) : (

                            <span className="text-gray-500 text-sm">
                              Not Available
                            </span>

                          )}

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5 text-gray-400 text-sm">

                          {new Date(
                            appt.created_at
                          ).toLocaleString()}

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="p-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">

                          <Calendar
                            size={24}
                            className="text-gray-400"
                          />

                        </div>

                        <h3 className="text-xl font-bold mb-2">
                          No Appointments
                        </h3>

                        <p className="text-gray-400 text-sm">
                          Customer meetings
                          will appear here.
                        </p>

                      </div>

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