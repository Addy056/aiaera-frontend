import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";

const pricingPlans = [
  {
    title: "Free Plan",
    price: "₹0",
    subtitle: "Perfect for getting started",
    features: [
      "AI Chatbot Builder",
      "Website Integration",
      "Basic AI Responses",
      "Lead Collection",
      "1 Active Chatbot",
    ],
    button: "Start Free",
    popular: false,
  },
  {
    title: "Basic Plan",
    price: "₹999/mo",
    subtitle: "Best for growing businesses",
    features: [
      "Everything in Free",
      "Unlimited Website Chats",
      "Custom Branding",
      "Priority Support",
      "Advanced Analytics",
    ],
    button: "Get Basic",
    popular: false,
  },
  {
    title: "Pro Plan",
    price: "₹1999/mo",
    subtitle: "Complete AI automation suite",
    features: [
      "Everything in Basic",
      "WhatsApp Automation",
      "Facebook & Instagram Replies",
      "Appointment Booking",
      "Multi Language AI",
      "Premium Support",
    ],
    button: "Go Pro",
    popular: true,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-28"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-700/10 blur-[150px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.05] border border-purple-500/20 backdrop-blur-2xl text-purple-200 mb-6">
            <Sparkles size={16} />
            Flexible Pricing Plans
          </div>

          <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Simple &
            <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#818cf8] bg-clip-text text-transparent">
              {" "}
              Transparent Pricing
            </span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect AI automation plan for your business and scale
            customer engagement effortlessly.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-10">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[40px] border backdrop-blur-[30px] p-10 transition-all duration-500 hover:-translate-y-3 ${
                plan.popular
                  ? "border-purple-500/40 bg-gradient-to-b from-purple-500/20 to-white/[0.04] shadow-[0_20px_80px_rgba(124,58,237,0.35)]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-xs font-bold shadow-[0_10px_30px_rgba(124,58,237,0.4)]">
                  MOST POPULAR
                </div>
              )}

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10">
                {/* Plan Name */}
                <h3 className="text-3xl font-black mb-3">
                  {plan.title}
                </h3>

                {/* Subtitle */}
                <p className="text-white/55 mb-8">
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div className="mb-10">
                  <span className="text-6xl font-black">
                    {plan.price}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-5 mb-10">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Check size={16} className="text-purple-300" />
                      </div>

                      <span className="text-white/75">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_15px_40px_rgba(124,58,237,0.45)] hover:scale-[1.02]"
                      : "bg-white/[0.06] border border-white/10 hover:bg-white/[0.1]"
                  }`}
                >
                  {plan.button}
                </button>
              </div>

              {/* Bottom Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-14">
          <p className="text-white/45 text-sm">
            No hidden charges • Cancel anytime • Secure payments with Razorpay
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;