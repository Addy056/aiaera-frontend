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
    <section
      id="features"
      className="relative overflow-hidden bg-white py-28"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_35%)]" />

      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-violet-200 blur-[120px]" />

      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-purple-100 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}

        <div className="mx-auto mb-20 max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2">

            <Sparkles
              size={16}
              className="text-violet-600"
            />

            <span className="text-sm font-semibold text-violet-700">
              Powerful AI Platform
            </span>

          </div>

          <h2 className="text-4xl font-black leading-tight text-slate-900 md:text-6xl">

            Everything You Need

            <br />

            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">

              To Automate Your Business

            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">

            AIAERA combines AI-powered customer support,
            lead generation, appointment booking,
            multilingual conversations and business automation
            into one modern platform.

          </p>

        </div>

        {/* Feature Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (

              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-2xl"
              >

                <div className="mb-6 inline-flex rounded-full bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-700">

                  {feature.badge}

                </div>

                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200 transition-transform duration-300 group-hover:scale-110">

                  <Icon
                    size={34}
                    className="text-white"
                  />

                </div>

                <h3 className="text-2xl font-bold text-slate-900">

                  {feature.title}

                </h3>

                <p className="mt-5 leading-8 text-slate-600">

                  {feature.description}

                </p>

                <div className="mt-8 flex items-center justify-between">

                  <span className="font-semibold text-violet-600">

                    Learn More

                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 transition-all duration-300 group-hover:bg-violet-600">

                    <ArrowUpRight
                      size={18}
                      className="text-violet-600 transition-all duration-300 group-hover:rotate-45 group-hover:text-white"
                    />

                  </div>

                </div>

              </div>

            );

          })}
        </div>
                {/* Enterprise Benefits */}

        <div className="mt-24 grid gap-8 lg:grid-cols-3">

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200">

              <Workflow
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              End-to-End Automation
            </h3>

            <p className="mt-5 leading-8 text-slate-600">
              Automate your complete customer journey—from answering questions
              and qualifying leads to scheduling appointments and collecting
              customer information.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-200">

              <ShieldCheck
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Secure & Reliable
            </h3>

            <p className="mt-5 leading-8 text-slate-600">
              Enterprise-grade infrastructure with secure integrations,
              dependable uptime and scalable AI built for businesses of every
              size.
            </p>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-200">

              <Sparkles
                size={28}
                className="text-white"
              />

            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Launch in Minutes
            </h3>

            <p className="mt-5 leading-8 text-slate-600">
              Upload your business knowledge, customize your chatbot and deploy
              it to your website within minutes—no coding required.
            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="mt-24 grid gap-8 md:grid-cols-3">

          {[
            {
              value: "99%",
              title: "Faster Responses",
              text: "Respond instantly to customers with AI available 24/7.",
            },
            {
              value: "24/7",
              title: "Always Available",
              text: "Never miss another inquiry, even outside business hours.",
            },
            {
              value: "500+",
              title: "Growing Businesses",
              text: "Businesses trust AIAERA to automate conversations and generate leads.",
            },
          ].map((stat) => (

            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <h3 className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-5xl font-black text-transparent">

                {stat.value}

              </h3>

              <h4 className="mt-4 text-xl font-bold text-slate-900">

                {stat.title}

              </h4>

              <p className="mt-4 leading-7 text-slate-600">

                {stat.text}

              </p>

            </div>

          ))}

        </div>

        {/* Bottom Highlights */}

        <div className="mt-20 flex flex-wrap justify-center gap-4">

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
              className="rounded-full border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
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