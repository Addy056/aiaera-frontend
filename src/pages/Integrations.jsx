// src/pages/Integrations.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  MessageCircle,
  Facebook,
  Instagram,
  Calendar,
  MapPin,
  Save,
  Lock,
  Crosshair,
} from "lucide-react";

/* ✅ LEAFLET ICON FIX */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ✅ CONSTANTS */
const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.8777;

/* ✅ SAFE HELPERS */
const safeNum = (v, fb) =>
  typeof v === "number" && !isNaN(v) ? v : fb;

const safeStr = (v) =>
  typeof v === "string" ? v : "";

/* ✅ SAFE API URL (works even if one env is missing) */
const API_BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  ""
).replace(/\/$/, "") + "/api/integrations";

export default function Integrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const mountedRef = useRef(true);

  const [toast, setToast] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    whatsapp_number_id: "",
    whatsapp_token: "",
    fb_page_id: "",
    fb_page_token: "",
    instagram_user_id: "",
    instagram_page_id: "",
    instagram_access_token: "",
    business_address: "",
    business_lat: DEFAULT_LAT,
    business_lng: DEFAULT_LNG,
    gmaps_link: `https://www.google.com/maps?q=${DEFAULT_LAT},${DEFAULT_LNG}`,
  });

  const [meetingLinks, setMeetingLinks] = useState({
    calendly: "",
    google_meet: "",
    zoom: "",
    teams: "",
    other: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      if (mountedRef.current) setToast({ message: "", type: "" });
    }, 4000);
  };

  useEffect(() => {
    mountedRef.current = true;
    init();
    return () => (mountedRef.current = false);
  }, []);

  /* ✅ INIT WITH SAFE SUBSCRIPTION CHECK */
  const init = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      setUserEmail(user.email);

      // Free access email = always Pro
      if (user.email === FREE_ACCESS_EMAIL) {
        setPlan("pro");
        await fetchData(user.id);
        setLoading(false);
        return;
      }

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!sub) {
        setPlan("free");
        setLoading(false);
        return;
      }

      const expired = new Date(sub.expires_at) < new Date();
      const active = sub.plan === "free" || !expired;

      setPlan(sub.plan);
      if (active) {
        await fetchData(user.id);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ FETCH INTEGRATIONS – SAFE EVEN IF DATA IS MISSING */
  const fetchData = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}?user_id=${userId}`);
      const json = await res.json();

      const d = json?.data || {};

      const lat = safeNum(d.business_lat, DEFAULT_LAT);
      const lng = safeNum(d.business_lng, DEFAULT_LNG);

      setForm({
        whatsapp_number_id: safeStr(d.whatsapp_number_id),
        whatsapp_token: safeStr(d.whatsapp_token),
        fb_page_id: safeStr(d.fb_page_id),
        fb_page_token: safeStr(d.fb_page_token),
        instagram_user_id: safeStr(d.instagram_user_id),
        instagram_page_id: safeStr(d.instagram_page_id),
        instagram_access_token: safeStr(d.instagram_access_token),
        business_address: safeStr(d.business_address),
        business_lat: lat,
        business_lng: lng,
        gmaps_link:
          safeStr(d.gmaps_link) ||
          `https://www.google.com/maps?q=${lat},${lng}`,
      });

      setMeetingLinks({
        calendly: safeStr(d?.meeting_links?.calendly),
        google_meet: safeStr(d?.meeting_links?.google_meet),
        zoom: safeStr(d?.meeting_links?.zoom),
        teams: safeStr(d?.meeting_links?.teams),
        other: safeStr(d?.meeting_links?.other),
      });
    } catch {
      // If API fails, we just keep defaults, no crash
      showToast("Using default values (no saved integrations yet)", "error");
    }
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ✅ MAP LOCATION UPDATE – ALWAYS SAFE */
  const updateLocation = (lat, lng) => {
    const safeLat = safeNum(lat, DEFAULT_LAT);
    const safeLng = safeNum(lng, DEFAULT_LNG);

    setForm((p) => ({
      ...p,
      business_lat: safeLat,
      business_lng: safeLng,
      gmaps_link: `https://www.google.com/maps?q=${safeLat},${safeLng}`,
    }));
  };

  /* ✅ GEOLOCATION – SAFE FALLBACKS */
  const detectLocation = () => {
    if (!navigator.geolocation)
      return showToast("Location not supported in this browser", "error");

    navigator.geolocation.getCurrentPosition(
      (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
      () => showToast("Location permission denied", "error")
    );
  };

  /* ✅ SAVE – ONLY PRO OR FREE_ACCESS_EMAIL */
  const handleSave = async () => {
    if (plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL) {
      showToast("Upgrade to Pro to save integrations", "error");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      const payload = {
        ...form,
        user_id: user.id,
        meeting_links: meetingLinks,
      };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");

      showToast("Integrations saved successfully");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  /* ✅ UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#090a1a] text-white">
      {toast.message && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-black z-50">
          {toast.message}
        </div>
      )}

      <div className="px-6 pt-10 pb-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Integrations Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <IntegrationCard title="WhatsApp (Meta API)" icon={<MessageCircle />}>
            <InputField
              name="whatsapp_number_id"
              value={form.whatsapp_number_id}
              onChange={handleChange}
              placeholder="WhatsApp Number ID"
            />
            <InputField
              name="whatsapp_token"
              value={form.whatsapp_token}
              onChange={handleChange}
              placeholder="WhatsApp API Token"
            />
          </IntegrationCard>

          {/* Facebook */}
          <IntegrationCard title="Facebook Messenger" icon={<Facebook />}>
            <InputField
              name="fb_page_id"
              value={form.fb_page_id}
              onChange={handleChange}
              placeholder="Facebook Page ID"
            />
            <InputField
              name="fb_page_token"
              value={form.fb_page_token}
              onChange={handleChange}
              placeholder="Facebook Page Token"
            />
          </IntegrationCard>

          {/* Instagram – PRO ONLY */}
          {plan === "pro" || userEmail === FREE_ACCESS_EMAIL ? (
            <IntegrationCard title="Instagram" icon={<Instagram />}>
              <InputField
                name="instagram_user_id"
                value={form.instagram_user_id}
                onChange={handleChange}
                placeholder="Instagram User ID"
              />
              <InputField
                name="instagram_page_id"
                value={form.instagram_page_id}
                onChange={handleChange}
                placeholder="Connected Page ID"
              />
              <InputField
                name="instagram_access_token"
                value={form.instagram_access_token}
                onChange={handleChange}
                placeholder="Instagram Access Token"
              />
            </IntegrationCard>
          ) : (
            <LockedCard title="Instagram Integration" />
          )}

          {/* Meeting Links */}
          <IntegrationCard title="Meeting Links" icon={<Calendar />}>
            {Object.entries(meetingLinks).map(([key, value]) => (
              <InputField
                key={key}
                name={key}
                value={value}
                onChange={(e) =>
                  setMeetingLinks({
                    ...meetingLinks,
                    [key]: e.target.value,
                  })
                }
                placeholder={`${key.replace("_", " ")} link`}
              />
            ))}
          </IntegrationCard>

          {/* Business Location */}
          <IntegrationCard title="Business Location" icon={<MapPin />}>
            <InputField
              name="business_address"
              value={form.business_address}
              onChange={handleChange}
              placeholder="Business Address"
            />

            <MapPreview
              lat={safeNum(form.business_lat, DEFAULT_LAT)}
              lng={safeNum(form.business_lng, DEFAULT_LNG)}
              address={form.business_address}
              gmaps_link={form.gmaps_link}
              onMapClick={updateLocation}
            />

            <button
              onClick={detectLocation}
              className="mt-3 px-4 py-2 bg-[#7f5af0] rounded-lg"
            >
              <Crosshair className="inline-block w-4 h-4 mr-2" />
              Use My Location
            </button>
          </IntegrationCard>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL}
          className="mt-10 w-full py-3 bg-[#7f5af0] rounded-xl disabled:opacity-50"
        >
          <Save className="inline-block w-5 h-5 mr-2" />
          {saving ? "Saving..." : "Save Integrations"}
        </button>
      </div>
    </div>
  );
}

/* ✅ REUSABLE UI PIECES */

function InputField({ name, value, onChange, placeholder, disabled }) {
  return (
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 mb-3 rounded-lg bg-white/10 outline-none disabled:opacity-50"
    />
  );
}

function IntegrationCard({ title, icon, children }) {
  return (
    <motion.div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function LockedCard({ title }) {
  return (
    <motion.div className="bg-white/5 p-10 rounded-xl text-center text-gray-400 border border-white/10">
      <Lock className="w-8 h-8 mx-auto mb-3 text-purple-300" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs">Available only in Pro plan</p>
    </motion.div>
  );
}

/* ✅ MAP – FULLY SAFE TO MISSING VALUES */
function MapPreview({ lat, lng, address, gmaps_link, onMapClick }) {
  const Selector = () => {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const safeLat = safeNum(lat, DEFAULT_LAT);
  const safeLng = safeNum(lng, DEFAULT_LNG);
  const safeLink =
    gmaps_link ||
    `https://www.google.com/maps?q=${safeLat},${safeLng}`;

  return (
    <MapContainer
      center={[safeLat, safeLng]}
      zoom={13}
      style={{ height: "240px", borderRadius: "1rem", marginTop: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[safeLat, safeLng]}>
        <Popup>
          <strong>{address || "Business Location"}</strong>
          <br />
          <a href={safeLink} target="_blank" rel="noreferrer">
            Open in Maps
          </a>
        </Popup>
      </Marker>
      <Selector />
    </MapContainer>
  );
}
