import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

export default function Integrations() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    whatsapp_token: "",
    whatsapp_phone_id: "",
    facebook: "",
    calendly: ""
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= INIT USER + SESSION =================
  useEffect(() => {
    const init = async () => {
      try {
        setPageLoading(true);

        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          setError("User not logged in");
          setPageLoading(false);
          return;
        }

        const currentUser = sessionData.session.user;
        setUser(currentUser);

        const token = sessionData.session.access_token;

        // 🔥 FETCH INTEGRATIONS WITH TOKEN
        const res = await axios.get(`${API_URL}/api/integrations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data) {
          setForm({
            whatsapp_token: res.data.whatsapp_token || "",
            whatsapp_phone_id: res.data.whatsapp_phone_id || "",
            facebook: res.data.facebook || "",
            calendly: res.data.calendly || ""
          });
        }

      } catch (err) {
        console.error("Integration fetch error:", err);
        setError("Failed to load integrations");
      } finally {
        setPageLoading(false);
      }
    };

    init();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error("User not authenticated");
      }

      const token = sessionData.session.access_token;

      await axios.post(`${API_URL}/api/integrations`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Integrations saved 🚀");

    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save integrations");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading integrations...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-gray-400">
          Connect your tools to automate replies & bookings
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* WHATSAPP */}
        <Card title="WhatsApp Automation">
          <Input
            name="whatsapp_phone_id"
            placeholder="Phone Number ID"
            value={form.whatsapp_phone_id}
            onChange={handleChange}
          />

          <Input
            name="whatsapp_token"
            placeholder="Access Token"
            value={form.whatsapp_token}
            onChange={handleChange}
          />

          <p className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
            Get from Meta Developer → WhatsApp API
          </p>
        </Card>

        {/* FACEBOOK */}
        <Card title="Facebook / Messenger">
          <Input
            name="facebook"
            placeholder="Page Access Token"
            value={form.facebook}
            onChange={handleChange}
          />
        </Card>

        {/* CALENDLY */}
        <Card title="Calendly Booking">
          <Input
            name="calendly"
            placeholder="https://calendly.com/your-link"
            value={form.calendly}
            onChange={handleChange}
          />
        </Card>

      </div>

      {/* SAVE */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#7f5af0] to-[#9f7aea] hover:scale-105 transition shadow-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Integrations"}
      </button>

    </div>
  );
}

/* COMPONENTS */

function Card({ title, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-purple-500"
    />
  );
}