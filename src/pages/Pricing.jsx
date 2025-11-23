// src/pages/Pricing.jsx
import { motion } from "framer-motion";
import FloatingMenu from "../components/FloatingMenu";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useState, useEffect } from "react";

const PLANS = {
  free: { amount: 0, duration: 1, display: "₹0 / 1 Day" },
  basic: { amount: 999, duration: 30, display: "₹999 / month" },
  pro: { amount: 1999, duration: 30, display: "₹1999 / month" },
};

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [userEmail, setUserEmail] = useState("");

  let BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  if (BACKEND_URL.endsWith("/")) BACKEND_URL = BACKEND_URL.slice(0, -1);

  const plans = [
    {
      name: "Free Trial",
      slug: "free",
      description: "Try all features for 24 hours — no card required.",
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
      description: "Perfect for websites that need chatbot integration.",
      features: ["Website chatbot widget", "Lead export", "Email support"],
      highlight: false,
    },
    {
      name: "Pro Plan",
      slug: "pro",
      description: "Unlock ALL features — scale without limits.",
      features: [
        "AI Chatbot everywhere",
        "WhatsApp & Messenger automation",
        "Calendly booking auto-sync",
        "Lead collection & export",
        "Insanely good website widget",
        "Multi-language support",
        "Priority support",
      ],
      highlight: true,
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserEmail(data.user.email);
    };
    loadUser();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  // --------------------
  // FREE TRIAL
  // --------------------
  const handleFreeTrial = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return showToast("Please log in first.", "error");

      const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
        plan: "free",
        user_id: user.id,
      });

      if (!data?.success)
        return showToast(`Free trial failed: ${data.error}`, "error");

      showToast("🎉 Free trial activated! Enjoy 24 hours of full access.");
    } catch (err) {
      showToast(err.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // PAID PLANS
  // --------------------
  const handlePaidPlan = async (slug) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return showToast("Please log in first.", "error");

      const plan = PLANS[slug];

      const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
        plan: slug,
        user_id: user.id,
      });

      if (!data?.order?.id)
        return showToast("Order creation failed.", "error");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "AIAERA",
        description: `${slug.toUpperCase()} Subscription`,
        order_id: data.order.id,

        handler: async (response) => {
          try {
            const verify = await axios.post(`${BACKEND_URL}/api/payment/verify-payment`, {
              plan: slug,
              user_id: user.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify.data?.success) {
              showToast(`${slug.toUpperCase()} plan activated successfully!`);
            } else {
              showToast(verify.data?.error || "Payment verification failed.", "error");
            }
          } catch (err) {
            showToast("Payment verification failed.", "error");
          }
        },

        prefill: { email: user.email },
        theme: { color: "#9b8cff" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#12122a] to-[#0f0f1f] text-white overflow-hidden font-[Inter]">
      <FloatingMenu userEmail={userEmail} />

      {/* Background Effects */}
      <motion.div
        animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 14 }}
        className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full blur-[120px] bg-gradient-to-br from-[#bfa7ff]/25 to-[#7f5af0]/15"
      />

      <motion.div
        animate={{ opacity: [0.25, 0.55, 0.25], scale: [1.05, 1, 1.05] }}
        transition={{ repeat: Infinity, duration: 16 }}
        className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full blur-[130px] bg-gradient-to-tr from-[#7f5af0]/20 to-[#9b8cff]/15"
      />

      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-sm z-50 shadow-xl ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[#9b8cff] via-[#cbb5ff] to-[#ffffff] bg-clip-text text-transparent mb-16"
        >
          Pricing Plans
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={`relative p-8 rounded-3xl shadow-xl backdrop-blur-xl border flex flex-col hover:scale-[1.03] transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-br from-[#9b8cff]/20 to-[#bfa7ff]/10 border-[#bfa7ff]/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] shadow-md">
                  Most Popular
                </span>
              )}

              <h2 className="text-2xl font-semibold mb-3">{plan.name}</h2>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-[#9b8cff] to-[#d0c4ff] bg-clip-text text-transparent mb-5">
                {PLANS[plan.slug].display}
              </p>
              <p className="text-gray-300 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff]" />
                    {feat}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onClick={() =>
                  plan.slug === "free"
                    ? handleFreeTrial()
                    : handlePaidPlan(plan.slug)
                }
                className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] text-white shadow-xl hover:from-[#bfa7ff] hover:to-[#d6caff]"
                    : "bg-white/10 text-[#d6d1ff] hover:bg-white/20"
                } disabled:opacity-50`}
              >
                {loading
                  ? "Processing..."
                  : plan.slug === "free"
                  ? "Start Free Trial"
                  : "Subscribe"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
