import { useNavigate } from "react-router-dom";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Crown,
} from "lucide-react";

const pricingPlans = [
  {
    title: "Free",
    price: "₹0",
    period: "/month",
    subtitle: "Perfect for individuals exploring AI automation.",
    badge: "Get Started",
    icon: Sparkles,
    popular: false,
    button: "Start Free",
    features: [
      "1 AI Chatbot",
      "Website Integration",
      "Basic AI Responses",
      "Lead Collection",
      "1,000 Monthly Messages",
      "Email Support",
    ],
  },
  {
    title: "Basic",
    price: "₹999",
    period: "/month",
    subtitle: "Everything you need for a growing business.",
    badge: "Best Value",
    icon: Zap,
    popular: false,
    button: "Choose Basic",
    features: [
      "Unlimited Website Chats",
      "Custom Branding",
      "Advanced Analytics",
      "Lead Dashboard",
      "Priority Email Support",
      "Unlimited Documents",
    ],
  },
  {
    title: "Pro",
    price: "₹1999",
    period: "/month",
    subtitle: "Complete AI automation suite for modern businesses.",
    badge: "Most Popular",
    icon: Crown,
    popular: true,
    button: "Start Pro",
    features: [
      "Everything in Basic",
      "WhatsApp Automation",
      "Facebook & Instagram",
      "Appointment Booking",
      "Multi-language AI",
      "Premium Priority Support",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-32"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_35%)]" />

      <div className="absolute -top-40 -left-32 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[170px]" />

      <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[170px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}

        <div className="mx-auto mb-24 max-w-4xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-white/[0.05] px-5 py-2 backdrop-blur-xl">

            <Sparkles
              size={16}
              className="text-violet-300"
            />

            <span className="text-sm text-violet-200">
              Flexible Pricing
            </span>

          </div>

          <h2 className="text-5xl font-black leading-[1.05] md:text-7xl">

            Simple Pricing

            <br />

            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">

              Built For Every Business

            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">

            Start free and upgrade whenever your business grows.
            Every plan includes powerful AI features designed to automate
            customer conversations and generate more leads.

          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {pricingPlans.map((plan) => {

            const Icon = plan.icon;

            return (

              <div
                key={plan.title}
                className={`group relative overflow-hidden rounded-[36px] border p-10 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-3 ${
                  plan.popular
                    ? "border-violet-500/40 bg-gradient-to-b from-violet-500/20 to-white/[0.04] shadow-[0_30px_90px_rgba(99,102,241,0.35)]"
                    : "border-white/10 bg-white/[0.04] hover:border-violet-500/30"
                }`}
              >

                {/* Popular Badge */}

                {plan.popular && (

                  <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-[0_10px_30px_rgba(99,102,241,0.45)]">

                    Most Popular

                  </div>

                )}

                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100" />

                <div className="relative z-10">

                  <div className="mb-8 flex h-18 w-18 items-center justify-center rounded-[26px] bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_20px_45px_rgba(99,102,241,0.45)]">

                    <Icon size={34} />

                  </div>

                  <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-violet-200">

                    {plan.badge}

                  </div>

                  <h3 className="text-3xl font-black">

                    {plan.title}

                  </h3>

                  <p className="mt-3 leading-7 text-white/55">

                    {plan.subtitle}

                  </p>

                  <div className="mt-10 flex items-end gap-2">

                    <span className="text-6xl font-black">

                      {plan.price}

                    </span>

                    <span className="pb-2 text-white/45">

                      {plan.period}

                    </span>

                  </div>

                  <div className="mt-10 space-y-5">

                    {plan.features.map((feature) => (

                      <div
                        key={feature}
                        className="flex items-center gap-4"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">

                          <Check
                            size={16}
                            className="text-violet-300"
                          />

                        </div>

                        <span className="text-white/75">

                          {feature}

                        </span>

                      </div>

                    ))}

                  </div>
                                    {/* CTA */}

                  <button
                    onClick={() => navigate("/signup")}
                    className={`group mt-10 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 shadow-[0_20px_50px_rgba(99,102,241,0.45)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(99,102,241,0.55)]"
                        : "border border-white/10 bg-white/[0.05] hover:border-violet-500/30 hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.button}

                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />

                  </button>

                </div>

                {/* Bottom Glow */}

                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-600 opacity-0 transition-all duration-500 group-hover:opacity-100" />

              </div>

            );

          })}

        </div>

        {/* Trust Cards */}

        <div className="mt-24 grid gap-8 md:grid-cols-3">

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-3xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500">

              <ShieldCheck size={28} />

            </div>

            <h3 className="text-xl font-bold">

              Secure Payments

            </h3>

            <p className="mt-4 leading-7 text-white/60">

              All payments are securely processed through Razorpay with
              enterprise-grade encryption.

            </p>

          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-3xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600">

              <Sparkles size={28} />

            </div>

            <h3 className="text-xl font-bold">

              Upgrade Anytime

            </h3>

            <p className="mt-4 leading-7 text-white/60">

              Start with the free plan and upgrade whenever your business
              requires more AI automation.

            </p>

          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-3xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500">

              <Zap size={28} />

            </div>

            <h3 className="text-xl font-bold">

              Instant Activation

            </h3>

            <p className="mt-4 leading-7 text-white/60">

              Your AI assistant is ready within minutes after creating your
              account.

            </p>

          </div>

        </div>

        {/* Guarantee Strip */}

        <div className="mt-24 overflow-hidden rounded-[36px] border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-white/[0.03] to-blue-500/10 p-10 backdrop-blur-3xl">

          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

            <div>

              <h3 className="text-3xl font-black">

                Start Building With AIAERA Today

              </h3>

              <p className="mt-4 max-w-2xl leading-8 text-white/60">

                No hidden fees. No long-term contracts. Create your AI assistant
                in minutes and automate customer conversations 24/7.

              </p>

            </div>

            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 font-semibold shadow-[0_20px_50px_rgba(99,102,241,0.45)] transition-all duration-300 hover:-translate-y-1"
            >

              Get Started Free

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </div>

        </div>

        {/* Footer Note */}

        <div className="mt-14 text-center">

          <p className="text-sm text-white/45">

            ✓ No Hidden Charges &nbsp; • &nbsp;
            ✓ Cancel Anytime &nbsp; • &nbsp;
            ✓ Secure Razorpay Payments &nbsp; • &nbsp;
            ✓ Instant Setup

          </p>

        </div>

      </div>

    </section>
  );
};

export default PricingSection;