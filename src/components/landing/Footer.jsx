import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Globe,
  Sparkles,
} from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaFacebookF } from "react-icons/fa6";

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

const socialLinks = [
  { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { name: "Instagram", icon: FaInstagram, href: "#" },
  { name: "X", icon: FaXTwitter, href: "#" },
  { name: "Facebook", icon: FaFacebookF, href: "#" },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-slate-200/80 bg-white"
    >
      {/* Subtle Background Ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-purple-100/40 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20 lg:px-8">

        {/* Top Brand Bar matching Zomato multi-column style */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-12 border-b border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-md shadow-violet-500/20">
              <img
                src="/favicon.png"
                alt="AIAERA"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                AIAERA
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-600">
                <Sparkles size={14} className="shrink-0" />
                <span>AI Business Automation Platform</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs">
              <Globe size={16} className="text-violet-600" />
              <span>India</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>English</span>
            </div>
          </div>
        </div>

        {/* Centered Social Links Section */}
        <div className="py-12 border-b border-slate-200/80 text-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Social Links
            </h3>
            
            {/* Centered social icons row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-slate-900 text-white transition-all duration-300 hover:bg-violet-600 shadow-2xs"
                  title={name}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {contactItems.map(({ icon: Icon, title, value }) => (
            <div
              key={title}
              className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:border-violet-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {title}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800 truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Feature Cards */}
        <div className="mt-16 grid gap-4 sm:gap-6 md:grid-cols-3">
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
              className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
            >
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                {item.title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Bottom Bar with Copyright Disclaimer matching layout */}
        <div className="mt-12 border-t border-slate-200/80 pt-6">
          <p className="text-[11px] leading-relaxed text-slate-500 font-medium text-center md:text-left">
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. © {new Date().getFullYear()} AIAERA Ltd. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;