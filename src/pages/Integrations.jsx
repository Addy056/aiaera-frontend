import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  integrationsAPI,
} from "../lib/api";

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
      whatsapp_token: "",
      whatsapp_phone_id: "",
      whatsapp_enabled: false,

      /*
      ====================================
      FACEBOOK
      ====================================
      */
      facebook_page_id: "",
      facebook_page_token: "",
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
      OTHER
      ====================================
      */
      calendly: "",
      maps: "",
    });

  /*
  ========================================
  FETCH INTEGRATIONS
  ========================================
  */

  useEffect(() => {

    const loadIntegrations =
      async () => {

        try {

          setPageLoading(true);

          const data =
            await integrationsAPI.getIntegrations();

          setForm({

            whatsapp_token:
              data.whatsapp_token || "",

            whatsapp_phone_id:
              data.whatsapp_phone_id || "",

            whatsapp_enabled:
              data.whatsapp_enabled || false,

            facebook_page_id:
              data.facebook_page_id || "",

            facebook_page_token:
              data.facebook_page_token || "",

            facebook_enabled:
              data.facebook_enabled || false,

            instagram_business_id:
              data.instagram_business_id || "",

            instagram_access_token:
              data.instagram_access_token || "",

            instagram_enabled:
              data.instagram_enabled || false,

            calendly:
              data.calendly || "",

            maps:
              data.maps || "",
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

    loadIntegrations();

  }, []);

  /*
  ========================================
  HANDLE INPUT
  ========================================
  */

  const handleChange = (e) => {

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
              Connect WhatsApp,
              Facebook and Instagram
              to automate customer
              communication using AI.
            </p>

          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="h-12 px-6 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-60 shadow-[0_0_30px_rgba(127,90,240,0.35)]"
          >

            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {loading
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

            <AlertCircle
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

          <IntegrationCard
            title="WhatsApp Cloud API"
            subtitle="Automate WhatsApp conversations using Meta Cloud API."
            icon={
              <PlatformIcon type="whatsapp" />
            }
            status={
              form.whatsapp_token
                ? "connected"
                : "disconnected"
            }
          >

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
              name="whatsapp_token"
              placeholder="Permanent Access Token"
              value={
                form.whatsapp_token
              }
              onChange={handleChange}
            />

            <button
              onClick={() =>
                setShowWhatsAppModal(true)
              }
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View Setup Guide →
            </button>

            <InfoBox>
              Connect your WhatsApp
              Business account for AI
              powered customer replies.
            </InfoBox>

          </IntegrationCard>

          {/* FACEBOOK */}

          <IntegrationCard
            title="Facebook Messenger"
            subtitle="Automate Facebook Messenger replies using AI."
            icon={
              <PlatformIcon type="facebook" />
            }
            status={
              form.facebook_page_token
                ? "connected"
                : "disconnected"
            }
          >

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-sm font-medium">
                  Automation
                </h3>

                <p className="text-xs text-gray-400">
                  Enable Messenger automation
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
              name="facebook_page_token"
              placeholder="Facebook Page Access Token"
              value={
                form.facebook_page_token
              }
              onChange={handleChange}
            />

            <button
              onClick={() =>
                setShowFacebookModal(true)
              }
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View Setup Guide →
            </button>

            <InfoBox>
              Automatically reply to
              Facebook page messages
              using your AI chatbot.
            </InfoBox>

          </IntegrationCard>

          {/* INSTAGRAM */}

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

            <button
              onClick={() =>
                setShowInstagramModal(true)
              }
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View Setup Guide →
            </button>

            <InfoBox>
              Automatically respond to
              Instagram direct messages
              using AI.
            </InfoBox>

          </IntegrationCard>

          {/* CALENDLY */}

          <IntegrationCard
            title="Calendly Booking"
            subtitle="Allow visitors to schedule appointments instantly."
            icon={
              <PlatformIcon type="calendly" />
            }
            status={
              form.calendly
                ? "connected"
                : "disconnected"
            }
          >

            <IntegrationInput
              name="calendly"
              placeholder="https://calendly.com/your-link"
              value={form.calendly}
              onChange={handleChange}
            />

            <InfoBox>
              Your chatbot can share
              booking links directly
              during conversations.
            </InfoBox>

          </IntegrationCard>

          {/* MAPS */}

          <IntegrationCard
            title="Business Location"
            subtitle="Help customers find your business instantly."
            icon={
              <PlatformIcon type="maps" />
            }
            status={
              form.maps
                ? "connected"
                : "disconnected"
            }
          >

            <IntegrationInput
              name="maps"
              placeholder="https://maps.google.com/..."
              value={form.maps}
              onChange={handleChange}
            />

            <InfoBox>
              Your AI chatbot can share
              directions and business
              locations automatically.
            </InfoBox>

          </IntegrationCard>

        </div>

      </div>
    </>
  );
}