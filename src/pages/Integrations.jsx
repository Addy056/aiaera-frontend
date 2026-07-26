import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Crown,
  RefreshCw,
  Link2,
  Unlink,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  integrationsAPI,
  metaAPI,
} from "../lib/api";

import { supabase } from "../lib/supabase";

import IntegrationCard from "../components/integrations/IntegrationCard";
import IntegrationInput from "../components/integrations/IntegrationInput";
import InfoBox from "../components/integrations/InfoBox";
import PlatformIcon from "../components/integrations/PlatformIcon";
import WhatsAppSetupModal from "../components/integrations/WhatsAppSetupModal";
import AutomationToggle from "../components/integrations/AutomationToggle";

export default function Integrations() {

  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");
    /*
========================================
META CONNECTION
========================================
*/
const [metaStatus, setMetaStatus] =
  useState(null);

const [metaLoading, setMetaLoading] =
  useState(false);

const [showMetaSuccess, setShowMetaSuccess] =
  useState(false);

const [metaMessage, setMetaMessage] =
  useState("");
  /*
  ========================================
  SUBSCRIPTION
  ========================================
  */
  const [subscription, setSubscription] =
    useState(null);

  const [isExpired, setIsExpired] =
    useState(false);

  const [isPro, setIsPro] =
    useState(false);

  /*
  ========================================
  MODALS
  ========================================
  */
  const [
    showWhatsAppModal,
    setShowWhatsAppModal,
  ] = useState(false);

 
  /*
  ========================================
  FORM
  ========================================
  */
  const [form, setForm] =
  useState({

    /*
    ===================================
    WHATSAPP
    ===================================
    */
    whatsapp_access_token: "",
    whatsapp_phone_id: "",
    whatsapp_enabled: false,

    /*
    ===================================
    FACEBOOK
    ===================================
    */
    facebook_enabled: false,

    /*
    ===================================
    INSTAGRAM
    ===================================
    */
    instagram_enabled: false,

    /*
    ===================================
    MEETING
    ===================================
    */
    meeting_provider: "calendly",
    meeting_link: "",

    /*
    ===================================
    LOCATION
    ===================================
    */
    maps_link: "",

  });

  /*
  ========================================
  FETCH DATA
  ========================================
  */
  useEffect(() => {

    loadPage();

  }, []);
  useEffect(() => {

  const params =
    new URLSearchParams(
      location.search
    );

  const status =
    params.get(
      "meta_status"
    );

  if (!status)
    return;

  if (status === "success") {

  (async () => {
    await loadPage();

    const reason = params.get("reason");

    if (reason === "instagram_not_connected") {
      setMetaMessage(
        "Facebook connected successfully. Connect an Instagram Professional account to enable Instagram automation."
      );
    } else {
      setMetaMessage("Meta connected successfully.");
    }

    setShowMetaSuccess(true);
  })();

}

  if (status === "cancelled") {

    setError(
      "Meta connection was cancelled."
    );

  }

  if (status === "error") {

    setError(
      "Meta connection failed."
    );

  }

  navigate(
    location.pathname,
    {
      replace: true,
    }
  );

}, [
  location,
  navigate,
]);
 useEffect(() => {

  if (!showMetaSuccess)
    return;

  const timer =
    setTimeout(() => {

      setShowMetaSuccess(false);

    }, 4000);

  return () =>
    clearTimeout(timer);

}, [showMetaSuccess]);
  const loadPage =
    async () => {

      try {

        setPageLoading(true);

       
        /*
        ====================================
        USER
        ====================================
        */
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user)
          return;

        /*
        ====================================
        SUBSCRIPTION
        ====================================
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

          setIsPro(
            subData.plan ===
              "pro"
          );
        }

       const data =
  await integrationsAPI.getIntegrations();

let meta = null;

try {

  meta =
    await metaAPI.getStatus();

} catch (e) {

  console.error(e);

}

if (meta?.success) {

  setMetaStatus(meta.status);

}

        setForm({

  whatsapp_access_token:
    data.whatsapp_access_token || "",

  whatsapp_phone_id:
    data.whatsapp_phone_id || "",

  whatsapp_enabled:
    data.whatsapp_enabled || false,

  facebook_enabled:
    data.facebook_enabled || false,

  instagram_enabled:
    data.instagram_enabled || false,

  meeting_provider:
    data.meeting_provider || "calendly",

  meeting_link:
    data.meeting_link || "",

  maps_link:
    data.maps_link || "",

});

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load integrations"
        );

      } finally {

        setPageLoading(false);

      }
    };

  /*
  ========================================
  HANDLE INPUT
  ========================================
  */
  const handleChange = (e) => {

    if (isExpired)
      return;

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  /*
  ========================================
  TOGGLE
  ========================================
  */
  const handleToggle = (
    key,
    value
  ) => {

    if (isExpired)
      return;

    setForm({
      ...form,
      [key]: value,
    });

  };
const handleConnectMeta =
  async () => {

    try {
      setError("");
setSuccess("");

      setMetaLoading(true);

     const res =
  await metaAPI.getConnectUrl();

if (!res?.url) {
  throw new Error("Meta OAuth URL not received.");
}

window.location.href =
  res.url;

    } catch (err) {

      console.error(err);

     setError(
  err?.response?.data?.message ||
  err?.message ||
  "Unable to connect Meta."
);

    } finally {

      setMetaLoading(false);

    }

  };
  const handleSyncMeta =
  async () => {

    try {
      setError("");
setSuccess("");

      setMetaLoading(true);

      await metaAPI.sync();

      await loadPage();

      setSuccess(
        "Meta synced successfully."
      );

    } catch (err) {

      console.error(err);

     setError(
  err?.response?.data?.message ||
  err?.message ||
  "Failed to sync Meta."
);

    } finally {

      setMetaLoading(false);

    }

  };
  const handleDisconnectMeta =
  async () => {

    try {

      setError("");
setSuccess("");

      setMetaLoading(true);

      await metaAPI.disconnect();

      await loadPage();

      setSuccess(
        "Meta disconnected."
      );

    } catch (err) {

      console.error(err);

     setError(
  err?.response?.data?.message ||
  err?.message ||
  "Unable to disconnect Meta."
);
    } finally {

      setMetaLoading(false);

    }

  };
  /*
  ========================================
  SAVE
  ========================================
  */
  const handleSave = async () => {

    if (isExpired)
      return;

    try {

      setLoading(true);

      setError("");

      setSuccess("");

    
      await integrationsAPI
        .saveIntegrations(form);
await loadPage();
     setSuccess(
  "Integration settings saved successfully."
);

    } catch (err) {

  console.error(err);

  setError(
    err.message ||
    "Failed to save integrations"
  );

}finally {

      setLoading(false);

    }
  };

  /*
  ========================================
  LOADING
  ========================================
  */
  if (pageLoading) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2
            size={36}
            className="animate-spin text-purple-400 mb-4"
          />

          <p className="text-sm text-gray-400">
            Loading integrations...
          </p>

        </div>

      </div>
    );
  }

  return (
    <>
      <WhatsAppSetupModal open={showWhatsAppModal} onClose={() => setShowWhatsAppModal(false)} />

      <div className="space-y-6 text-slate-900">
        {isExpired && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-700">Subscription expired</h3>
              <p className="mt-1 text-sm leading-6 text-red-600/80">Your integrations and automations are currently paused until your subscription is renewed.</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-600">Automation hub</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Integrations</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">Connect your communication channels and automate customer conversations with AI.</p>
            </div>
            <button onClick={handleSave} disabled={loading || isExpired} className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium transition ${isExpired ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : isExpired ? <Lock size={16} /> : <Save size={16} />}
              {isExpired ? "Subscription expired" : loading ? "Saving..." : "Save integrations"}
            </button>
          </div>
        </div>

        {showMetaSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-700">Meta connected successfully</p>
              <p className="mt-1 text-xs text-emerald-700/80">{metaMessage}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <p className="text-sm text-emerald-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-rose-600" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* WHATSAPP */}
          <div className="relative">

            {!isPro && (

              <LockedOverlay />

            )}

            <IntegrationCard
              title="WhatsApp Cloud API"
              subtitle="AI auto replies for WhatsApp conversations."
              icon={
                <PlatformIcon type="whatsapp" />
              }
              status={
                form.whatsapp_access_token
                  ? "connected"
                  : "disconnected"
              }
            >

              <div className={`
                space-y-5
                ${
                  !isPro
                    ? "opacity-40 pointer-events-none"
                    : ""
                }
              `}>

               <div className="flex items-center justify-between">

    <div>

        <h3 className="text-sm font-medium text-slate-900">
            WhatsApp Automation
        </h3>

        <p className="text-xs text-slate-500">
            Enable AI auto replies
        </p>

    </div>

    <AutomationToggle
        enabled={form.whatsapp_enabled}
        onChange={(value) =>
            handleToggle(
                "whatsapp_enabled",
                value
            )
        }
    />

</div>

                <IntegrationInput
                  name="whatsapp_phone_id"
                  placeholder="Phone Number ID"
                  value={
                    form.whatsapp_phone_id
                  }
                  onChange={handleChange}
                />

                <IntegrationInput
    name="whatsapp_access_token"
    placeholder="Permanent Access Token"
    value={form.whatsapp_access_token}
    onChange={handleChange}
/>

<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

    <div className="flex items-center justify-between">

        <span className="text-sm font-medium text-slate-700">
            Cloud API
        </span>

        <span
            className={
                form.whatsapp_access_token
                    ? "text-emerald-600 text-sm font-medium"
                    : "text-rose-600 text-sm font-medium"
            }
        >
            {form.whatsapp_access_token
                ? "Connected"
                : "Disconnected"}
        </span>

    </div>

</div>

<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

    <div className="flex items-center justify-between">

        <span className="text-sm font-medium text-slate-700">
            Setup Guide
        </span>

        <button
            onClick={() => setShowWhatsAppModal(true)}
            className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
            Open
        </button>

    </div>

    <p className="mt-2 text-xs text-slate-500">
        View the complete WhatsApp Cloud API setup instructions.
    </p>

</div>

</div>

            </IntegrationCard>

          </div>

          {/* FACEBOOK */}
          <div className="relative">

            {!isPro && (

              <LockedOverlay />

            )}

            <IntegrationCard
              title="Meta Platform"
              subtitle="Manage Facebook Messenger and Instagram DM automation from one place."
              icon={
    <PlatformIcon type="meta" />
}
              status={
  metaStatus?.meta_connected
    ? "connected"
    : "disconnected"
}
            >

              <div className={`
                space-y-5
                ${
                  !isPro
                    ? "opacity-40 pointer-events-none"
                    : ""
                }
              `}>

                <div className="flex items-center justify-between">

    <div>

        <h3 className="text-sm font-medium text-slate-900">
            Facebook Automation
        </h3>

        <p className="text-xs text-slate-500">
            Enable Messenger AI replies
        </p>

    </div>

    <AutomationToggle
        enabled={form.facebook_enabled}
        disabled={!metaStatus?.meta_connected}
        onChange={(value) =>
            handleToggle("facebook_enabled", value)
        }
    />

</div>

<div className="flex items-center justify-between">

    <div>

        <h3 className="text-sm font-medium text-slate-900">
            Instagram Automation
        </h3>

        <p className="text-xs text-slate-500">
            Enable Instagram AI replies
        </p>

    </div>

    <AutomationToggle
        enabled={form.instagram_enabled}
        disabled={!metaStatus?.instagram_enabled}
        onChange={(value) =>
            handleToggle("instagram_enabled", value)
        }
    />

</div>

          <div className="space-y-4">

  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

  <div className="flex justify-between">

    <span className="text-xs text-gray-400">
      Status
    </span>

   <span
  className={
    metaStatus?.meta_connected
      ? "text-green-400 text-xs"
      : "text-red-400 text-xs"
  }
>
  {metaStatus?.meta_connected
    ? "Connected"
    : "Disconnected"}
</span>

  </div>

  <div className="mt-4">

    <p className="text-xs text-slate-500">
  Facebook Page
</p>
<div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-4">

    <div className="flex items-center justify-between">

        <span className="text-xs text-slate-500">
            Instagram
        </span>

        <span
            className={
                metaStatus?.instagram_enabled
                    ? "text-emerald-600 text-xs"
                    : "text-rose-600 text-xs"
            }
        >
            {metaStatus?.instagram_enabled
                ? "Connected"
                : "Disconnected"}
        </span>

    </div>

    <p className="mt-3 text-xs text-slate-500">
        Username
    </p>

    <p className="mt-1 text-sm font-medium text-slate-900">
        {metaStatus?.instagram_username || "Not Connected"}
    </p>

</div>

<p className="mt-1 text-sm font-medium text-slate-700">
  {metaStatus?.facebook_page_name || "Not Connected"}
</p>

{metaStatus?.last_meta_sync && (

  <p className="text-xs text-gray-500 mt-3">

    Last Sync:
    {" "}
    {new Date(
      metaStatus.last_meta_sync
    ).toLocaleString()}

  </p>



)}

  </div>

</div>

  {
    metaStatus?.meta_connected ? (

      <div className="flex gap-3">

        <button
  onClick={handleSyncMeta}
  disabled={metaLoading}
  className="flex-1 h-11 rounded-2xl bg-violet-600 hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
>
  {metaLoading ? (
    <Loader2
      size={16}
      className="animate-spin"
    />
  ) : (
    <RefreshCw size={16} />
  )}

  Sync
</button>

        <button
  onClick={handleDisconnectMeta}
  disabled={metaLoading}
  className="flex-1 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
>
  {metaLoading ? (
    <Loader2
      size={16}
      className="animate-spin"
    />
  ) : (
    <Unlink size={16} />
  )}

  Disconnect
</button>

      </div>

    ) : (

     <button
  onClick={handleConnectMeta}
  disabled={metaLoading}
  className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
>
  {metaLoading ? (
    <Loader2
      size={16}
      className="animate-spin"
    />
  ) : (
    <Link2 size={16} />
  )}

  Connect with Meta
</button>

    )
  }

</div>

              </div>

            </IntegrationCard>

          </div>

          

           

          {/* APPOINTMENTS */}
          <IntegrationCard
            title="Appointment Booking"
            subtitle="Connect your booking provider for AI scheduling."
            icon={
              <PlatformIcon type="calendly" />
            }
            status={
              form.meeting_link
                ? "connected"
                : "disconnected"
            }
          >

            <div className="space-y-4">

              <label className="text-sm font-medium text-slate-700">
                Meeting Provider
              </label>

              <select
                name="meeting_provider"
                value={form.meeting_provider}
                onChange={handleChange}
                disabled={isExpired}
                className="h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-violet-400"
              >

                <option value="calendly">
                  Calendly
                </option>

                <option value="zoom">
                  Zoom
                </option>

                <option value="meet">
                  Google Meet
                </option>

                <option value="teams">
                  Microsoft Teams
                </option>

              </select>

              <IntegrationInput
                name="meeting_link"
                placeholder="https://your-booking-link.com"
                value={form.meeting_link}
                onChange={handleChange}
              />

              <InfoBox>
                Your AI chatbot can automatically share this booking link with customers.
              </InfoBox>

            </div>

          </IntegrationCard>

          {/* maps_link */}
          <IntegrationCard
            title="Business Location"
            subtitle="Help customers find your business quickly."
            icon={
              <PlatformIcon type="maps" />
            }
            status={
              form.maps_link
                ? "connected"
                : "disconnected"
            }
          >

            <IntegrationInput
              name="maps_link"
              placeholder="https://maps_link.google.com/..."
              value={form.maps_link}
              onChange={handleChange}
            />

            <InfoBox>
              AI can automatically send your office location and directions.
            </InfoBox>

          </IntegrationCard>

        </div>

      </div>
    </>
  );
}

/*
========================================
LOCKED OVERLAY
========================================
*/
function LockedOverlay() {

  return (

    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm">

      <div className="text-center">

        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">

          <Crown
            size={24}
            className="text-yellow-300"
          />

        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-900">

          Pro Feature

        </h3>

        <p className="mb-5 max-w-[260px] text-sm text-slate-600">

          Upgrade to Pro to unlock WhatsApp, Facebook, and Instagram AI automation.

        </p>

        <a
          href="/app/pricing"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-700"
        >

          Upgrade To Pro

        </a>

      </div>

    </div>

  );
}