import {
  Bot,
  Globe,
  MessageSquare,
  Calendar,
  BarChart3,
  Languages,
  Sparkles,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot Builder",
    description:
      "Train intelligent AI assistants using your website, PDFs, documents and business knowledge without writing a single line of code.",
    badge: "AI Powered",
  },
  {
    icon: Globe,
    title: "Website Integration",
    description:
      "Deploy your AI assistant to any website with a lightweight script in under one minute.",
    badge: "Easy Setup",
  },
  {
    icon: MessageSquare,
    title: "Omnichannel Messaging",
    description:
      "Manage conversations across WhatsApp, Facebook and Instagram from one unified dashboard.",
    badge: "Multi Channel",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Book meetings automatically with Calendly, Zoom, Google Meet, Microsoft Teams or custom links.",
    badge: "Automation",
  },
  {
    icon: BarChart3,
    title: "Lead Management",
    description:
      "Capture, qualify and organize leads automatically while keeping every conversation in one place.",
    badge: "CRM Ready",
  },
  {
    icon: Languages,
    title: "Multilingual AI",
    description:
      "Serve customers in multiple languages with natural AI conversations anywhere in the world.",
    badge: "Global",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative overflow-hidden bg-white py-24 lg:py-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.05),transparent_40%)]" />
      <div className="absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full bg-violet-200/50 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-4 py-1.5 backdrop-blur-sm shadow-sm">
            <Sparkles size={16} className="text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              Powerful AI Platform
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent pb-2 block">
              To Automate Your Business
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            AIAERA combines AI-powered customer support, lead generation,
            appointment booking, multilingual conversations and business
            automation into one modern platform.
          </p>
        </div>

        {/* Feature Grid (6 Cards) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-500/10">
                      {feature.badge}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Benefits (Horizontal Layout to break monotony) */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="group flex flex-col sm:flex-row items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
            <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-md shadow-violet-200 transition-transform group-hover:scale-105">
              <Workflow size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                End-to-End Automation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Automate your customer journey—from answering questions to scheduling appointments.
              </p>
            </div>
          </div>

          <div className="group flex flex-col sm:flex-row items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
            <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-md shadow-emerald-200 transition-transform group-hover:scale-105">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Secure & Reliable
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Enterprise-grade infrastructure with secure integrations and dependable uptime.
              </p>
            </div>
          </div>

          <div className="group flex flex-col sm:flex-row items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1">
            <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-md shadow-orange-200 transition-transform group-hover:scale-105">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Launch in Minutes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Upload knowledge, customize your bot, and deploy instantly—no coding required.
              </p>
            </div>
          </div>
        </div>

        {/* Unified Statistics Banner */}
        <div className="mt-20 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                value: "99%",
                title: "Faster Responses",
                text: "Respond instantly to customers 24/7.",
              },
              {
                value: "24/7",
                title: "Always Available",
                text: "Never miss another inquiry again.",
              },
              {
                value: "500+",
                title: "Growing Businesses",
                text: "Trust AIAERA to automate support.",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-10 text-center transition-colors duration-300 hover:bg-slate-50/50"
              >
                <h3 className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-4xl font-black tracking-tight text-transparent transition-transform duration-300 group-hover:scale-105 md:text-5xl">
                  {stat.value}
                </h3>
                <h4 className="mt-4 text-lg font-bold text-slate-900">
                  {stat.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-[200px]">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="mt-16 flex flex-col items-center justify-center gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Everything integrated seamlessly
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              "Website AI",
              "WhatsApp",
              "Facebook",
              "Instagram",
              "Lead Capture",
              "Appointment Booking",
              "CRM Ready",
              "Analytics",
              "Multi-language",
            ].map((item) => (
              <div
                key={item}
                className="cursor-default rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-100 sm:text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;