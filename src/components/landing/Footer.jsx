import { useNavigate } from "react-router-dom";
import { Mail, Phone, Globe, ChevronRight } from "lucide-react";

const productLinks = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "Login", route: "/login" },
  { label: "Get Started", route: "/signup" },
];

export default function Footer() {
  const navigate = useNavigate();

  const go = (item) => {
    if (item.id) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(item.route);
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-white/10 bg-[#05070d]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,.10),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-4">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <img
                src="/favicon.png"
                alt="AIAERA"
                className="h-16 w-16 rounded-2xl"
              />

              <div>
                <h2 className="text-4xl font-black">AIAERA</h2>
                <p className="text-white/50">
                  AI Business Automation Platform
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-xl leading-8 text-white/60">
              Build AI assistants trained on your business knowledge, automate
              customer support, collect leads and book appointments from one
              modern platform.
            </p>

            <div className="mt-8 space-y-4">
              {[
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
              ].map(({ icon: Icon, title, value }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      {title}
                    </p>
                    <p className="text-white/80">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Product</h3>

            <div className="space-y-4">
              {productLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="flex items-center gap-2 text-white/60 transition hover:text-white"
                >
                  <ChevronRight size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow Us (Shifted to Company Space) */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Follow Us</h3>

            <div className="flex flex-wrap gap-3">
              {["Instagram", "Facebook", "LinkedIn", "X"].map((social) => (
                <button
                  key={social}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
          {[
            [
              "Enterprise Security",
              "Secure authentication and encrypted data.",
            ],
            [
              "24/7 AI",
              "Always-on AI assistant for your customers.",
            ],
            [
              "Built For Growth",
              "Capture leads and automate conversations.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h4 className="font-bold">{title}</h4>

              <p className="mt-3 text-sm text-white/60">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}