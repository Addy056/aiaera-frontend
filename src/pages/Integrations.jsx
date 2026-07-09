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

        /*
        ====================================
        INTEGRATIONS
        ====================================
        */
        const data =
          await integrationsAPI.getIntegrations();
/*
====================================
META STATUS
====================================
*/
const meta =
  await metaAPI.getStatus();

if (meta.success) {

  setMetaStatus(
    meta.status
  );

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

      window.location.href =
        res.url;

    } catch (err) {

      console.error(err);

      setError(
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

      console.log("========================================");
console.log("FORM BEING SAVED");
console.log(form);
console.log("========================================");
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
      <WhatsAppSetupModal
        open={showWhatsAppModal}
        onClose={() =>
          setShowWhatsAppModal(false)
        }
      />

    

      <div className="space-y-6 text-white">

        {/* EXPIRED BANNER */}
        {isExpired && (

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-start gap-4">

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

                  Your integrations and automations are currently paused.
                  Renew your subscription to reactivate them.

                </p>

              </div>

            </div>

          </div>

        )}

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-3">

              <Sparkles
                size={12}
                className="text-purple-400"
              />

              <span className="text-[11px] text-gray-300">
                AI Automation Hub
              </span>

            </div>

            <h1 className="text-3xl font-bold mb-2">
              Integrations
            </h1>

            <p className="text-sm text-gray-400 max-w-xl">
              Connect communication channels and automate customer conversations with AI.
            </p>

          </div>

          <button
            onClick={handleSave}
            disabled={
              loading ||
              isExpired
            }
            className={`
              h-12
              px-6
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-medium
              transition-all
              ${
                isExpired
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-[#7f5af0] hover:opacity-90 shadow-[0_0_30px_rgba(127,90,240,0.35)]"
              }
            `}
          >

            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : isExpired ? (
              <Lock size={16} />
            ) : (
              <Save size={16} />
            )}

            {isExpired
              ? "Subscription Expired"
              : loading
              ? "Saving..."
              : "Save Integrations"}

          </button>

        </div>

        {/* SUCCESS */}
        {success && (

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 flex items-center gap-3">

            <CheckCircle2
              size={18}
              className="text-green-400"
            />

            <p className="text-sm text-green-200">
              {success}
            </p>

          </div>

        )}

        {/* ERROR */}
        {error && (

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-3">

            <AlertTriangle
              size={18}
              className="text-red-400"
            />

            <p className="text-sm text-red-200">
              {error}
            </p>

          </div>

        )}

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

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

                    <h3 className="text-sm font-medium">
                      Automation
                    </h3>

                    <p className="text-xs text-gray-400">
                      Enable AI auto replies
                    </p>

                  </div>

                  <AutomationToggle
                    enabled={
                      form.whatsapp_enabled
                    }
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
                  value={
                    form.whatsapp_access_token
                  }
                  onChange={handleChange}
                />

              </div>

            </IntegrationCard>

          </div>

          {/* FACEBOOK */}
          <div className="relative">

            {!isPro && (

              <LockedOverlay />

            )}

            <IntegrationCard
              title="Facebook Messenger"
              subtitle="Automate Messenger conversations with AI."
              icon={
                <PlatformIcon type="facebook" />
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

                    <h3 className="text-sm font-medium">
                      Automation
                    </h3>

                    <p className="text-xs text-gray-400">
                      Enable Messenger AI
                    </p>

                  </div>

                  <AutomationToggle
                    enabled={
                      form.facebook_enabled
                    }
                    onChange={(value) =>
                      handleToggle(
                        "facebook_enabled",
                        value
                      )
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

    <p className="text-xs text-gray-400">
  Facebook Page
</p>

<p className="text-sm font-medium mt-1">
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
  className="flex-1 h-11 rounded-2xl bg-purple-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
  className="flex-1 h-11 rounded-2xl bg-red-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
  className="w-full h-12 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

          {/* INSTAGRAM */}
          <div className="relative">

            {!isPro && (

              <LockedOverlay />

            )}

            <IntegrationCard
              title="Instagram DM Automation"
              subtitle="Automate Instagram DMs using AI."
              icon={
                <PlatformIcon type="instagram" />
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

                    <h3 className="text-sm font-medium">
                      Automation
                    </h3>

                    <p className="text-xs text-gray-400">
                      Enable Instagram AI replies
                    </p>

                  </div>

                  <AutomationToggle
                    enabled={
                      form.instagram_enabled
                    }
                    onChange={(value) =>
                      handleToggle(
                        "instagram_enabled",
                        value
                      )
                    }
                  />

                </div>

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

    <p className="text-xs text-gray-400">
      Instagram
    </p>

    <p className="text-sm font-medium mt-1">

      {metaStatus?.meta_connected
        ? (metaStatus?.instagram_username || "Connected")
        : "Not Connected"}

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

              <label className="text-sm text-gray-300">
                Meeting Provider
              </label>

              <select
                name="meeting_provider"
                value={form.meeting_provider}
                onChange={handleChange}
                disabled={isExpired}
                className="w-full h-[54px] rounded-2xl bg-[#0f172a]/90 border border-purple-500/30 px-4 text-sm text-white outline-none"
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

    <div className="absolute inset-0 z-20 rounded-3xl backdrop-blur-sm bg-black/40 border border-purple-500/20 flex items-center justify-center p-6">

      <div className="text-center">

        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">

          <Crown
            size={24}
            className="text-yellow-300"
          />

        </div>

        <h3 className="text-lg font-semibold mb-2">

          Pro Feature

        </h3>

        <p className="text-sm text-gray-300 mb-5 max-w-[260px]">

          Upgrade to Pro to unlock WhatsApp, Facebook, and Instagram AI automation.

        </p>

        <a
          href="/app/pricing"
          className="inline-flex items-center justify-center h-11 px-5 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all text-sm font-medium"
        >

          Upgrade To Pro

        </a>

      </div>

    </div>

  );
}