import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Bot,
  MessageSquare,
  Zap,
  CheckCircle2,
  Globe,
  Calendar,
} from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_35%)]" />

      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[170px]" />

      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[170px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-white/[0.05] px-5 py-2 backdrop-blur-xl">

              <Sparkles size={16} className="text-violet-300" />

              <span className="text-sm text-violet-200">
                Enterprise AI Platform
              </span>

            </div>

            <h1 className="text-5xl font-black leading-[1.05] md:text-7xl">

              Your AI Employee

              <br />

              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">

                Working 24/7

              </span>

              <br />

              For Every Customer

            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">

              Train your AI using your website, PDFs and business information.
              Capture leads, answer customer questions, book appointments and
              automate conversations across your website and social channels.

            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 font-semibold shadow-[0_20px_60px_rgba(99,102,241,0.45)] transition-all duration-300 hover:-translate-y-1"
              >
                Start Free

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />

              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 backdrop-blur-xl transition-all hover:bg-white/[0.08]"
              >
                Explore Features
              </button>

            </div>

            <div className="mt-14 grid grid-cols-3 gap-8">

              <div>

                <h3 className="text-4xl font-black text-white">
                  10K+
                </h3>

                <p className="mt-2 text-white/50">
                  Conversations
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-white">
                  500+
                </h3>

                <p className="mt-2 text-white/50">
                  Businesses
                </p>

              </div>

              <div>

                <h3 className="text-4xl font-black text-white">
                  24/7
                </h3>

                <p className="mt-2 text-white/50">
                  AI Support
                </p>

              </div>

            </div>

            <div className="mt-10 flex flex-wrap gap-4">

              {[
                "Website AI",
                "Lead Capture",
                "Appointment Booking",
                "WhatsApp",
                "Multi-language",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            <div className="absolute inset-0 rounded-[50px] bg-gradient-to-r from-violet-500/20 to-blue-500/20 blur-3xl" />

            <div className="relative w-full max-w-xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.45)]">

              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

              <div className="relative z-10">

                <div className="mb-8 flex items-center justify-between">

                  <div>

                    <h3 className="text-2xl font-bold">
                      AIAERA Assistant
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">

                      <span className="h-2 w-2 rounded-full bg-emerald-400" />

                      Online & Ready

                    </div>

                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600">

                    <Bot size={30} />

                  </div>

                </div>

                <div className="space-y-5">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">

                      <Bot size={18} />

                    </div>

                    <div className="max-w-[82%] rounded-3xl border border-white/5 bg-white/[0.06] p-5">

                      👋 Hello! I'm your AI business assistant. How can I help today?

                    </div>

                  </div>

                  <div className="flex justify-end gap-3">

                    <div className="max-w-[82%] rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 p-5 shadow-lg">

                      I would like to schedule a product demo.

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">

                      <MessageSquare size={18} />

                    </div>

                  </div>
                                    <div className="flex gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">

                      <Bot size={18} />

                    </div>

                    <div className="max-w-[82%] rounded-3xl border border-white/5 bg-white/[0.06] p-5">

                      Absolutely! 📅 Please choose your preferred date and
                      time. I'll instantly share your booking link.

                    </div>

                  </div>

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">

                      <Zap size={18} />

                    </div>

                    <div className="flex items-center gap-2 rounded-3xl border border-white/5 bg-white/[0.06] px-5 py-4">

                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />

                      <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />

                    </div>

                  </div>

                </div>

                {/* Chat Input */}

                <div className="mt-8 flex gap-4">

                  <input
                    type="text"
                    placeholder="Ask anything about your business..."
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 outline-none transition-all placeholder:text-white/35 focus:border-violet-500/40"
                  />

                  <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 font-medium shadow-[0_12px_35px_rgba(99,102,241,0.45)] transition-all duration-300 hover:scale-105">

                    Send

                  </button>

                </div>

              </div>

            </div>

            {/* Floating Card 1 */}

            <div className="absolute -left-12 top-14 hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl lg:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20">

                  <CheckCircle2
                    size={22}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-white/45">

                    New Lead

                  </p>

                  <h4 className="mt-1 text-lg font-bold">

                    Lead Captured

                  </h4>

                  <p className="text-sm text-white/50">

                    Sarah Johnson

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card 2 */}

            <div className="absolute -right-12 bottom-12 hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl lg:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20">

                  <Calendar
                    size={22}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-white/45">

                    Appointment

                  </p>

                  <h4 className="mt-1 text-lg font-bold">

                    Demo Booked

                  </h4>

                  <p className="text-sm text-white/50">

                    Today • 3:30 PM

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card 3 */}

            <div className="absolute left-8 -bottom-10 hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl xl:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20">

                  <Globe
                    size={22}
                    className="text-violet-300"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-widest text-white/45">

                    Languages

                  </p>

                  <h4 className="mt-1 text-lg font-bold">

                    50+ Supported

                  </h4>

                  <p className="text-sm text-white/50">

                    Global AI Assistant

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;