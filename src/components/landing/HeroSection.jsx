import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Sparkles,
  Play,
  CheckCircle2,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Conversations",
  },
  {
    value: "500+",
    label: "Businesses",
  },
  {
    value: "24/7",
    label: "AI Support",
  },
];

const features = [
  "Website AI",
  "Lead Capture",
  "WhatsApp",
  "Instagram",
  "Appointment Booking",
  "50+ Languages",
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-24 pb-24">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -top-56 left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />

      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-20 px-6 lg:flex-row lg:items-center lg:px-10">

        {/* LEFT */}

        <div className="w-full lg:w-1/2">

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-5 py-2 text-sm font-semibold text-violet-700">

            <Sparkles size={16} />

            AI Powered Business Automation

          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight text-slate-900 md:text-7xl">

            Your AI Employee

            <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">

              Works 24/7

            </span>

            So You Don't Have To.

          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">

            Build an AI assistant trained on your website, PDFs and business
            knowledge. Instantly answer customers, capture leads, automate
            WhatsApp & Instagram conversations and book appointments—all from
            one platform.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-3 rounded-2xl bg-violet-600 px-8 py-4 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-violet-700"
            >

              Start Free Trial

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </button>

            <button
              className="inline-flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
            >

              <Play size={18} />

              Watch Demo

            </button>

          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">

            {stats.map((item) => (

              <div key={item.label}>

                <h2 className="text-4xl font-black text-slate-900">

                  {item.value}

                </h2>

                <p className="mt-2 text-slate-500">

                  {item.label}

                </p>

              </div>

            ))}

          </div>

          <div className="mt-10 flex flex-wrap gap-3">

            {features.map((feature) => (

              <div
                key={feature}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >

                {feature}

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative flex w-full justify-center lg:w-1/2">

          <div className="absolute -top-12 right-12 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

          <div className="relative w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 pb-5">

              <div>

                <h3 className="text-xl font-bold text-slate-900">

                  AIAERA Assistant

                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  AI Online

                </div>

              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-600 text-white">

                <Bot size={30} />

              </div>

            </div>

            {/* Chat Starts */}
                        <div className="mt-6 space-y-5">

              {/* AI Message */}

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">

                  <Bot size={18} />

                </div>

                <div className="max-w-[80%] rounded-3xl bg-slate-100 px-5 py-4 text-slate-700">

                  👋 Hello! Welcome to AIAERA. How can I help you today?

                </div>

              </div>

              {/* User Message */}

              <div className="flex justify-end">

                <div className="max-w-[80%] rounded-3xl bg-violet-600 px-5 py-4 text-white shadow-lg">

                  I'd like to schedule a demo for my business.

                </div>

              </div>

              {/* AI Reply */}

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">

                  <Bot size={18} />

                </div>

                <div className="max-w-[80%] rounded-3xl bg-slate-100 px-5 py-4 text-slate-700">

                  Great! 📅 I can book a meeting instantly. Please choose your
                  preferred date and time.

                </div>

              </div>

              {/* Booking Card */}

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h4 className="font-bold text-slate-900">

                      Demo Meeting

                    </h4>

                    <p className="mt-1 text-sm text-slate-500">

                      Friday • 3:30 PM

                    </p>

                  </div>

                  <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">

                    Confirm

                  </button>

                </div>

              </div>

              {/* Chat Input */}

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Ask anything..."
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                <button className="rounded-2xl bg-violet-600 px-7 font-semibold text-white transition hover:bg-violet-700">

                  Send

                </button>

              </div>

            </div>

            {/* Bottom Stats */}

            <div className="mt-8 grid grid-cols-3 gap-4">

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-violet-600">

                  <MessageSquare size={18} />

                  <span className="text-sm font-semibold">

                    Conversations

                  </span>

                </div>

                <h3 className="mt-3 text-2xl font-black text-slate-900">

                  12.5K

                </h3>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-emerald-600">

                  <CheckCircle2 size={18} />

                  <span className="text-sm font-semibold">

                    Leads

                  </span>

                </div>

                <h3 className="mt-3 text-2xl font-black text-slate-900">

                  1,248

                </h3>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-2 text-blue-600">

                  <BarChart3 size={18} />

                  <span className="text-sm font-semibold">

                    Conversion

                  </span>

                </div>

                <h3 className="mt-3 text-2xl font-black text-slate-900">

                  38%

                </h3>

              </div>

            </div>
                        {/* Floating Card - Lead */}

            <div className="absolute -left-12 top-16 hidden w-64 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

                  <CheckCircle2
                    size={22}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                    New Lead

                  </p>

                  <h4 className="mt-1 font-bold text-slate-900">

                    Sarah Johnson

                  </h4>

                  <p className="text-sm text-slate-500">

                    Interested in AI Automation

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card - Appointment */}

            <div className="absolute -right-12 bottom-24 hidden w-64 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                  <Calendar
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Appointment

                  </p>

                  <h4 className="mt-1 font-bold text-slate-900">

                    Demo Booked

                  </h4>

                  <p className="text-sm text-slate-500">

                    Today • 3:30 PM

                  </p>

                </div>

              </div>

            </div>

            {/* Floating Card - Global */}

            <div className="absolute left-10 -bottom-10 hidden w-64 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:block">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">

                  <Globe
                    size={22}
                    className="text-violet-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                    Languages

                  </p>

                  <h4 className="mt-1 font-bold text-slate-900">

                    50+ Supported

                  </h4>

                  <p className="text-sm text-slate-500">

                    Global AI Assistant

                  </p>

                </div>

              </div>

            </div>

            {/* Security Badge */}

            <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-lg lg:flex lg:items-center lg:gap-3">

              <ShieldCheck
                size={20}
                className="text-violet-600"
              />

              <div>

                <p className="text-sm font-semibold text-slate-900">

                  Enterprise Ready

                </p>

                <p className="text-xs text-slate-500">

                  Secure • Reliable • Fast

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default HeroSection;