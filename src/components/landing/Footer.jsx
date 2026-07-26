import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const productLinks = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "Login", route: "/login" },
  { label: "Get Started", route: "/signup" },
];

const contactItems = [
  {
    icon: Mail,
    title: "Email",
    value: "aiaera056@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 9270099536",
  },
  {
    icon: Globe,
    title: "Website",
    value: "www.aiaera.in",
  },
];

const Footer = () => {
  const navigate = useNavigate();

  const go = (item) => {
    if (item.id) {
      document
        .getElementById(item.id)
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    navigate(item.route);
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-slate-200 bg-white"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_35%)]" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-200 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-100 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">

        <div className="grid gap-16 lg:grid-cols-4">

          {/* Left */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-200">

                <img
                  src="/favicon.png"
                  alt="AIAERA"
                  className="h-9 w-9"
                />

              </div>

              <div>

                <h2 className="text-4xl font-black text-slate-900">
                  AIAERA
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-violet-600">
                  <Sparkles size={15} />
                  AI Business Automation Platform
                </div>

              </div>

            </div>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
              Build AI assistants trained on your business knowledge,
              automate customer support, capture leads and schedule
              appointments from one modern platform.
            </p>

            {/* Contact */}

            <div className="mt-10 space-y-4">

              {contactItems.map(({ icon: Icon, title, value }) => (

                <div
                  key={title}
                  className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">

                    <Icon
                      size={20}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {title}
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {value}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-8 text-xl font-bold text-slate-900">
              Product
            </h3>

            <div className="space-y-4">

              {productLinks.map((item) => (

                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="group flex items-center gap-3 font-medium text-slate-600 transition-all duration-300 hover:text-violet-600"
                >

                  <ChevronRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                  {item.label}

                </button>

              ))}

            </div>

          </div>
                    {/* Follow Us */}

          <div>

            <h3 className="mb-8 text-xl font-bold text-slate-900">
              Follow Us
            </h3>

            <div className="flex flex-wrap gap-3">

              {[
                "Instagram",
                "Facebook",
                "LinkedIn",
                "X",
              ].map((social) => (

                <button
                  key={social}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                >
                  {social}
                </button>

              ))}

            </div>

            {/* CTA Card */}

            <div className="mt-10 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 p-8 shadow-xl shadow-violet-200">

              <h4 className="text-2xl font-bold text-white">
                Ready to Build?
              </h4>

              <p className="mt-4 leading-7 text-violet-100">
                Create your AI assistant today and automate customer
                conversations 24/7 while capturing more qualified
                leads for your business.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-violet-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Start Free

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </button>

            </div>

          </div>

        </div>

        {/* Bottom Cards */}

        <div className="mt-20 grid gap-6 md:grid-cols-3">

          {[
            {
              title: "Enterprise Security",
              description:
                "Industry-grade security with encrypted storage and secure authentication.",
            },
            {
              title: "24/7 AI Assistant",
              description:
                "Never miss a customer inquiry with an AI assistant that works around the clock.",
            },
            {
              title: "Built For Growth",
              description:
                "Generate more leads, automate conversations and scale your business effortlessly.",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <h4 className="text-xl font-bold text-slate-900">
                {item.title}
              </h4>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>

            </div>

          ))}

        </div>

        {/* Footer Bottom */}

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 lg:flex-row">

          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} AIAERA. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">

            <button className="text-sm text-slate-500 transition hover:text-violet-600">
              Privacy Policy
            </button>

            <button className="text-sm text-slate-500 transition hover:text-violet-600">
              Terms of Service
            </button>

            <button className="text-sm text-slate-500 transition hover:text-violet-600">
              Contact
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;