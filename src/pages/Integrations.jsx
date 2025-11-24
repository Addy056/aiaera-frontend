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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.8777;

export default function Integrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [plan, setPlan] = useState("free");

  const [toast, setToast] = useState({ message: "", type: "" });
  const mountedRef = useRef(false);

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
    gmaps_link: "",
  });

  // Meeting Links
  const [meetingLinks, setMeetingLinks] = useState({
    calendly: "",
    google_meet: "",
    zoom: "",
    teams: "",
    other: "",
  });

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/integrations`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      if (mountedRef.current) setToast({ message: "", type: "" });
    }, 6000);
  };

  useEffect(() => {
    mountedRef.current = true;
    initIntegrations();
    return () => (mountedRef.current = false);
  }, []);

  const initIntegrations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      setUserEmail(user.email);

      // FREE ACCESS EMAIL = PRO
      if (user.email === FREE_ACCESS_EMAIL) {
        setPlan("pro");
        await fetchIntegrations(user.id);
        return setLoading(false);
      }

      // Get subscription
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!sub) {
        setPlan("free");
        setLoading(false);
        return;
      }

      const expired = new Date(sub.expires_at) < new Date();
      const isActive = sub.plan === "free" ? true : !expired;

      setPlan(sub.plan);
      if (isActive) await fetchIntegrations(user.id);

      setLoading(false);
    } catch (err) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  // Fetch integrations from backend
  const fetchIntegrations = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}?user_id=${userId}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
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

      if (d.meeting_links) {
        setMeetingLinks({
          calendly: d.meeting_links.calendly || "",
          google_meet: d.meeting_links.google_meet || "",
          zoom: d.meeting_links.zoom || "",
          teams: d.meeting_links.teams || "",
          other: d.meeting_links.other || "",
        });
      }
    } catch (err) {
      showToast("Error fetching integrations", "error");
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const updateLocation = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      business_lat: lat,
      business_lng: lng,
      gmaps_link: `https://www.google.com/maps?q=${lat},${lng}`,
    }));
  };

  const handleSave = async () => {
    if (plan !== "pro" && userEmail !== FREE_ACCESS_EMAIL) {
      showToast("Upgrade to Pro to save integrations.", "error");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

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
      if (!json.success) throw new Error(json.error);

      showToast("Integrations saved!", "success");
    } catch (err) {
      showToast(err.message, "error");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#090a1a] text-white">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="px-6 pt-10 pb-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Integrations Dashboard</h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* WhatsApp — FREE */}
          <IntegrationCard title="WhatsApp (Meta API)" icon={<MessageCircle />}>
            <InputField
              name="whatsapp_number_id"
              value={form.whatsapp_number_id}
              onChange={(e) =>
                plan === "pro"
                  ? handleChange(e)
                  : showToast("Upgrade to Pro to edit", "error")
              }
              placeholder="WhatsApp Number ID"
              disabled={plan !== "pro"}
            />
            <InputField
              name="whatsapp_token"
              value={form.whatsapp_token}
              onChange={(e) =>
                plan === "pro"
                  ? handleChange(e)
                  : showToast("Upgrade to Pro to edit", "error")
              }
              placeholder="WhatsApp API Token"
              disabled={plan !== "pro"}
            />
          </IntegrationCard>

          {/* Facebook — FREE */}
          <IntegrationCard title="Facebook Messenger" icon={<Facebook />}>
            <InputField
              name="fb_page_id"
              value={form.fb_page_id}
              onChange={(e) =>
                plan === "pro"
                  ? handleChange(e)
                  : showToast("Pro only", "error")
              }
              placeholder="Facebook Page ID"
              disabled={plan !== "pro"}
            />
            <InputField
              name="fb_page_token"
              value={form.fb_page_token}
              onChange={(e) =>
                plan === "pro"
                  ? handleChange(e)
                  : showToast("Pro only", "error")
              }
              placeholder="Facebook Page Token"
              disabled={plan !== "pro"}
            />
          </IntegrationCard>

          {/* Instagram — PRO ONLY */}
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
                disabled={plan !== "pro"}
                onChange={(e) =>
                  plan === "pro"
                    ? setMeetingLinks({ ...meetingLinks, [key]: e.target.value })
                    : showToast("Upgrade to Pro to edit", "error")
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
              disabled={plan !== "pro"}
              onChange={(e) =>
                plan === "pro"
                  ? handleChange(e)
                  : showToast("Pro only", "error")
              }
              placeholder="Business Address"
            />

            <MapPreview
              lat={form.business_lat}
              lng={form.business_lng}
              address={form.business_address}
              gmaps_link={form.gmaps_link}
              onMapClick={(lat, lng) =>
                plan === "pro"
                  ? updateLocation(lat, lng)
                  : showToast("Pro only", "error")
              }
            />

            <button
              onClick={() =>
                plan === "pro"
                  ? detectLocation()
                  : showToast("Pro only", "error")
              }
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

/* Inputs */
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

/* UI Cards */
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

/* Map */
function MapPreview({ lat, lng, address, gmaps_link, onMapClick }) {
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
      center={[lat, lng]}
      zoom={13}
      style={{ height: "240px", borderRadius: "1rem", marginTop: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>{address}</strong>
          <br />
          <a href={gmaps_link} target="_blank" className="text-purple-400">
            Open in Maps
          </a>
        </Popup>
      </Marker>
      <LocationSelector />
    </MapContainer>
  );
}
