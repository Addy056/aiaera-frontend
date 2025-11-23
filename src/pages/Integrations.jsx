// src/pages/Integrations.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
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
  ExternalLink,
} from "lucide-react";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// GLOBAL CONSTANTS
const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.8777;

export default function Integrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [plan, setPlan] = useState("free");

  const [toast, setToast] = useState({ message: "", type: "" });

  const mountedRef = useRef(false);

  const [form, setForm] = useState({
    whatsapp_number_id: "",
    whatsapp_token: "",
    fb_page_id: "",
    fb_page_token: "",
    calendly_link: "",
    instagram_user_id: "",
    instagram_page_id: "",
    instagram_access_token: "",
    business_address: "",
    business_lat: DEFAULT_LAT,
    business_lng: DEFAULT_LNG,
    gmaps_link: "",
  });

  // Backend API base
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/integrations`;

  // ------------------------------
  // Toast Helper
  // ------------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      if (mountedRef.current) setToast({ message: "", type: "" });
    }, 6000);
  };

  // ------------------------------
  // INIT PAGE
  // ------------------------------
  useEffect(() => {
    mountedRef.current = true;
    initIntegrations();
    return () => (mountedRef.current = false);
  }, []);

  const initIntegrations = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) throw new Error("Unable to load user session.");

      setUserEmail(user.email);

      // Free access override
      if (user.email === FREE_ACCESS_EMAIL) {
        setSubscriptionActive(true);
        setPlan("pro");
        await fetchIntegrations(user.id);
        return setLoading(false);
      }

      // Subscription check
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .single();

      if (!sub || new Date(sub.expires_at) < new Date()) {
        setSubscriptionActive(false);
        return setLoading(false);
      }

      setSubscriptionActive(true);
      setPlan(sub.plan ?? "free");
      await fetchIntegrations(user.id);

      setLoading(false);
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  // ------------------------------
  // FETCH USER INTEGRATIONS
  // ------------------------------
  const fetchIntegrations = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}?user_id=${userId}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Error");

      const d = json.data || {};

      setForm((prev) => ({
        ...prev,
        ...d,
        business_lat: d.business_lat || prev.business_lat,
        business_lng: d.business_lng || prev.business_lng,
        gmaps_link:
          d.gmaps_link ||
          `https://www.google.com/maps?q=${prev.business_lat},${prev.business_lng}`,
      }));
    } catch (err) {
      showToast("Failed to fetch integrations: " + err.message, "error");
    }
  };

  // ------------------------------
  // HANDLE CHANGE
  // ------------------------------
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ------------------------------
  // HANDLE LOCATION & GMAPS LINK
  // ------------------------------
  const updateLocation = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      business_lat: lat,
      business_lng: lng,
      gmaps_link: `https://www.google.com/maps?q=${lat},${lng}`,
    }));
  };

  // ------------------------------
  // USE MY LOCATION
  // ------------------------------
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return showToast("Geolocation not supported", "error");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
        showToast("📍 Location updated!", "success");
      },
      (err) => {
        showToast("Failed to get location: " + err.message, "error");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ------------------------------
  // MAP CLICK SELECTOR
  // ------------------------------
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        updateLocation(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  // ------------------------------
  // SAVE INTEGRATIONS
  // ------------------------------
  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in.");

      const payload = { ...form, user_id: user.id };

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to save integrations");

      showToast("Integrations saved successfully!", "success");
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------
  // BLOCK PAGE IF SUBSCRIPTION EXPIRED
  // ------------------------------
  if (!loading && !subscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#090a1a] via-[#0f1025] to-[#080816] text-white text-center p-8">
        <h1 className="text-4xl font-bold mb-3">🚫 Subscription Expired</h1>
        <p className="text-gray-400 mb-6 text-lg">
          Renew to access Integrations Dashboard.
        </p>
        <a
          href="/pricing"
          className="px-6 py-3 rounded-2xl bg-[#7f5af0] hover:bg-[#9d7ff7] transition-all shadow-lg"
        >
          Renew Now
        </a>
      </div>
    );
  }

  // ------------------------------
  // LOADING SCREEN
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // ------------------------------
  // MAIN UI
  // ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#090a1a] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-br from-[#bfa7ff]/20 to-[#7f5af0]/10" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full blur-3xl bg-gradient-to-tr from-[#7f5af0]/15 to-[#00eaff]/10" />
      </div>

      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="relative px-4 sm:px-8 pt-10 pb-20 ml-0 md:ml-28 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#9d8dfd] via-[#bdafff] to-[#d4cfff] bg-clip-text text-transparent">
            Integrations Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Manage your AI assistant’s connections with ease ✨
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* WhatsApp */}
          <IntegrationCard
            title="WhatsApp (Meta Cloud API)"
            icon={<MessageCircle />}
          >
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
          <IntegrationCard
            title="Facebook Messenger"
            icon={<Facebook />}
          >
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

          {/* Instagram (Pro only) */}
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

          {/* Calendly */}
          <IntegrationCard title="Calendly" icon={<Calendar />}>
            <InputField
              name="calendly_link"
              value={form.calendly_link}
              onChange={handleChange}
              placeholder="Calendly Link"
            />
          </IntegrationCard>

          {/* Business Location */}
          <IntegrationCard title="Business Location" icon={<MapPin />}>
            <InputField
              name="business_address"
              value={form.business_address}
              onChange={handleChange}
              placeholder="Business Address"
            />

            {/* MAP */}
            <MemoizedMap
              lat={form.business_lat}
              lng={form.business_lng}
              address={form.business_address}
              gmaps_link={form.gmaps_link}
              onMapClick={updateLocation}
            />

            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-400">
                Click the map or use GPS to update location.
              </p>

              <button
                onClick={detectLocation}
                className="flex items-center gap-2 px-4 py-2 bg-[#7f5af0]/80 hover:bg-[#9d8dfd] text-white rounded-xl text-sm transition-all"
              >
                <Crosshair className="w-4 h-4" /> Use My Location
              </button>
            </div>
          </IntegrationCard>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#7f5af0] via-[#9e8ffb] to-[#bfa7ff] hover:from-[#9b7ff9] hover:to-[#d6c6ff] transition-all font-semibold shadow-lg disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-white" />{" "}
            {saving ? "Saving..." : "Save Integrations"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------- Map Component ---------------------- */

const MemoizedMap = React.memo(function MapPreview({
  lat,
  lng,
  address,
  gmaps_link,
  onMapClick,
}) {
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[lat || DEFAULT_LAT, lng || DEFAULT_LNG]}
      zoom={13}
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="OpenStreetMap"
      />
      <Marker position={[lat || DEFAULT_LAT, lng || DEFAULT_LNG]}>
        <Popup>
          <div className="text-sm">
            {address ? (
              <>
                <strong>{address}</strong>
                <br />
              </>
            ) : null}

            <a
              href={gmaps_link}
              target="_blank"
              rel="noreferrer"
              className="text-[#7f5af0] underline flex items-center gap-1 mt-1"
            >
              Open in Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Popup>
      </Marker>

      <LocationSelector />
    </MapContainer>
  );
});

/* ---------------------- UI Components ---------------------- */

function IntegrationCard({ title, icon, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg hover:bg-white/10 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#bfa7ff]/30 to-[#7f5af0]/20 shadow-inner">
          {React.cloneElement(icon, { className: "w-5 h-5 text-[#9d8dfd]" })}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white/90">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

function LockedCard({ title }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 text-center shadow-lg text-gray-400"
    >
      <Lock className="w-8 h-8 mb-3 text-[#bfa7ff]" />
      <p className="text-sm mb-2 font-semibold">{title}</p>
      <p className="text-xs text-gray-500">🔒 Available only in the Pro plan</p>
    </motion.div>
  );
}

function InputField({ name, value, onChange, placeholder }) {
  return (
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none focus:bg-white/20 focus:ring-2 focus:ring-[#9d8dfd]/50 transition-all"
    />
  );
}
