import {
  Bot,
  Globe,
  MessageSquare,
  Calendar,
  BarChart3,
  Languages,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot Builder",
    description:
      "Build intelligent AI assistants using your website, PDFs, documents and business knowledge without writing code.",
    badge: "AI Powered",
  },
  {
    icon: Globe,
    title: "Website Integration",
    description:
      "Deploy your chatbot anywhere with a lightweight script that installs in less than one minute.",
    badge: "Easy Setup",
  },
  {
    icon: MessageSquare,
    title: "Omnichannel Messaging",
    description:
      "Automate conversations across WhatsApp, Facebook Messenger and Instagram from one dashboard.",
    badge: "Multi Channel",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Schedule meetings automatically using Calendly, Google Meet, Zoom, Microsoft Teams or custom links.",
    badge: "Automation",
  },
  {
    icon: BarChart3,
    title: "Lead Management",
    description:
      "Capture customer details, qualify leads automatically and manage everything from one place.",
    badge: "CRM Ready",
  },
  {
    icon: Languages,
    title: "Multilingual AI",
    description:
      "Serve customers worldwide with natural conversations in multiple languages using advanced AI.",
    badge: "Global",
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-32"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_35%)]" />

      <div className="absolute -top-48 -left-40 h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[170px]" />

      <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[170px]" />

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
              Powerful AI Platform
            </span>

          </div>

          <h2 className="text-5xl font-black leading-[1.05] md:text-7xl">

            Everything You Need

            <br />

            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">

              To Automate Your Business

            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/65 md:text-xl">

            AIAERA combines AI-powered customer support,
            lead generation, appointment booking,
            multilingual conversations and business automation
            into one enterprise-ready platform.

          </p>

        </div>

        {/* Feature Grid */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-500/30 hover:shadow-[0_30px_80px_rgba(99,102,241,0.18)]"
              >

                {/* Hover Background */}

                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 opacity-0 transition-all duration-500 group-hover:opacity-100" />

                {/* Glow */}

                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100" />

                <div className="relative z-10">

                  {/* Badge */}

                  <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-violet-200">

                    {feature.badge}

                  </div>

                  {/* Icon */}

                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_20px_50px_rgba(99,102,241,0.45)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">

                    <Icon
                      size={36}
                      className="text-white"
                    />

                  </div>

                  {/* Title */}

                  <h3 className="text-2xl font-bold">

                    {feature.title}

                  </h3>

                  {/* Description */}

                  <p className="mt-5 leading-8 text-white/60">

                    {feature.description}

                  </p>

                  {/* Bottom Action */}

                  <div className="mt-8 flex items-center justify-between">

                    <span className="text-sm font-medium text-violet-300">

                      Learn More

                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] transition-all duration-300 group-hover:bg-violet-600 group-hover:border-violet-600">

                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:rotate-45"
                      />

                    </div>

                  </div>

                  <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                </div>

              </div>

            );

          })}
        </div>
                {/* Enterprise Benefits */}

        <div className="mt-24 grid gap-8 lg:grid-cols-3">

          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600">

              <Workflow size={28} />

            </div>

            <h3 className="text-2xl font-bold">
              End-to-End Automation
            </h3>

            <p className="mt-5 leading-8 text-white/60">
              From answering customer questions to capturing leads and booking
              appointments, AIAERA automates your entire customer journey.
            </p>

          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500">

              <ShieldCheck size={28} />

            </div>

            <h3 className="text-2xl font-bold">
              Secure & Reliable
            </h3>

            <p className="mt-5 leading-8 text-white/60">
              Enterprise-grade security, reliable infrastructure and scalable AI
              built for startups, agencies and growing businesses.
            </p>

          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500">

              <Sparkles size={28} />

            </div>

            <h3 className="text-2xl font-bold">
              Fast Deployment
            </h3>

            <p className="mt-5 leading-8 text-white/60">
              Train your AI, customize the chatbot and deploy it to your website
              within minutes without any coding knowledge.
            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="mt-28 grid gap-8 md:grid-cols-3">

          <div className="group rounded-[36px] border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-3xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/30">

            <h3 className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-6xl font-black text-transparent">

              99%

            </h3>

            <p className="mt-4 text-lg font-medium">
              Faster Customer Response
            </p>

            <p className="mt-3 leading-7 text-white/55">
              Deliver instant AI responses around the clock and improve customer
              satisfaction.
            </p>

          </div>

          <div className="group rounded-[36px] border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-3xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/30">

            <h3 className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-6xl font-black text-transparent">

              24/7

            </h3>

            <p className="mt-4 text-lg font-medium">
              AI Business Automation
            </p>

            <p className="mt-3 leading-7 text-white/55">
              Never miss another customer inquiry with intelligent AI available
              day and night.
            </p>

          </div>

          <div className="group rounded-[36px] border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-3xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/30">

            <h3 className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-6xl font-black text-transparent">

              500+

            </h3>

            <p className="mt-4 text-lg font-medium">
              Growing Businesses
            </p>

            <p className="mt-3 leading-7 text-white/55">
              Businesses trust AIAERA to automate conversations, generate leads
              and increase productivity.
            </p>

          </div>

        </div>

        {/* Bottom Highlights */}

        <div className="mt-24 flex flex-wrap justify-center gap-5">

          {[
            "Website AI",
            "WhatsApp",
            "Facebook",
            "Instagram",
            "Appointment Booking",
            "Lead Capture",
            "Analytics",
            "CRM Ready",
            "Multi-language",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-medium text-white/75 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10"
            >
              {item}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturesSection;