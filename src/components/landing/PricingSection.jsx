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
    subtitle: "Perfect for getting started with AI automation.",
    badge: "Get Started",
    icon: Sparkles,
    popular: false,
    button: "Start Free",
    features: [
      "1 AI Chatbot",
      "Website Integration",
      "Lead Collection",
      "1,000 Monthly Messages",
      "Basic AI Responses",
      "Email Support",
    ],
  },
  {
    title: "Basic",
    price: "₹999",
    period: "/month",
    subtitle: "Built for growing businesses and startups.",
    badge: "Best Value",
    icon: Zap,
    popular: false,
    button: "Choose Basic",
    features: [
      "Unlimited Website Chats",
      "Unlimited Documents",
      "Lead Dashboard",
      "Advanced Analytics",
      "Custom Branding",
      "Priority Email Support",
    ],
  },
  {
    title: "Pro",
    price: "₹1999",
    period: "/month",
    subtitle: "Complete AI automation across every channel.",
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
      "Premium Support",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-slate-50 py-28"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_35%)]" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-200 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-100 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}

        <div className="mx-auto mb-20 max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2">

            <Sparkles
              size={16}
              className="text-violet-600"
            />

            <span className="text-sm font-semibold text-violet-700">
              Flexible Pricing
            </span>

          </div>

          <h2 className="text-4xl font-black leading-tight text-slate-900 md:text-6xl">

            Simple Pricing

            <br />

            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">

              Built For Every Business

            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">

            Start free and upgrade whenever your business grows.
            Every plan includes powerful AI tools to automate
            conversations, capture leads and increase productivity.

          </p>

        </div>

        {/* Pricing Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {pricingPlans.map((plan) => {

            const Icon = plan.icon;

            return (

              <div
                key={plan.title}
                className={`relative rounded-3xl border bg-white p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.popular
                    ? "border-violet-500 shadow-xl shadow-violet-100"
                    : "border-slate-200 shadow-sm"
                }`}
              >

                {plan.popular && (

                  <div className="absolute right-6 top-6 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">

                    Most Popular

                  </div>

                )}

                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200">

                  <Icon
                    size={34}
                    className="text-white"
                  />

                </div>

                <div className="mb-5 inline-flex rounded-full bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700">

                  {plan.badge}

                </div>

                <h3 className="text-3xl font-black text-slate-900">

                  {plan.title}

                </h3>

                <p className="mt-3 leading-7 text-slate-600">

                  {plan.subtitle}

                </p>

                <div className="mt-10 flex items-end gap-2">

                  <span className="text-5xl font-black text-slate-900">

                    {plan.price}

                  </span>

                  <span className="pb-2 text-slate-500">

                    {plan.period}

                  </span>

                </div>

                <div className="mt-10 space-y-5">

                  {plan.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-4"
                    >

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">

                        <Check
                          size={16}
                          className="text-violet-600"
                        />

                      </div>

                      <span className="text-slate-700">

                        {feature}

                      </span>

                    </div>

                  ))}

                </div>

                <button
                  onClick={() => navigate("/signup")}
                  className={`group mt-10 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
                      : "border border-slate-200 bg-white text-slate-800 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >

                  {plan.button}

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </div>

            );

          })}

        </div>
                {/* Trust Cards */}

        <div className="mt-24 grid gap-8 md:grid-cols-3">

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-200">

              <ShieldCheck
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-xl font-bold text-slate-900">

              Secure Payments

            </h3>

            <p className="mt-4 leading-7 text-slate-600">

              All subscriptions are securely processed with
              enterprise-grade encryption and trusted payment
              infrastructure.

            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200">

              <Sparkles
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-xl font-bold text-slate-900">

              Upgrade Anytime

            </h3>

            <p className="mt-4 leading-7 text-slate-600">

              Begin with the free plan and upgrade whenever
              your business needs more AI conversations,
              automations and integrations.

            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-200">

              <Zap
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-xl font-bold text-slate-900">

              Instant Activation

            </h3>

            <p className="mt-4 leading-7 text-slate-600">

              Your AI assistant is ready within minutes after
              creating your account and uploading your
              business knowledge.

            </p>

          </div>

        </div>

        {/* CTA Banner */}

        <div className="mt-24 overflow-hidden rounded-[36px] border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 p-12 shadow-2xl shadow-violet-200">

          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

            <div>

              <h3 className="text-4xl font-black text-white">

                Ready To Build Your AI Employee?

              </h3>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-violet-100">

                Start free today, train your AI with your
                business knowledge and automate customer
                conversations 24/7.

              </p>

            </div>

            <button
              onClick={() => navigate("/signup")}
              className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-violet-700 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >

              Start Free Trial

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </div>

        </div>

        {/* Footer Note */}

        <div className="mt-12 text-center">

          <p className="text-sm font-medium text-slate-500">

            ✓ No Hidden Charges &nbsp; • &nbsp;
            ✓ Cancel Anytime &nbsp; • &nbsp;
            ✓ Secure Payments &nbsp; • &nbsp;
            ✓ Instant Setup

          </p>

        </div>

      </div>

    </section>
  );
};

export default PricingSection;