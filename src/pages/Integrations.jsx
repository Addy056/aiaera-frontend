import {
  MessageCircle,
  MessageSquare,
  Calendar,
  Save,
  Loader2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  MapPinned,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabase";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function Integrations() {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState({
      whatsapp_token: "",
      whatsapp_phone_id: "",
      facebook: "",
      calendly: "",
      maps: "",
    });

  // ================= INIT =================
  useEffect(() => {

    const init = async () => {

      try {

        setPageLoading(true);

        const {
          data: sessionData,
        } = await supabase.auth.getSession();

        if (
          !sessionData.session
        ) {

          setError(
            "User not authenticated"
          );

          return;
        }

        const currentUser =
          sessionData.session.user;

        setUser(currentUser);

        const token =
          sessionData.session
            .access_token;

        // FETCH INTEGRATIONS
        const res = await axios.get(
          `${API_URL}/api/integrations`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (res.data) {

          setForm({
  whatsapp_token:
    res.data.whatsapp_token || "",

  whatsapp_phone_id:
    res.data.whatsapp_phone_id || "",

  facebook:
    res.data.facebook || "",

  calendly:
    res.data.calendly || "",

  maps:
    res.data.maps || "",
});
        }

      } catch (err) {

        console.error(
          "Integration Fetch Error:",
          err
        );

        setError(
          "Failed to load integrations"
        );

      } finally {

        setPageLoading(false);

      }
    };

    init();

  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  // ================= SAVE =================
  const handleSave = async () => {

    try {

      setLoading(true);

      setError("");

      setSuccess("");

      const {
        data: sessionData,
      } = await supabase.auth.getSession();

      if (
        !sessionData.session
      ) {
        throw new Error(
          "User not authenticated"
        );
      }

      const token =
        sessionData.session
          .access_token;

      await axios.post(
        `${API_URL}/api/integrations`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Integrations saved successfully 🚀"
      );

    } catch (err) {

      console.error(
        "Save Error:",
        err
      );

      setError(
        err.response?.data
          ?.error ||
          err.message ||
          "Failed to save integrations"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= LOADING =================
  if (pageLoading) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <Loader2
            className="animate-spin text-purple-500 mb-4"
            size={36}
          />

          <p className="text-gray-400 text-sm">
            Loading integrations...
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
              AI Automation Hub
            </span>

          </div>

          <h1 className="text-3xl font-bold mb-1">
            Integrations
          </h1>

          <p className="text-gray-400 text-sm">
            Connect external tools for
            automation, replies &
            appointments.
          </p>

        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="h-12 px-6 rounded-2xl bg-[#7f5af0] hover:opacity-90 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-60"
        >

          {loading ? (
            <Loader2
              className="animate-spin"
              size={16}
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
            className="text-green-400"
            size={18}
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
            className="text-red-400"
            size={18}
          />

          <p className="text-sm text-red-200">
            {error}
          </p>

        </div>

      )}

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* WHATSAPP */}
        <Card
          title="WhatsApp Cloud API"
          subtitle="Automate WhatsApp replies using Meta Cloud API"
          icon={
            <MessageCircle size={18} />
          }
        >

          <Input
            name="whatsapp_phone_id"
            placeholder="Phone Number ID"
            value={
              form.whatsapp_phone_id
            }
            onChange={handleChange}
          />

          <Input
            name="whatsapp_token"
            placeholder="Permanent Access Token"
            value={
              form.whatsapp_token
            }
            onChange={handleChange}
          />

          <InfoBox>
            Get credentials from Meta
            Developer Dashboard →
            WhatsApp → API Setup
          </InfoBox>

        </Card>

        {/* FACEBOOK */}
        <Card
          title="Facebook Messenger"
          subtitle="Connect your Facebook Page for automated replies"
          icon={<MessageSquare size={18} />}
        >

          <Input
            name="facebook"
            placeholder="Page Access Token"
            value={form.facebook}
            onChange={handleChange}
          />

          <InfoBox>
            Add your Facebook Page
            Access Token from Meta
            Developers.
          </InfoBox>

        </Card>

        {/* CALENDLY */}
        <Card
          title="Calendly Booking"
          subtitle="Allow users to book appointments directly"
          icon={<Calendar size={18} />}
        >

          <Input
            name="calendly"
            placeholder="https://calendly.com/your-link"
            value={form.calendly}
            onChange={handleChange}
          />

          <InfoBox>
            Paste your Calendly booking
            link to allow appointment
            scheduling.
          </InfoBox>

        </Card>

        {/* GOOGLE MAPS */}
        <Card
          title="Business Location"
          subtitle="Allow customers to find your business location instantly"
          icon={<MapPinned size={18} />}
        >

          <Input
  name="maps"
  placeholder="https://maps.google.com/..."
  value={form.maps}
  onChange={handleChange}
/>

          <InfoBox>
            Paste your Google Maps business
            link. The AI chatbot will share
            this location when customers ask
            for your address or directions.
          </InfoBox>

        </Card>

       

      </div>

    </div>
  );
}

/* ================= CARD ================= */

function Card({
  title,
  subtitle,
  icon,
  children,
}) {

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">

      <div className="flex items-start gap-4 mb-6">

        <div className="w-12 h-12 rounded-2xl bg-[#7f5af0]/15 text-purple-400 flex items-center justify-center">

          {icon}

        </div>

        <div>

          <h2 className="text-lg font-semibold mb-1">
            {title}
          </h2>

          <p className="text-sm text-gray-400">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
}

/* ================= INPUT ================= */

function Input(props) {

  return (
    <div className="relative">

      <KeyRound
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
      />

      <input
        {...props}
        className="w-full h-12 rounded-2xl bg-white/[0.03] border border-white/5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500"
      />

    </div>
  );
}

/* ================= INFO ================= */

function InfoBox({
  children,
}) {

  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-xs text-gray-400 leading-relaxed">
      {children}
    </div>
  );
}

/* ================= SECURITY ================= */

function SecurityItem({
  title,
  desc,
}) {

  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">

      <div className="flex items-start gap-3">

        <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">

          <ShieldCheck size={16} />

        </div>

        <div>

          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>

          <p className="text-xs text-gray-400 leading-relaxed">
            {desc}
          </p>

        </div>

      </div>

    </div>
  );
}