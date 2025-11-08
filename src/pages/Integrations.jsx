import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FloatingMenu from "../components/FloatingMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { MessageCircle, Facebook, Instagram, Calendar, MapPin, Save, Lock, Crosshair } from "lucide-react";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FREE_ACCESS_EMAIL = "aiaera056@gmail.com";
const isExpired = (dateStr) => !dateStr || new Date(dateStr) < new Date();

export default function Integrations() {
  const [form, setForm] = useState({
    whatsapp_number: "",
    whatsapp_token: "",
    fb_page_id: "",
    fb_page_token: "",
    calendly_link: "",
    instagram_user_id: "",
    instagram_page_id: "",
    instagram_access_token: "",
    business_address: "",
    business_lat: 19.076,
    business_lng: 72.8777,
  });

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [plan, setPlan] = useState("free");
  const [toast, setToast] = useState({ message: "", type: "" });
  const mountedRef = useRef(false);

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "")}/api/integrations`;

  useEffect(() => {
    mountedRef.current = true;
    init();
    detectLocation();
    return () => (mountedRef.current = false);
  }, []);

  // ✅ Detect user’s location (optional)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported on this device", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          business_lat: latitude,
          business_lng: longitude,
        }));
        showToast("📍 Location updated successfully!", "success");
      },
      (err) => {
        console.warn("⚠️ Location access denied:", err.message);
        showToast("Unable to access location. Please enable GPS.", "error");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // ✅ Initialization
  const init = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Unable to fetch user session.");
      setUserEmail(user.email);

      // ✅ Free Access Mode
      if (user.email === FREE_ACCESS_EMAIL) {
        setSubscriptionActive(true);
        setPlan("pro");
        await fetchIntegrations(user.id);
        return;
      }

      // ✅ Subscription check
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .single();

      if (!sub || isExpired(sub.expires_at)) {
        setSubscriptionActive(false);
        return;
      }

      setSubscriptionActive(true);
      setPlan(sub?.plan || "free");
      await fetchIntegrations(user.id);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // ✅ Fetch user integrations (partial-safe)
  const fetchIntegrations = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}?user_id=${userId}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Backend error fetching integrations");

      const safeData = json.data || {};
      setForm((prev) => ({
        ...prev,
        ...safeData,
        business_lat: safeData.business_lat || prev.business_lat,
        business_lng: safeData.business_lng || prev.business_lng,
      }));
    } catch (err) {
      showToast("Error fetching integrations: " + err.message, "error");
    }
  };

  // ✅ Handle input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Save integrations (ignore missing fields)
  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in.");

      const payload = { ...form, user_id: user.id };
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result?.error || "Failed to save integrations");

      showToast("✅ Integrations saved successfully!", "success");
    } catch (err) {
      showToast("Failed to save integrations: " + err.message, "error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // ✅ Toast handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      if (mountedRef.current) setToast({ message: "", type: "" });
    }, 4000);
  };

  // ✅ Map click handler
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setForm((prev) => ({
          ...prev,
          business_lat: e.latlng.lat,
          business_lng: e.latlng.lng,
        }));
      },
    });
    return null;
  };

  // ❌ Blocked if subscription expired
  if (!subscriptionActive) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#090a1a] via-[#0f1025] to-[#080816] text-white text-center p-8">
          <h1 className="text-4xl font-bold mb-3">🚫 Subscription Expired</h1>
          <p className="text-gray-400 mb-6 text-lg">Renew to access Integrations Dashboard.</p>
          <a href="/pricing" className="px-6 py-3 rounded-2xl bg-[#7f5af0] hover:bg-[#9d7ff7] transition-all shadow-lg">
            Renew Now
          </a>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#111129] to-[#090a1a] text-white relative overflow-hidden">
        <FloatingMenu userEmail={userEmail} />

        {/* Glowing Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-br from-[#bfa7ff]/20 to-[#7f5af0]/10"></div>
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full blur-3xl bg-gradient-to-tr from-[#7f5af0]/15 to-[#00eaff]/10"></div>
        </div>

        <div className="relative px-4 sm:px-8 pt-8 pb-16 ml-0 md:ml-28 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center sm:text-left"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#9d8dfd] via-[#bdafff] to-[#d4cfff] bg-clip-text text-transparent drop-shadow-sm">
              Integrations Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Manage your AI assistant’s connections with ease ✨
            </p>
          </motion.div>

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

          {/* Integration Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <IntegrationCard title="WhatsApp" icon={<MessageCircle />}>
              <InputField name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="WhatsApp Number" />
              <InputField name="whatsapp_token" value={form.whatsapp_token} onChange={handleChange} placeholder="WhatsApp API Token" />
            </IntegrationCard>

            <IntegrationCard title="Facebook Messenger" icon={<Facebook />}>
              <InputField name="fb_page_id" value={form.fb_page_id} onChange={handleChange} placeholder="FB Page ID" />
              <InputField name="fb_page_token" value={form.fb_page_token} onChange={handleChange} placeholder="FB Page Token" />
            </IntegrationCard>

            {plan === "pro" || userEmail === FREE_ACCESS_EMAIL ? (
              <IntegrationCard title="Instagram" icon={<Instagram />}>
                <InputField name="instagram_user_id" value={form.instagram_user_id} onChange={handleChange} placeholder="Instagram User ID" />
                <InputField name="instagram_page_id" value={form.instagram_page_id} onChange={handleChange} placeholder="Connected Page ID" />
                <InputField name="instagram_access_token" value={form.instagram_access_token} onChange={handleChange} placeholder="Instagram Access Token" />
              </IntegrationCard>
            ) : (
              <LockedCard title="Instagram Integration" />
            )}

            <IntegrationCard title="Calendly" icon={<Calendar />}>
              <InputField name="calendly_link" value={form.calendly_link} onChange={handleChange} placeholder="Calendly Link" />
            </IntegrationCard>

            <IntegrationCard title="Business Location" icon={<MapPin />}>
              <InputField name="business_address" value={form.business_address} onChange={handleChange} placeholder="Business Address" />
              <MapContainer
                center={[form.business_lat || 19.076, form.business_lng || 72.8777]}
                zoom={12}
                style={{ height: "250px", width: "100%", borderRadius: "1rem" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <Marker position={[form.business_lat || 19.076, form.business_lng || 72.8777]}>
                  <Popup>{form.business_address || "Business Location"}</Popup>
                </Marker>
                <LocationSelector />
              </MapContainer>

              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-400">Click the map or use your GPS to set location.</p>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-[#7f5af0] via-[#9e8ffb] to-[#bfa7ff] hover:from-[#9b7ff9] hover:to-[#d6c6ff] transition-all font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(127,90,240,0.3)] disabled:opacity-50"
            >
              <Save className="w-5 h-5 text-white" /> {loading ? "Saving..." : "Save Integrations"}
            </button>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ------------------ Helper Components ------------------ */
function IntegrationCard({ title, icon, children }) {
  return (
    <motion.div whileHover={{ scale: 1.015 }} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 sm:p-6 shadow-lg hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#bfa7ff]/30 to-[#7f5af0]/20 shadow-inner">
          {React.cloneElement(icon, { className: "w-5 h-5 text-[#9d8dfd]" })}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white/90">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
function LockedCard({ title }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="flex flex-col items-center justify-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 text-center shadow-lg text-gray-400">
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
