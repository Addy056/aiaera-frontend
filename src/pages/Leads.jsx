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

        const {
          data,
          error,
        } =
          await supabase
            .from("leads")
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

    <div className="min-h-screen text-white space-y-6">

      {/* EXPIRED */}
      {isExpired &&
        !isAdmin && (

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

                Leads are available in read-only mode.
                Renew your subscription to export and manage leads.

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

                AI Lead Management

              </span>

            </div>

            <h1 className="text-5xl font-black tracking-[-2px] mb-3">

              Leads Dashboard

            </h1>

            <p className="text-gray-400 max-w-2xl leading-relaxed">

              View, manage, and export customer leads collected
              from your AI chatbots and automations.

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

            {/* EXPORT */}
            <button
              onClick={exportCSV}
              disabled={
                isExpired &&
                !isAdmin
              }
              className={`
                h-[56px]
                px-6
                rounded-2xl
                transition-all
                flex
                items-center
                gap-3
                font-medium
                ${
                  isExpired &&
                  !isAdmin
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-[#7f5af0] hover:opacity-90 shadow-[0_10px_40px_rgba(127,90,240,0.35)]"
                }
              `}
            >

              {isExpired &&
              !isAdmin ? (
                <Lock size={16} />
              ) : (
                <Download size={16} />
              )}

              Export CSV

            </button>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

      {/* SEARCH */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search leads by name, email, or message..."
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

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

          <div>

            <h2 className="text-xl font-bold mb-1">

              Captured Leads

            </h2>

            <p className="text-sm text-gray-400">

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

              <tr className="border-b border-white/10 bg-white/[0.02]">

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

                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-5">

                        <Users
                          size={26}
                          className="text-gray-500"
                        />

                      </div>

                      <h3 className="text-lg font-semibold mb-2">

                        No Leads Yet

                      </h3>

                      <p className="text-gray-400">

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

                              {lead.name ||
                                "Unknown"}

                            </h3>

                            <p className="text-sm text-gray-400">

                              {lead.email ||
                                "No Email"}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* MESSAGE */}
                      <td className="px-6 py-5 max-w-[380px]">

                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">

                          {lead.message ||
                            "No message"}

                        </p>

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
                            className="w-11 h-11 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center transition-all"
                          >

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
                                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
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

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">

          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0B1120] p-8">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold mb-2">

                  Lead Details

                </h2>

                <p className="text-gray-400 text-sm">

                  Customer conversation details

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedLead(
                    null
                  )
                }
                className="w-12 h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center"
              >

                <X size={18} />

              </button>

            </div>

            <div className="space-y-5">

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
                title="Message"
                value={
                  selectedLead.message
                }
                icon={
                  <MessageSquare
                    size={16}
                  />
                }
                large
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
function ModernDetailCard({
  title,
  value,
  icon,
  large,
}) {

  return (

    <div>

      <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">

        {icon}

        <span>

          {title}

        </span>

      </div>

      <div className={`
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
        text-white
        ${
          large
            ? "min-h-[120px]"
            : ""
        }
      `}>

        {value || "N/A"}

      </div>

    </div>

  );
}