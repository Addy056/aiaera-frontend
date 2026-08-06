import {
  Search,
  Download,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Sparkles,
  Crown,
  RefreshCw,
  Eye,
  X,
  Trash2,
  Phone,
  AlertTriangle,
  Lock,
} from "lucide-react";

import {
  useEffect,
  useState,
  useContext,
} from "react";

import { supabase } from "../lib/supabase";
import { leadsAPI } from "../lib/api";

import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

export default function Leads() {

  const {
    user,
    loading: authLoading,
  } = useContext(
    AuthContext
  );

  const navigate =
    useNavigate();

  /*
  ========================================
  ADMIN BYPASS
  ========================================
  */
  const ADMIN_EMAILS = [
    "dhawaleaditya077@gmail.com",
  ];

  const isAdmin =
    user &&
    ADMIN_EMAILS.includes(
      user.email
    );

  /*
  ========================================
  STATES
  ========================================
  */
  const [leads, setLeads] =
    useState([]);

  const [
    filteredLeads,
    setFilteredLeads,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedLead,
    setSelectedLead,
  ] = useState(null);

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

    const channel =
      supabase
        .channel(
          "realtime-leads"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "leads",
          },
          () => {
            fetchLeads();
          }
        )
        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );

    };

  }, [user]);

  /*
  ========================================
  FETCH ALL
  ========================================
  */
  const fetchData =
    async () => {

      await Promise.all([
        fetchSubscription(),
        fetchLeads(),
      ]);

    };

  /*
  ========================================
  FETCH SUBSCRIPTION
  ========================================
  */
  const fetchSubscription =
    async () => {

      try {

        const {
          data,
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

        if (data) {

          setSubscription(
            data
          );

          const expired =
            data.expires_at
              ? new Date(
                  data.expires_at
                ) <
                new Date()
              : false;

          setIsExpired(
            expired
          );
        }

      } catch (err) {

        console.error(
          err
        );

      }
    };

  /*
  ========================================
  FETCH LEADS
  ========================================
  */
  const fetchLeads =
    async () => {

      try {

        setLoading(true);

        const response =
          await leadsAPI.getLeads();

        const data =
          response?.leads || [];

        setLeads(
          data || []
        );

        setFilteredLeads(
          data || []
        );

      } catch (err) {

        console.error(
          err
        );

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

      setFilteredLeads(
        leads
      );

      return;
    }

    const filtered =
      leads.filter(
        (lead) => {

          return (
            lead.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            lead.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            lead.message
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    setFilteredLeads(
      filtered
    );

  }, [search, leads]);

  /*
  ========================================
  EXPORT CSV
  ========================================
  */
  const exportCSV =
    () => {

      if (
        isExpired &&
        !isAdmin
      )
        return;

      const headers = [
        "Name",
        "Email",
        "Message",
        "Created At",
      ];

      const rows =
        filteredLeads.map(
          (lead) => [
            lead.name,
            lead.email,
            lead.message,
            new Date(
              lead.created_at
            ).toLocaleString(),
          ]
        );

      const csv =
        [
          headers,
          ...rows,
        ]
          .map((row) =>
            row.join(",")
          )
          .join("\n");

      const blob =
        new Blob([csv], {
          type:
            "text/csv;charset=utf-8;",
        });

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.setAttribute(
        "download",
        "aiaera-leads.csv"
      );

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    };

  /*
  ========================================
  DELETE LEAD
  ========================================
  */
  const deleteLead =
    async (id) => {

      if (
        isExpired &&
        !isAdmin
      )
        return;

      const confirmDelete =
        window.confirm(
          "Delete this lead?"
        );

      if (!confirmDelete)
        return;

      try {

        await supabase
          .from("leads")
          .delete()
          .eq("id", id);

        fetchLeads();

      } catch (err) {

        console.error(
          err
        );

      }
    };

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

          <RefreshCw
            size={32}
            className="animate-spin text-purple-400 mb-4"
          />

          <p className="text-gray-400 text-sm">

            Loading Leads...

          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      {isExpired && !isAdmin && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-red-700">Subscription Expired</h3>
            <p className="mt-1 text-sm leading-6 text-red-600/80">Leads are available in read-only mode until your subscription is renewed.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">Lead management</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Leads dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Review, organize, and export customer leads collected by your automations.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{subscription?.plan || "trial"}</div>
            <button onClick={exportCSV} disabled={isExpired && !isAdmin} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${isExpired && !isAdmin ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
              {isExpired && !isAdmin ? <Lock size={16} /> : <Download size={16} />}
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        <ModernStatCard
          icon={
            <Users size={20} />
          }
          title="Total Leads"
          value={leads.length}
          color="from-[#7f5af0]/20 to-purple-500/5"
        />

        <ModernStatCard
          icon={
            <Mail size={20} />
          }
          title="Emails Captured"
          value={
            leads.filter(
              (lead) =>
                lead.email
            ).length
          }
          color="from-blue-500/20 to-cyan-500/5"
        />

        <ModernStatCard
          icon={
            <MessageSquare
              size={20}
            />
          }
          title="Messages"
          value={
            leads.filter(
              (lead) =>
                lead.message
            ).length
          }
          color="from-pink-500/20 to-rose-500/5"
        />

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search leads by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-sm text-slate-700 outline-none transition focus:border-violet-400"
          />

        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold mb-1">

              Captured Leads

            </h2>

            <p className="text-sm text-slate-600">

              Manage customer inquiries.

            </p>

          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">

            <Users
              size={18}
              className="text-purple-300"
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Customer

                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">

                  Message

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

              {filteredLeads.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-20 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">

                        <Users
                          size={26}
                          className="text-gray-500"
                        />

                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-slate-900">

                        No Leads Yet

                      </h3>

                      <p className="text-slate-500">

                        Leads collected from your AI chatbot will appear here.

                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredLeads.map(
                  (lead) => (

                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
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

                            <h3 className="font-semibold text-slate-900">

                              {lead.name ||
                                "Unknown"}

                            </h3>

                            <p className="text-sm text-slate-600">

                              {lead.email ||
                                "No Email"}

                            </p>
<p className="text-sm text-slate-500">
  {lead.platform === "instagram" && lead.external_id
    ? `Instagram ID: ${lead.external_id}`
    : lead.platform === "facebook" && lead.external_id
    ? `Facebook ID: ${lead.external_id}`
    : lead.phone || "No Phone"}
</p>

                          </div>

                        </div>

                      </td>

                      {/* MESSAGE */}
                      <td className="px-6 py-5 max-w-[380px]">

                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">

                          {lead.message ||
                            "No message"}

                        </p>

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">

                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

                          <Calendar
                            size={14}
                            className="text-purple-300"
                          />

                          <span className="text-sm text-slate-700">

                            {new Date(
                              lead.created_at
                            ).toLocaleDateString()}

                          </span>

                        </div>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-3">

                          <button
                            onClick={() =>
                              setSelectedLead(
                                lead
                              )
                            }
className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"                          >

                            <Eye
                              size={16}
                            />

                          </button>

                          <button
                            onClick={() =>
                              deleteLead(
                                lead.id
                              )
                            }
                            disabled={
                              isExpired &&
                              !isAdmin
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
                                isExpired &&
                                !isAdmin
                                  ? "bg-slate-100 text-gray-600 cursor-not-allowed"
                                  : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/10"
                              }
                            `}
                          >

                            {isExpired &&
                            !isAdmin ? (
                              <Lock
                                size={16}
                              />
                            ) : (
                              <Trash2
                                size={16}
                                className="text-red-400"
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
      {selectedLead && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">

            <div className="mb-5 flex items-center gap-4">

              <div>

                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">

                  Lead Details

                </h2>

                <p className="mt-1 text-sm text-slate-600">

                  Customer conversation details

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedLead(
                    null
                  )
                }
                className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
              >

                <X size={18} />

              </button>

            </div>

            <div className="flex flex-col gap-5">

              <ModernDetailCard
                title="Customer Name"
                value={
                  selectedLead.name
                }
                icon={
                  <Users
                    size={16}
                  />
                }
              />
              
             <ModernDetailCard
  title={
    selectedLead.platform === "instagram"
      ? "Instagram User ID"
      : selectedLead.platform === "facebook"
      ? "Facebook User ID"
      : "Phone Number"
  }
  value={
    selectedLead.platform === "instagram" ||
    selectedLead.platform === "facebook"
      ? selectedLead.external_id
      : selectedLead.phone
  }
  icon={<Phone size={16} />}
/>
              <ModernDetailCard
                title="Email Address"
                value={
                  selectedLead.email
                }
                icon={
                  <Mail
                    size={16}
                  />
                }
              />
              <ModernDetailCard
  title="Platform"
  value={
    selectedLead.platform
      ?.charAt(0)
      .toUpperCase() +
    selectedLead.platform?.slice(1)
  }
  icon={<Sparkles size={16} />}
/>

              <ModernDetailCard
                title="Reason for Inquiry"
                value={
                  selectedLead.message
                }
                icon={
                  <MessageSquare
                    size={16}
                  />
                }
              />
<ModernDetailCard
  title="Conversation Count"
  value={selectedLead.conversation_count}
  icon={<MessageSquare size={16} />}
/>

<ModernDetailCard
  title="Last Message"
  value={selectedLead.last_message}
  icon={<MessageSquare size={16} />}
/>
              <ModernDetailCard
                title="Created At"
                value={new Date(
                  selectedLead.created_at
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
function ModernStatCard({
  icon,
  title,
  value,
  color,
}) {

  return (

    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

          {icon}

        </div>

        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">

          {value}

        </h2>

        <p className="text-slate-500">

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
function ModernDetailCard({
  title,
  value,
  icon,
}) {

  return (

    <div>

      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">

        {icon}

        <span>

          {title}

        </span>

      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 break-words">

        {value || "N/A"}

      </div>

    </div>

  );
}
