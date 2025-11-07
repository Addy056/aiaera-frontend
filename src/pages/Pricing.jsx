import { motion } from "framer-motion";
import FloatingMenu from "../components/FloatingMenu";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useState } from "react";

const PLANS = {
  free: { amount: 0, duration: 1, display: "₹0 / 1 Day" },
  basic: { amount: 999, duration: 30, display: "₹999 / month" },
  pro: { amount: 1999, duration: 30, display: "₹1999 / month" },
};

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const handleFreeTrial = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return showToast("Please log in first.", "error");

      const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
        plan: "free",
        user_id: user.id,
      });

      if (!data?.success) return showToast(`Free trial failed: ${data.error}`, "error");
      showToast("🎉 Free trial activated! Enjoy 24 hours of full access.", "success");
    } catch (err) {
      showToast(err.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

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
              showToast(`${slug.charAt(0).toUpperCase() + slug.slice(1)} plan activated successfully!`);
            else showToast(res.data.error || "Payment verification failed.", "error");
          } catch {
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
      <FloatingMenu />

      {/* Background glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8, scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 14 }}
        className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#bfa7ff]/25 to-[#7f5af0]/15 blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, scale: [1.05, 1, 1.05] }}
        transition={{ repeat: Infinity, duration: 16 }}
        className="absolute bottom-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#7f5af0]/20 to-[#9b8cff]/15 blur-[130px]"
      />

      {/* Toast message */}
      {toast.message && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl z-50 shadow-xl text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[#9b8cff] via-[#cbb5ff] to-[#ffffff] bg-clip-text text-transparent drop-shadow-sm">
            Pricing Plans
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            Choose the plan that grows with your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`relative rounded-3xl p-8 shadow-2xl backdrop-blur-xl border flex flex-col hover:scale-[1.03] duration-300 ${
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
              <p className="text-3xl font-extrabold mb-5 bg-gradient-to-r from-[#9b8cff] to-[#d0c4ff] bg-clip-text text-transparent">
                {PLANS[plan.slug].display}
              </p>
              <p className="text-gray-300 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] rounded-full shadow-sm" />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                onClick={() =>
                  plan.slug === "free" ? handleFreeTrial() : handlePaidPlan(plan.slug)
                }
                className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#9b8cff] to-[#bfa7ff] text-white shadow-lg hover:from-[#bfa7ff] hover:to-[#d0c4ff]"
                    : "bg-white/10 text-[#cfcaf8] hover:bg-white/20"
                } disabled:opacity-60`}
              >
                {loading
                  ? "Processing..."
                  : plan.slug === "free"
                  ? "Start Free Trial"
                  : "Get Started"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
