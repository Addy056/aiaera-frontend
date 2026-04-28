import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Pricing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  // 🔥 AUTH HEADERS
  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      throw new Error("User not authenticated");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`,
    };
  };

  // 🔥 SAFE PARSER
  const parseResponse = async (res) => {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ RAW RESPONSE:", text);
      throw new Error("Invalid server response");
    }
  };

  // 🔥 PAYMENT
  const handlePayment = async (plan) => {
    if (!user) return alert("Please login first");

    setLoadingPlan(plan);
    setError("");

    try {
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers,
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", text);
        throw new Error("Failed to create order");
      }

      const data = await parseResponse(res);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "AIAERA",
        description: `${plan} plan`,
        order_id: data.orderId,

        handler: async function (response) {
          try {
            const verifyHeaders = await getAuthHeaders();

            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: verifyHeaders,
              body: JSON.stringify({
                ...response,
                plan,
              }),
            });

            const verifyData = await parseResponse(verifyRes);

            if (!verifyRes.ok) {
              throw new Error(verifyData.error);
            }

            // 🔥 FIX: refresh session + navigate
            await supabase.auth.refreshSession();
            navigate("/dashboard");

          } catch (err) {
            console.error(err);
            setError("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoadingPlan(null);
  };

  // 🔥 FREE TRIAL
  const handleFreePlan = async () => {
    if (!user) return alert("Login first");

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase.from("user_subscriptions").upsert({
        user_id: user.id,
        plan: "free",
        expires_at: expiresAt.toISOString(),
      });

      // 🔥 FIX HERE ALSO
      await supabase.auth.refreshSession();
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to activate trial");
    }
  };

  return (
    <div className="space-y-12 text-white p-6">

      <div className="text-center">
        <h2 className="text-4xl font-bold">Simple Pricing</h2>
        <p className="text-gray-400 mt-3">
          Start free for 7 days, upgrade anytime
        </p>
      </div>

      {error && (
        <div className="max-w-xl mx-auto bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <Card
          title="Free Trial"
          price="₹0"
          features={[
            "7 Days Full Access",
            "AI Chatbot Builder",
            "Leads Collection",
            "Appointments",
            "WhatsApp Automation",
            "Website Integration",
          ]}
          buttonText="Start 7-Day Trial"
          onClick={handleFreePlan}
        />

        <Card
          title="Basic"
          price="₹999/mo"
          features={[
            "Website Chatbot",
            "Basic Automation",
            "No WhatsApp",
            "Limited Features",
          ]}
          loading={loadingPlan === "basic"}
          buttonText="Choose Plan"
          onClick={() => handlePayment("basic")}
        />

        <Card
          title="Pro"
          price="₹1999/mo"
          highlight
          features={[
            "Everything in Free",
            "WhatsApp Automation",
            "Facebook & Instagram",
            "Advanced AI",
          ]}
          loading={loadingPlan === "pro"}
          buttonText="Go Pro"
          onClick={() => handlePayment("pro")}
        />

      </div>
    </div>
  );
}

/* CARD */
function Card({ title, price, features, buttonText, onClick, highlight, loading }) {
  return (
    <div className={`p-8 rounded-2xl border backdrop-blur-xl ${
      highlight
        ? "bg-gradient-to-br from-[#7f5af0]/40 to-[#9f7aea]/20 border-purple-500/30 shadow-xl scale-105"
        : "bg-white/5 border-white/10"
    }`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold mb-6">{price}</p>

      <ul className="space-y-3 mb-8 text-sm text-gray-300">
        {features.map((f, i) => <li key={i}>✔ {f}</li>)}
      </ul>

      <button
        onClick={onClick}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-[#7f5af0] text-white"
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </div>
  );
}