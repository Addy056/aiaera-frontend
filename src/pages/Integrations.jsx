// src/pages/Integrations.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper to check subscription expiry
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
    business_lat: 19.076, // Mumbai default
    business_lng: 72.8777,
  });
  const [loading, setLoading] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const mountedRef = useRef(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/integrations";

  useEffect(() => {
    mountedRef.current = true;
    init();
    return () => { mountedRef.current = false; };
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Unable to fetch user session.");

      // Bypass subscription for admin
      if (user.email === "aiaera056@gmail.com") {
        setSubscriptionActive(true);
        await fetchIntegrations(user.id);
        return;
      }

      const { data: subscription, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subErr && subErr.code !== "PGRST116") throw subErr;
      if (!subscription || isExpired(subscription.expires_at)) {
        setSubscriptionActive(false);
        return;
      }

      setSubscriptionActive(true);
      await fetchIntegrations(user.id);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const fetchIntegrations = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}?user_id=${userId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error: ${text}`);
      }
      const data = await res.json();
      if (mountedRef.current && data?.integrations) {
        const integ = data.integrations;
        setForm((prev) => ({
          ...prev,
          whatsapp_number: integ.whatsapp_number || "",
          whatsapp_token: integ.whatsapp_token || "",
          fb_page_id: integ.fb_page_id || "",
          fb_page_token: integ.fb_page_token || "",
          calendly_link: integ.calendly_link?.replace(/<[^>]*>/g, "").trim() || "",
          instagram_user_id: integ.instagram_user_id || "",
          instagram_page_id: integ.instagram_page_id || "",
          instagram_access_token: integ.instagram_access_token || "",
          business_address: integ.business_address || "",
          business_lat: integ.business_lat || 19.076,
          business_lng: integ.business_lng || 72.8777,
        }));
      }
    } catch (err) {
      showToast("Error fetching integrations: " + err.message, "error");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in.");

      let cleanCalendly = form.calendly_link.replace(/<[^>]*>/g, "").trim();
      if (cleanCalendly && !/^https?:\/\//i.test(cleanCalendly)) cleanCalendly = "https://" + cleanCalendly;

      const payload = { ...form, calendly_link: cleanCalendly, user_id: user.id };
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Failed to save integrations");

      showToast("✅ Integrations saved successfully!", "success");
    } catch (err) {
      showToast("Failed to save integrations: " + err.message, "error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => { if (mountedRef.current) setToast({ message: "", type: "" }); }, 4000);
  };

  if (!subscriptionActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-950 text-white p-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Subscription Expired 🚫</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 text-center">
          Your subscription has expired. Please renew to access Integrations.
        </p>
        <a href="/pricing" className="px-6 py-3 rounded-2xl bg-purple-600/80 hover:bg-purple-700 transition font-semibold">
          Renew Now
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 sm:p-8 overflow-hidden">
      {toast.message && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-lg text-white z-50 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-purple-950 animate-gradient"></div>
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600/30 rounded-full blur-3xl top-10 sm:top-20 left-5 sm:left-10 animate-pulse"></div>
        <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-fuchsia-500/20 rounded-full blur-3xl bottom-5 sm:bottom-10 right-5 sm:right-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 text-white">
        <div className="p-4 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(127,90,240,0.6)] hover:shadow-[0_0_70px_rgba(127,90,240,0.9)] transition-all transform hover:scale-[1.01]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-xl">
            Integrations Dashboard
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">
            Connect your WhatsApp, Facebook, Instagram, Calendly, and business location ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <IntegrationCard title="WhatsApp Integration">
            <input type="text" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="WhatsApp Business Number" className="input-field" />
            <input type="text" name="whatsapp_token" value={form.whatsapp_token} onChange={handleChange} placeholder="WhatsApp API Token" className="input-field" />
          </IntegrationCard>

          <IntegrationCard title="Facebook Messenger Integration">
            <input type="text" name="fb_page_id" value={form.fb_page_id} onChange={handleChange} placeholder="Facebook Page ID" className="input-field" />
            <input type="text" name="fb_page_token" value={form.fb_page_token} onChange={handleChange} placeholder="Facebook Page Access Token" className="input-field" />
          </IntegrationCard>

          <IntegrationCard title="Instagram Integration">
            <input type="text" name="instagram_user_id" value={form.instagram_user_id} onChange={handleChange} placeholder="Instagram User ID" className="input-field" />
            <input type="text" name="instagram_page_id" value={form.instagram_page_id} onChange={handleChange} placeholder="Connected Facebook Page ID" className="input-field" />
            <input type="text" name="instagram_access_token" value={form.instagram_access_token} onChange={handleChange} placeholder="Instagram Access Token" className="input-field" />
          </IntegrationCard>

          <IntegrationCard title="Calendly Integration">
            <input type="text" name="calendly_link" value={form.calendly_link} onChange={handleChange} placeholder="Calendly Link" className="input-field" />
          </IntegrationCard>

          <IntegrationCard title="Business Location">
            <input type="text" name="business_address" value={form.business_address} onChange={handleChange} placeholder="Enter your business address" className="input-field" />
            <MapContainer center={[form.business_lat, form.business_lng]} zoom={12} style={{ height: "250px", width: "100%", borderRadius: "1rem" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <Marker position={[form.business_lat, form.business_lng]}>
                <Popup>{form.business_address || "Business Location"}</Popup>
              </Marker>
            </MapContainer>
          </IntegrationCard>
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold shadow-xl hover:scale-105 hover:shadow-[0_0_35px_rgba(127,90,240,0.8)] transition-all disabled:opacity-50">
          {loading ? "Saving..." : "Save Integrations"}
        </button>
      </div>

      <style>{`
        .animate-gradient { background-size: 400% 400%; animation: gradientShift 15s ease infinite; }
        @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        .animate-pulse-slow { animation: pulse 10s infinite ease-in-out; }
        .input-field { width:100%; margin-bottom:0.75rem; padding:0.85rem 1rem; border-radius:0.75rem; background:rgba(255,255,255,0.2); color:white; outline:none; transition:all 0.2s; font-size:0.875rem; }
        .input-field::placeholder { color:#d1d5db; }
        .input-field:focus { background:rgba(255,255,255,0.25); box-shadow:0 0 0 2px #a855f7; }
      `}</style>
    </div>
  );
}

function IntegrationCard({ title, children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-4 sm:p-6 border border-white/20 hover:scale-[1.01] transition-all">
      <h2 className="text-lg sm:text-xl font-semibold text-purple-300 mb-3 sm:mb-4">{title}</h2>
      {children}
    </div>
  );
}
