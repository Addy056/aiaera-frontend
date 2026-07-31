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
    title: "Free Trial",
    price: "₹0",
    period: "/7 Days",
    subtitle:
      "Explore AIAERA free for 7 days. No payment required.",
    badge: "7 DAY TRIAL",
    icon: Sparkles,
    popular: false,
    button: "Start Free Trial",
    features: [
      "Website AI Chatbot",
      "Lead Collection",
      "Appointment Booking",
      "Multi-language AI",
      "File Upload Training",
      "200 AI Messages",
    ],
  },
  {
    title: "Basic",
    price: "₹999",
    period: "/month",
    subtitle:
      "Perfect for businesses automating customer conversations.",
    badge: "BEST VALUE",
    icon: Zap,
    popular: false,
    button: "Choose Basic",
    features: [
      "Website AI Chatbot",
      "Unlimited Leads",
      "Appointment Booking",
      "Multi-language AI",
      "3 Chatbots",
      "2,000 AI Messages",
      "Remove AIAERA Branding",
    ],
  },
  {
    title: "Pro",
    price: "₹1999",
    period: "/month",
    subtitle:
      "Complete AI automation across every customer channel.",
    badge: "MOST POPULAR",
    icon: Crown,
    popular: true,
    button: "Start Pro",
    features: [
      "Everything in Basic",
      "WhatsApp Automation",
      "Facebook Automation",
      "Instagram Automation",
      "Advanced AI Automation",
      "Unlimited Chatbots",
      "10,000+ AI Messages",
      "Priority Support",
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-slate-50 py-20 lg:py-28"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.05),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.05),transparent_35%)]" />

      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-violet-200/50 blur-[120px] pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-100/50 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3.5 py-1 backdrop-blur-sm shadow-sm">

            <Sparkles
              size={14}
              className="text-violet-600"
            />

            <span className="text-xs font-semibold text-violet-700">
              AI Automation Pricing
            </span>

          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl">

            Simple Pricing

            <br />

            <span className="block bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text pb-1 text-transparent">
              Built For Every Business
            </span>

          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">

            Start your 7-day free trial and upgrade as your AI automation grows.
            Every plan includes powerful AI tools to automate conversations,
            capture leads, and grow your business.

          </p>

        </div>

        {/* Pricing Cards */}
        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.title}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-violet-500 shadow-lg shadow-violet-500/10 ring-2 ring-violet-500/20 lg:-translate-y-1.5"
                    : "border-slate-200 shadow-sm hover:border-violet-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-violet-200">
                    Most Popular
                  </div>
                )}

                <div>

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-md shadow-violet-200">

                      <Icon
                        size={20}
                        className="text-white"
                      />

                    </div>

                    <div className="inline-flex rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-500/10">
                      {plan.badge}
                    </div>

                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {plan.title}
                  </h3>

                  <p className="mt-1.5 min-h-[36px] text-xs leading-relaxed text-slate-600">
                    {plan.subtitle}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1.5 border-t border-slate-100 pt-5">

                    <span className="text-3xl font-black tracking-tight text-slate-900">
                      {plan.price}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {plan.period}
                    </span>

                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">

                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100">

                          <Check
                            size={12}
                            className="text-violet-600"
                          />

                        </div>

                        <span className="text-xs text-slate-700">
                          {feature}
                        </span>

                      </div>
                    ))}

                  </div>

                </div>

                <button
                  onClick={() => navigate("/signup")}
                  className={`group mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700"
                      : "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700"
                  }`}
                >
                  {plan.button}

                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </div>
            );
          })}
        </div>

        {/* Trust Cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">

          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:shadow-md">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md shadow-emerald-200">

              <ShieldCheck
                size={18}
                className="text-white"
              />

            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Secure Payments
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              All subscriptions are securely processed with
              enterprise-grade encryption.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:shadow-md">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-md shadow-violet-200">

              <Sparkles
                size={18}
                className="text-white"
              />

            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Upgrade Anytime
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Start with a free trial and upgrade whenever your
              business grows.
            </p>

          </div>

          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:shadow-md">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-md shadow-orange-200">

              <Zap
                size={18}
                className="text-white"
              />

            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Instant Activation
            </h3>

            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Your AI assistant is ready within minutes after
              creating your account.
            </p>

          </div>

        </div>

        {/* CTA Banner */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-600 to-purple-600 p-7 shadow-xl shadow-violet-500/10 sm:p-10 max-w-5xl mx-auto">

          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">

            <div>

              <h3 className="text-2xl font-black text-white sm:text-3xl">

                Ready to Automate Your Business with AI?

              </h3>

              <p className="mt-2 max-w-xl text-xs sm:text-sm text-violet-100 leading-relaxed">

                Launch your AI chatbot in minutes, train it with your
                business knowledge, capture more leads, and automate
                customer conversations 24/7 across your website and
                social channels.

              </p>

            </div>

            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-xs font-semibold text-violet-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-50"
            >

              Start Free Trial

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">

          <p className="text-[11px] font-medium tracking-wide text-slate-500">

            ✓ 7-Day Free Trial &nbsp; • &nbsp;
            ✓ Secure Payments &nbsp; • &nbsp;
            ✓ Cancel Anytime &nbsp; • &nbsp;
            ✓ Instant Setup

          </p>

        </div>

      </div>

    </section>

  );

};

export default PricingSection;