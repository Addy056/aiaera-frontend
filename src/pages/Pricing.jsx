import { motion } from "framer-motion";
import FloatingMenu from "../components/FloatingMenu";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useState } from "react";

const PLANS = {
  free: { amount: 0, duration: 1, display: "₹0 / 1 Day" },
  basic: { amount: 999, duration: 1, display: "₹999 / month" },
  pro: { amount: 1999, duration: 1, display: "₹1999 / month" },
};

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const plans = [
    {
      name: "Free Trial",
      slug: "free",
      description: "Try all features for 24 hours — no credit card required.",
      features: [
        "AI Chatbot everywhere",
        "WhatsApp & Messenger auto-replies",
        "Calendly booking integration",
        "Lead collection & export",
        "Website chatbot widget",
        "Multi-language support",
        "Priority support",
      ],
      highlight: false,
    },
    {
      name: "Basic Plan",
      slug: "basic",
      description: "Perfect for small businesses needing website integration.",
      features: ["Website chatbot widget", "Lead collection & export", "Email support"],
      highlight: false,
    },
    {
      name: "Pro Plan",
      slug: "pro",
      description: "Everything unlocked — scale without limits.",
      features: [
        "AI Chatbot everywhere",
        "WhatsApp & Messenger auto-replies",
        "Calendly booking integration",
        "Lead collection & export",
        "Website chatbot widget",
        "Multi-language support",
        "Priority support",
      ],
      highlight: true,
    },
  ];

  const handleFreeTrial = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Please log in first.");
      const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
        plan: "free",
        user_id: user.id,
      });
      if (!data?.success) return alert(`Free trial failed: ${data.error || "Unknown error"}`);
      alert("🎉 Free trial activated! Enjoy 24 hours of full access.");
    } catch (err) {
      console.error(err);
      alert(`Free trial failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidPlan = async (slug) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Please log in first.");
      const plan = PLANS[slug];
      if (!plan) return alert("Invalid plan selected.");
      const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
        plan: slug,
        user_id: user.id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order?.amount || plan.amount * 100,
        currency: "INR",
        name: "AIAERA",
        description: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Subscription`,
        order_id: data.order?.id,
        handler: async (response) => {
          try {
            const res = await axios.post(`${BACKEND_URL}/api/payment/verify-payment`, {
              plan: slug,
              user_id: user.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (res.data?.success)
              alert(`${slug.charAt(0).toUpperCase() + slug.slice(1)} plan activated successfully!`);
            else alert(`Payment verification failed: ${res.data.error || "Unknown error"}`);
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: { email: user.email },
        theme: { color: "#7f5af0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(`Payment failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      <FloatingMenu />

      {/* Background Blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 12 }}
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1.1, 1, 1.1] }}
        transition={{ repeat: Infinity, duration: 15 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[140px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Pricing Plans
          </h1>
          <p className="mt-4 text-gray-300 text-base sm:text-lg">
            Choose the plan that fits your business best
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`relative rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl border transition transform hover:scale-105 hover:shadow-purple-600/40 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-purple-500/40 shadow-lg shadow-purple-500/50 z-10"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md tracking-wide">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4">{plan.name}</h2>
              <p className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-6">{PLANS[plan.slug].display}</p>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-8">{plan.description}</p>

              <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-gray-200 text-sm sm:text-base">
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-md" />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onClick={() => (plan.slug === "free" ? handleFreeTrial() : handlePaidPlan(plan.slug))}
                className={`w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition mt-auto ${
                  plan.highlight
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40"
                    : "bg-white/10 text-purple-200 hover:bg-purple-700/30"
                }`}
              >
                {loading ? "Processing..." : plan.slug === "free" ? "Start Free Trial" : "Get Started"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
