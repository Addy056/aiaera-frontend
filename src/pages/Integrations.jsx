import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Crown,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  integrationsAPI,
} from "../lib/api";

import { supabase } from "../lib/supabase";

import IntegrationCard from "../components/integrations/IntegrationCard";

import IntegrationInput from "../components/integrations/IntegrationInput";

import InfoBox from "../components/integrations/InfoBox";

import PlatformIcon from "../components/integrations/PlatformIcon";

import WhatsAppSetupModal from "../components/integrations/WhatsAppSetupModal";

import FacebookSetupModal from "../components/integrations/FacebookSetupModal";

import InstagramSetupModal from "../components/integrations/InstagramSetupModal";

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

  const [
    showFacebookModal,
    setShowFacebookModal,
  ] = useState(false);

  const [
    showInstagramModal,
    setShowInstagramModal,
  ] = useState(false);

  /*
  ========================================
  FORM
  ========================================
  */
  const [form, setForm] =
    useState({

      /*
      ====================================
      WHATSAPP
      ====================================
      */
      whatsapp_access_token: "",
      whatsapp_phone_id: "",
      whatsapp_enabled: false,

      /*
      ====================================
      FACEBOOK
      ====================================
      */
      facebook_page_id: "",
      facebook_page_access_token: "",
      facebook_enabled: false,

      /*
      ====================================
      INSTAGRAM
      ====================================
      */
      instagram_business_id: "",
      instagram_access_token: "",
      instagram_enabled: false,

      /*
      ====================================
      Meeting Provider
      ====================================
      */
      meeting_provider: "calendly",
      meeting_link: "",

      /*
      ====================================
      OTHER
      ====================================
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

        setForm({

          whatsapp_access_token:
            data.whatsapp_access_token || "",

          whatsapp_phone_id:
            data.whatsapp_phone_id || "",

          whatsapp_enabled:
            data.whatsapp_enabled || false,

          facebook_page_id:
            data.facebook_page_id || "",

          facebook_page_access_token:
            data.facebook_page_access_token || "",

          facebook_enabled:
            data.facebook_enabled || false,

          instagram_business_id:
            data.instagram_business_id || "",

          instagram_access_token:
            data.instagram_access_token || "",

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

      setSuccess(
        "Integrations saved successfully 🚀"
      );

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to save integrations"
      );

    } finally {

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

      <FacebookSetupModal
        open={showFacebookModal}
        onClose={() =>
          setShowFacebookModal(false)
        }
      />

      <InstagramSetupModal
        open={showInstagramModal}
        onClose={() =>
          setShowInstagramModal(false)
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
                form.facebook_page_access_token
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

                <IntegrationInput
                  name="facebook_page_id"
                  placeholder="Facebook Page ID"
                  value={
                    form.facebook_page_id
                  }
                  onChange={handleChange}
                />

                <IntegrationInput
                  name="facebook_page_access_token"
                  placeholder="Facebook Page Access Token"
                  value={
                    form.facebook_page_access_token
                  }
                  onChange={handleChange}
                />

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
                form.instagram_access_token
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

                <IntegrationInput
                  name="instagram_business_id"
                  placeholder="Instagram Business ID"
                  value={
                    form.instagram_business_id
                  }
                  onChange={handleChange}
                />

                <IntegrationInput
                  name="instagram_access_token"
                  placeholder="Instagram Access Token"
                  value={
                    form.instagram_access_token
                  }
                  onChange={handleChange}
                />

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