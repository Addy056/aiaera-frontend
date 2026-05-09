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

  const [
    isSubscribed,
    setIsSubscribed,
  ] = useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedLead,
    setSelectedLead,
  ] = useState(null);

  /*
  ========================================
  INIT
  ========================================
  */
  useEffect(() => {

    if (!user) return;

    fetchLeads();

    /*
    ========================================
    REALTIME SUBSCRIPTION
    ========================================
    */
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
  SEARCH FILTER
  ========================================
  */
  useEffect(() => {

    const filtered =
      leads.filter((lead) =>
        `
${lead.name}
${lead.email}
${lead.phone}
${lead.message}
`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredLeads(
      filtered
    );

  }, [search, leads]);

  /*
  ========================================
  FETCH LEADS
  ========================================
  */
  const fetchLeads =
    async () => {

      try {

        setLoading(true);

        /*
        ========================================
        CHECK SUBSCRIPTION
        ========================================
        */
        const {
          data: sub,
        } = await supabase
          .from(
            "user_subscriptions"
          )
          .select(
            "expires_at"
          )
          .eq(
            "user_id",
            user.id
          )
          .maybeSingle();

        /*
        ========================================
        ADMIN ACCESS
        ========================================
        */
        if (isAdmin) {

          setIsSubscribed(
            true
          );

        } else if (
          sub?.expires_at &&
          new Date(
            sub.expires_at
          ) <
            new Date()
        ) {

          setIsSubscribed(
            false
          );

        } else {

          setIsSubscribed(
            true
          );
        }

        /*
        ========================================
        FETCH LEADS
        ========================================
        */
        const {
          data,
          error,
        } = await supabase
          .from("leads")
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

        if (error) {
          throw error;
        }

        setLeads(
          data || []
        );

        setFilteredLeads(
          data || []
        );

      } catch (err) {

        console.error(
          "LEADS ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  ========================================
  DELETE LEAD
  ========================================
  */
  const deleteLead =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this lead?"
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      try {

        const { error } =
          await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) {
          throw error;
        }

        fetchLeads();

      } catch (err) {

        console.error(
          "DELETE ERROR:",
          err
        );
      }
    };

  /*
  ========================================
  EXPORT CSV
  ========================================
  */
  const exportCSV =
    () => {

      if (
        !isSubscribed ||
        filteredLeads.length === 0
      ) {
        return;
      }

      const headers = [
        "Name",
        "Email",
        "Phone",
        "Message",
        "Date",
      ];

      const rows =
        filteredLeads.map(
          (lead) => [
            lead.name ||
              "",
            lead.email ||
              "",
            lead.phone ||
              "",
            lead.message ||
              "",
            new Date(
              lead.created_at
            ).toLocaleString(),
          ]
        );

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows]
          .map((e) =>
            e.join(",")
          )
          .join("\n");

      const encodedUri =
        encodeURI(
          csvContent
        );

      const link =
        document.createElement(
          "a"
        );

      link.setAttribute(
        "href",
        encodedUri
      );

      link.setAttribute(
        "download",
        "aiaera-leads.csv"
      );

      document.body.appendChild(
        link
      );

      link.click();
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

          <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4"></div>

          <p className="text-gray-400 text-sm">
            Loading leads...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-4 text-white">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-2">

            <Sparkles
              size={12}
              className="text-purple-400"
            />

            <span className="text-[11px] text-gray-300">
              AI Lead Management
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Leads
          </h1>

          <p className="text-gray-400 text-sm">
            Manage all captured customer leads.
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={
              fetchLeads
            }
            className="h-11 px-4 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all flex items-center gap-2 text-sm"
          >

            <RefreshCw size={15} />

            Refresh

          </button>

          <button
            onClick={
              exportCSV
            }
            disabled={
              !isSubscribed ||
              filteredLeads.length ===
                0
            }
            className={`h-11 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
              isSubscribed
                ? "bg-[#7f5af0] hover:opacity-90"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >

            <Download size={15} />

            Export CSV

          </button>

        </div>

      </div>

      {/* SUB WARNING */}
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
                Upgrade to access leads.
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                "/app/pricing"
              )
            }
            className="h-10 px-4 rounded-xl bg-red-500 hover:bg-red-600 transition-all text-sm font-medium"
          >

            Upgrade

          </button>

        </div>

      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

        <StatCard
          title="Total Leads"
          value={
            filteredLeads.length
          }
          icon={
            <Users size={16} />
          }
        />

        <StatCard
          title="Emails"
          value={
            filteredLeads.filter(
              (l) => l.email
            ).length
          }
          icon={
            <Mail size={16} />
          }
        />

        <StatCard
          title="Phones"
          value={
            filteredLeads.filter(
              (l) => l.phone
            ).length
          }
          icon={
            <Phone size={16} />
          }
        />

        <StatCard
          title="Messages"
          value={
            filteredLeads.filter(
              (l) =>
                l.message
            ).length
          }
          icon={
            <MessageSquare size={16} />
          }
        />

      </div>

      {/* SEARCH */}
      <div className="relative">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={16}
        />

        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full h-12 rounded-2xl bg-white/[0.03] border border-white/5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500"
        />

      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">

          <div>

            <h2 className="text-base font-semibold mb-1">
              All Leads
            </h2>

            <p className="text-xs text-gray-400">
              {
                filteredLeads.length
              }{" "}
              leads found
            </p>

          </div>

        </div>

        {/* EMPTY */}
        {!isSubscribed ? (

          <div className="p-16 text-center">

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">

              <Crown
                className="text-red-400"
                size={24}
              />

            </div>

            <h3 className="text-xl font-bold mb-2">
              Leads Locked
            </h3>

            <p className="text-gray-400 text-sm">
              Upgrade your subscription.
            </p>

          </div>

        ) : filteredLeads.length ===
          0 ? (

          <div className="p-16 text-center">

            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">

              <Users
                className="text-gray-400"
                size={24}
              />

            </div>

            <h3 className="text-xl font-bold mb-2">
              No Leads Yet
            </h3>

            <p className="text-gray-400 text-sm">
              Captured leads will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/5">

                <tr className="text-left text-gray-400 text-xs">

                  <th className="px-4 py-3">
                    Name
                  </th>

                  <th className="px-4 py-3">
                    Email
                  </th>

                  <th className="px-4 py-3">
                    Phone
                  </th>

                  <th className="px-4 py-3">
                    Message
                  </th>

                  <th className="px-4 py-3">
                    Date
                  </th>

                  <th className="px-4 py-3">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeads.map(
                  (lead) => (

                    <tr
                      key={
                        lead.id
                      }
                      className="border-t border-white/5 hover:bg-white/[0.03] transition-all"
                    >

                      <td className="px-4 py-4 font-medium text-sm">
                        {lead.name ||
                          "Unknown"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-300">
                        {lead.email ||
                          "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-300">
                        {lead.phone ||
                          "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-400 max-w-[240px] truncate">
                        {lead.message ||
                          "-"}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-500">
                        {new Date(
                          lead.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setSelectedLead(
                                lead
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all flex items-center justify-center"
                          >

                            <Eye size={15} />

                          </button>

                          <button
                            onClick={() =>
                              deleteLead(
                                lead.id
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center text-red-400"
                          >

                            <Trash2 size={15} />

                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* MODAL */}
      {selectedLead && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0F172A] p-6 relative">

            <button
              onClick={() =>
                setSelectedLead(
                  null
                )
              }
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] flex items-center justify-center"
            >

              <X size={16} />

            </button>

            <h2 className="text-xl font-bold mb-6">
              Lead Details
            </h2>

            <div className="space-y-4">

              <DetailItem
                icon={
                  <Users size={15} />
                }
                label="Name"
                value={
                  selectedLead.name
                }
              />

              <DetailItem
                icon={
                  <Mail size={15} />
                }
                label="Email"
                value={
                  selectedLead.email
                }
              />

              <DetailItem
                icon={
                  <Phone size={15} />
                }
                label="Phone"
                value={
                  selectedLead.phone
                }
              />

              <DetailItem
                icon={
                  <MessageSquare size={15} />
                }
                label="Message"
                value={
                  selectedLead.message
                }
              />

              <DetailItem
                icon={
                  <Calendar size={15} />
                }
                label="Created"
                value={new Date(
                  selectedLead.created_at
                ).toLocaleString()}
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
}) {

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

      <div className="flex items-center justify-between mb-4">

        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">

          {icon}

        </div>

      </div>

      <h2 className="text-2xl font-bold mb-1">
        {value}
      </h2>

      <p className="text-sm text-gray-400">
        {title}
      </p>

    </div>
  );
}

/*
========================================
DETAIL ITEM
========================================
*/
function DetailItem({
  icon,
  label,
  value,
}) {

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">

          {icon}

        </div>

        <div>

          <p className="text-xs text-gray-400 mb-1">
            {label}
          </p>

          <h3 className="font-medium text-sm break-words">
            {value || "-"}
          </h3>

        </div>

      </div>

    </div>
  );
}