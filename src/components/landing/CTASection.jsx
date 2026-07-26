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
    <section className="relative overflow-hidden bg-white py-28 lg:py-36">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_35%)]" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-200 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-100 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[40px] border border-violet-100 bg-gradient-to-br from-violet-600 via-violet-600 to-purple-600 shadow-[0_35px_80px_rgba(124,58,237,0.25)]">

          {/* Decorative Glow */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />

          {/* Floating Card */}

          <div className="absolute left-10 top-10 hidden lg:flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <Bot
                size={24}
                className="text-white"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-widest text-violet-100">

                AI Assistant

              </p>

              <p className="font-semibold text-white">

                Working 24/7

              </p>

            </div>

          </div>

          <div className="absolute right-10 bottom-10 hidden lg:flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

              <ShieldCheck
                size={24}
                className="text-white"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-widest text-violet-100">

                Enterprise

              </p>

              <p className="font-semibold text-white">

                Secure Platform

              </p>

            </div>

          </div>

          <div className="relative z-10 px-8 py-20 text-center md:px-16 lg:py-24">

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-xl">

              <Sparkles
                size={16}
                className="text-yellow-300"
              />

              <span className="font-medium text-white">

                AI Automation Platform

              </span>

            </div>

            {/* Heading */}

            <h2 className="mx-auto mt-8 max-w-5xl text-4xl font-black leading-tight text-white md:text-6xl">

              Put AI To Work

              <br />

              <span className="text-violet-100">

                For Your Business

              </span>

            </h2>

            {/* Description */}

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-violet-100">

              Train your AI assistant using your website, PDFs and business
              knowledge. Automate customer support, capture leads and book
              appointments while your business grows around the clock.

            </p>

            {/* Feature Pills */}

            <div className="mt-10 flex flex-wrap justify-center gap-4">

              {[
                "Website AI",
                "Lead Capture",
                "WhatsApp",
                "Facebook",
                "Instagram",
                "Appointment Booking",
                "Multi-language",
              ].map((item) => (

                <div
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-xl"
                >

                  {item}

                </div>

              ))}

            </div>

            {/* CTA Buttons */}

            <div className="mt-14 flex flex-wrap justify-center gap-5">

              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-3 rounded-2xl bg-white px-9 py-5 text-lg font-semibold text-violet-700 shadow-xl transition-all duration-300 hover:-translate-y-1"
              >

                Start Free Trial

                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-2xl border border-white/20 bg-white/10 px-9 py-5 text-lg font-medium text-white backdrop-blur-xl transition hover:bg-white/20"
              >

                Login

              </button>

            </div>
                        {/* Trust Indicators */}

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">

              {[
                "No Credit Card Required",
                "Setup in Under 5 Minutes",
                "Cancel Anytime",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-2 text-white"
                >

                  <CheckCircle2
                    size={18}
                    className="text-emerald-300"
                  />

                  <span className="font-medium">

                    {item}

                  </span>

                </div>

              ))}

            </div>

            {/* Statistics */}

            <div className="mt-20 grid gap-6 border-t border-white/20 pt-10 md:grid-cols-3">

              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                <h3 className="text-5xl font-black text-white">

                  24/7

                </h3>

                <p className="mt-3 leading-7 text-violet-100">

                  AI responds instantly to every customer
                  without interruptions.

                </p>

              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                <h3 className="text-5xl font-black text-white">

                  10K+

                </h3>

                <p className="mt-3 leading-7 text-violet-100">

                  Automated customer conversations handled
                  by intelligent AI assistants.

                </p>

              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">

                <h3 className="text-5xl font-black text-white">

                  99.9%

                </h3>

                <p className="mt-3 leading-7 text-violet-100">

                  Reliable enterprise infrastructure built
                  for modern businesses.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CTASection;