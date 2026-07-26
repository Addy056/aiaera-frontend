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
import { appointmentsAPI } from "../lib/api";
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
const pendingCount =
  appointments.filter(
    item => item.status === "pending"
  ).length;

const acceptedCount =
  appointments.filter(
    item => item.status === "accepted"
  ).length;

const rejectedCount =
  appointments.filter(
    item => item.status === "rejected"
  ).length;

const completedCount =
  appointments.filter(
    item => item.status === "completed"
  ).length;
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
 const updateStatus =
  async (
    appointmentId,
    status
  ) => {

    try {

      await appointmentsAPI
        .updateAppointmentStatus(
          appointmentId,
          status
        );

      fetchData();

    } catch (err) {

      console.error(err);

    }
  };
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
    <div className="space-y-6 text-slate-900">
      {isExpired && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-700">Subscription Expired</h3>
            <p className="mt-1 text-sm leading-6 text-red-600/80">Your appointments are available in read-only mode until your subscription is renewed.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">Appointment management</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Appointments</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Manage AI-booked meetings and customer appointments from one clean workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{subscription?.plan || "trial"}</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{appointments.length} total</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={<Calendar size={18} />} title="Total" value={appointments.length} />
        <StatCard icon={<Clock3 size={18} />} title="Pending" value={pendingCount} />
        <StatCard icon={<Calendar size={18} />} title="Accepted" value={acceptedCount} />
        <StatCard icon={<Users size={18} />} title="Rejected" value={rejectedCount} />
        <StatCard icon={<Video size={18} />} title="Completed" value={completedCount} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm text-slate-700 outline-none transition focus:border-violet-400"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Scheduled meetings</h2>
            <p className="mt-1 text-sm text-slate-600">Review customer appointments and move them through their lifecycle.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Video size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Meeting</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">No appointments yet</h3>
                      <p className="mt-2 text-sm text-slate-600">AI-booked meetings will appear here as soon as they are created.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                          <Users size={18} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.customer_name || "Unknown"}</h3>
                          <p className="text-sm text-slate-600">{item.customer_email || "No Email"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {item.meeting_link ? (
                        <a href={item.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100">
                          Open meeting
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">No link</span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "accepted" ? "bg-emerald-50 text-emerald-700" : item.status === "rejected" ? "bg-rose-50 text-rose-700" : item.status === "completed" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"}`}>
                        {item.status || "pending"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-violet-600" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => setSelectedAppointment(item)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
                          <Eye size={16} />
                        </button>
                        <div className="flex gap-2">
                          {item.status === "pending" && !isExpired && (
                            <>
                              <button onClick={() => updateStatus(item.id, "accepted")} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">Accept</button>
                              <button onClick={() => updateStatus(item.id, "rejected")} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">Reject</button>
                            </>
                          )}
                          {item.status === "accepted" && !isExpired && (
                            <button onClick={() => updateStatus(item.id, "completed")} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100">Complete</button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Appointment details</h2>
                <p className="mt-1 text-sm text-slate-600">Meeting information and contact details.</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <DetailCard title="Customer Name" value={selectedAppointment.customer_name} icon={<Users size={16} />} />
              <DetailCard title="Customer Email" value={selectedAppointment.customer_email} icon={<Users size={16} />} />
              <DetailCard title="Customer Phone" value={selectedAppointment.customer_phone} icon={<Users size={16} />} />
              <DetailCard title="Status" value={selectedAppointment.status} icon={<Clock3 size={16} />} />
              <DetailCard title="Meeting Link" value={selectedAppointment.meeting_link} icon={<Video size={16} />} />
              <DetailCard title="Created At" value={new Date(selectedAppointment.created_at).toLocaleString()} icon={<Calendar size={16} />} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        {icon}
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</h2>
      <p className="mt-1 text-sm text-slate-600">{title}</p>
    </div>
  );
}

function DetailCard({ title, value, icon }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>{title}</span>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 break-words">
        {value || "N/A"}
      </div>
    </div>
  );
}