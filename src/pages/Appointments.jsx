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
  Search,
  Eye,
  X,
  AlertTriangle,
  Lock,
  Clock3,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import { AuthContext } from "../context/AuthContext";

export default function Appointments() {

  const {
    user,
    loading: authLoading,
  } = useContext(AuthContext);

  /*
  ========================================
  STATES
  ========================================
  */
  const [
    appointments,
    setAppointments,
  ] = useState([]);

  const [
    filteredAppointments,
    setFilteredAppointments,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  /*
  ========================================
  SUBSCRIPTION
  ========================================
  */
  const [
    subscription,
    setSubscription,
  ] = useState(null);

  const [isExpired, setIsExpired] =
    useState(false);

  /*
  ========================================
  INIT
  ========================================
  */
  useEffect(() => {

    if (!user)
      return;

    fetchData();

  }, [user]);

  /*
  ========================================
  FETCH DATA
  ========================================
  */
  const fetchData =
    async () => {

      try {

        setLoading(true);

        /*
        ========================================
        SUBSCRIPTION
        ========================================
        */
        const {
          data: subData,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .select("*")
            .eq(
              "user_id",
              user.id
            )
            .maybeSingle();

        if (subData) {

          setSubscription(
            subData
          );

          const expired =
            subData.expires_at
              ? new Date(
                  subData.expires_at
                ) <
                new Date()
              : false;

          setIsExpired(
            expired
          );
        }

        /*
        ========================================
        APPOINTMENTS
        ========================================
        */
        const {
          data,
          error,
        } =
          await supabase
            .from(
              "appointments"
            )
            .select("*")
            .eq(
              "user_id",
              user.id
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

        if (error)
          throw error;

        setAppointments(
          data || []
        );

        setFilteredAppointments(
          data || []
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

  /*
  ========================================
  SEARCH
  ========================================
  */
  useEffect(() => {

    if (!search) {

      setFilteredAppointments(
        appointments
      );

      return;
    }

    const filtered =
      appointments.filter(
        (item) => {

          return (
            item.customer_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.customer_email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    setFilteredAppointments(
      filtered
    );

  }, [
    search,
    appointments,
  ]);

  /*
  ========================================
  LOADING
  ========================================
  */
  if (
    loading ||
    authLoading
  ) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2
            size={34}
            className="animate-spin text-purple-400 mb-4"
          />

          <p className="text-sm text-gray-400">

            Loading appointments...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen text-white space-y-6">

      {/* EXPIRED */}
      {isExpired && (

        <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-5 flex items-start gap-4">

          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">

            <AlertTriangle
              size={20}
              className="text-red-300"
            />

          </div>

          <div>

            <h3 className="text-lg font-semibold text-red-200 mb-1">

              Subscription Expired

            </h3>

            <p className="text-sm text-red-100/80">

              Your appointments are available in read-only mode.
              Renew your subscription to reactivate automations.

            </p>

          </div>

        </div>

      )}

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#7f5af0]/20 via-[#111827] to-[#050816] p-8">

        <div className="absolute top-[-120px] right-[-120px] w-[260px] h-[260px] bg-purple-500/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-5">

              <Sparkles
                size={14}
                className="text-purple-300"
              />

              <span className="text-xs text-gray-300">

                AI Appointment Management

              </span>

            </div>

            <h1 className="text-5xl font-black tracking-[-2px] mb-3">

              Appointments

            </h1>

            <p className="text-gray-400 max-w-2xl leading-relaxed">

              Manage AI-booked meetings and customer appointments.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 flex-wrap">

            {/* PLAN */}
            <div className="h-[56px] px-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">

                <Crown
                  size={16}
                  className="text-yellow-300"
                />

              </div>

              <div>

                <p className="text-[10px] text-gray-400 uppercase">

                  Current Plan

                </p>

                <h3 className="text-sm font-semibold uppercase">

                  {subscription?.plan ||
                    "trial"}

                </h3>

              </div>

            </div>

            {/* COUNT */}
            <div className="h-[56px] px-5 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">

                <Calendar
                  size={16}
                  className="text-purple-300"
                />

              </div>

              <div>

                <p className="text-[10px] text-gray-400 uppercase">

                  Total

                </p>

                <h3 className="text-sm font-semibold">

                  {
                    appointments.length
                  } Appointments

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <StatCard
          icon={
            <Calendar size={20} />
          }
          title="Appointments"
          value={
            appointments.length
          }
          color="from-[#7f5af0]/20 to-purple-500/5"
        />

        <StatCard
          icon={
            <Users size={20} />
          }
          title="Customers"
          value={
            appointments.filter(
              (item) =>
                item.customer_name
            ).length
          }
          color="from-blue-500/20 to-cyan-500/5"
        />

        <StatCard
          icon={
            <Clock3 size={20} />
          }
          title="This Month"
          value={
            appointments.length
          }
          color="from-pink-500/20 to-rose-500/5"
        />

      </div>

      {/* SEARCH */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full h-[60px] rounded-2xl bg-[#0B1120] border border-white/10 pl-14 pr-5 text-white placeholder:text-gray-500 outline-none focus:border-purple-500 transition-all"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

          <div>

            <h2 className="text-xl font-bold mb-1">

              Scheduled Meetings

            </h2>

            <p className="text-sm text-gray-400">

              Review customer appointments.

            </p>

          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">

            <Video
              size={18}
              className="text-purple-300"
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10 bg-white/[0.02]">

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Customer

                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Meeting

                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Date

                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAppointments.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-20 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-5">

                        <Calendar
                          size={26}
                          className="text-gray-500"
                        />

                      </div>

                      <h3 className="text-lg font-semibold mb-2">

                        No Appointments Yet

                      </h3>

                      <p className="text-gray-400">

                        AI-booked meetings will appear here.

                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredAppointments.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                    >

                      {/* CUSTOMER */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7f5af0]/30 to-blue-500/10 border border-white/10 flex items-center justify-center">

                            <Users
                              size={18}
                              className="text-purple-300"
                            />

                          </div>

                          <div>

                            <h3 className="font-semibold text-white">

                              {item.customer_name ||
                                "Unknown"}

                            </h3>

                            <p className="text-sm text-gray-400">

                              {item.customer_email ||
                                "No Email"}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* LINK */}
                      <td className="px-6 py-5">

                        {item.calendly_event_link ? (

                          <a
                            href={
                              item.calendly_event_link
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-sm transition-all"
                          >

                            Open Meeting

                            <ExternalLink
                              size={14}
                            />

                          </a>

                        ) : (

                          <span className="text-sm text-gray-500">

                            No Link

                          </span>

                        )}

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">

                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">

                          <Calendar
                            size={14}
                            className="text-purple-300"
                          />

                          <span className="text-sm text-gray-300">

                            {new Date(
                              item.created_at
                            ).toLocaleDateString()}

                          </span>

                        </div>

                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-3">

                          <button
                            onClick={() =>
                              setSelectedAppointment(
                                item
                              )
                            }
                            className="w-11 h-11 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center transition-all"
                          >

                            <Eye size={16} />

                          </button>

                          <button
                            disabled={
                              isExpired
                            }
                            className={`
                              w-11
                              h-11
                              rounded-2xl
                              flex
                              items-center
                              justify-center
                              transition-all
                              ${
                                isExpired
                                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                  : "bg-purple-500/10 border border-purple-500/10"
                              }
                            `}
                          >

                            {isExpired ? (
                              <Lock
                                size={16}
                              />
                            ) : (
                              <Video
                                size={16}
                                className="text-purple-300"
                              />
                            )}

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {selectedAppointment && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0B1120] p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold mb-2">

                  Appointment Details

                </h2>

                <p className="text-gray-400 text-sm">

                  Meeting information

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
                className="w-12 h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center"
              >

                <X size={18} />

              </button>

            </div>

            <div className="space-y-5">

              <DetailCard
                title="Customer Name"
                value={
                  selectedAppointment.customer_name
                }
                icon={
                  <Users
                    size={16}
                  />
                }
              />

              <DetailCard
                title="Customer Email"
                value={
                  selectedAppointment.customer_email
                }
                icon={
                  <Users
                    size={16}
                  />
                }
              />

              <DetailCard
                title="Meeting Link"
                value={
                  selectedAppointment.calendly_event_link
                }
                icon={
                  <Video
                    size={16}
                  />
                }
              />

              <DetailCard
                title="Created At"
                value={new Date(
                  selectedAppointment.created_at
                ).toLocaleString()}
                icon={
                  <Calendar
                    size={16}
                  />
                }
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/*
========================================
STAT CARD
========================================
*/
function StatCard({
  icon,
  title,
  value,
  color,
}) {

  return (

    <div className={`
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-white/10
      bg-gradient-to-br
      ${color}
      p-6
    `}>

      <div className="absolute top-[-50px] right-[-50px] w-[120px] h-[120px] bg-white/5 blur-[50px] rounded-full"></div>

      <div className="relative z-10">

        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">

          {icon}

        </div>

        <h2 className="text-4xl font-black mb-2">

          {value}

        </h2>

        <p className="text-gray-300">

          {title}

        </p>

      </div>

    </div>

  );
}

/*
========================================
DETAIL CARD
========================================
*/
function DetailCard({
  title,
  value,
  icon,
}) {

  return (

    <div>

      <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">

        {icon}

        <span>

          {title}

        </span>

      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white break-words">

        {value || "N/A"}

      </div>

    </div>

  );
}