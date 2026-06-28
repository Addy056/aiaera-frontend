import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bot,
  ShieldCheck,
} from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent" />

      <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[160px]" />

      <div className="absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.05] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_35%)]" />

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-[40px] border border-white/10" />

          {/* Floating Cards */}
          <div className="hidden lg:flex absolute left-10 top-12 items-center gap-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-2xl px-5 py-4 shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20">
              <Bot className="h-6 w-6 text-violet-300" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white/45">
                AI Assistant
              </p>

              <p className="font-semibold">
                Responding Instantly
              </p>
            </div>
          </div>

          <div className="hidden lg:flex absolute right-10 bottom-12 items-center gap-4 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-2xl px-5 py-4 shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-white/45">
                Secure Platform
              </p>

              <p className="font-semibold">
                Enterprise Ready
              </p>
            </div>
          </div>

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-28">

            {/* Badge */}
            <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-white/[0.05] px-5 py-2 text-violet-200 backdrop-blur-2xl">

              <Sparkles size={16} />

              <span className="font-medium">
                AI Automation Platform
              </span>
            </div>

            {/* Heading */}
            <h2 className="mx-auto max-w-5xl text-center text-5xl font-black leading-[1.05] md:text-7xl">

              Put AI To Work

              <br />

              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                For Your Business
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-8 text-white/65 md:text-xl">

              Train an AI assistant using your website, PDFs and business
              information. Capture more leads, automate customer support,
              schedule appointments and engage customers 24/7 from a single
              platform.
            </p>

            {/* Feature Pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">

              {[
                "Website AI",
                "Lead Generation",
                "Appointment Booking",
                "WhatsApp",
                "Facebook",
                "Instagram",
                "Multi-language AI",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-white/80 backdrop-blur-xl"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-5">

              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-10 py-5 text-lg font-semibold shadow-[0_15px_50px_rgba(99,102,241,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,102,241,0.55)]"
              >
                Start Free

                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-10 py-5 text-lg font-medium backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.08]"
              >
                Login
              </button>
            </div>
                        {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">

              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span>No Credit Card Required</span>
              </div>

              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span>Setup in Under 5 Minutes</span>
              </div>

              <div className="flex items-center gap-2 text-white/70">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span>Cancel Anytime</span>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-20 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <h3 className="text-4xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  24/7
                </h3>

                <p className="mt-2 text-white/60">
                  AI responds instantly to every visitor without interruption.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <h3 className="text-4xl font-black bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                  10K+
                </h3>

                <p className="mt-2 text-white/60">
                  Customer conversations automated through AI assistants.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  99.9%
                </h3>

                <p className="mt-2 text-white/60">
                  Reliable platform built for modern businesses.
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Gradient Line */}
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-600" />

        </div>
      </div>
    </section>
  );
};

export default CTASection;