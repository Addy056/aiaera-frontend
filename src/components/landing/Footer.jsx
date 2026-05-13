import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-white/10 bg-[#05010d] pt-24"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-700/10 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-700/10 blur-[140px] rounded-full"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-14 pb-16 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src="/favicon.png"
                  alt="AIAERA"
                  className="w-14 h-14 rounded-2xl shadow-[0_10px_40px_rgba(124,58,237,0.45)]"
                />

                <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl"></div>
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  AIAERA
                </h2>

                <p className="text-sm text-white/45">
                  AI Business Automation
                </p>
              </div>
            </div>

            <p className="text-white/60 leading-relaxed mb-6">
              Premium AI chatbot platform helping businesses automate customer
              support, collect leads, and scale using advanced AI automation.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-purple-500/20 transition-all">
                Instagram
              </button>

              <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-purple-500/20 transition-all">
                Facebook
              </button>

              <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-purple-500/20 transition-all">
                LinkedIn
              </button>
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Sections
            </h3>

            <div className="space-y-4">
              <button
                onClick={scrollToTop}
                className="block text-white/60 hover:text-white transition-all"
              >
                Home
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="block text-white/60 hover:text-white transition-all"
              >
                Features
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="block text-white/60 hover:text-white transition-all"
              >
                Pricing
              </button>

              <button
                onClick={() => navigate("/login")}
                className="block text-white/60 hover:text-white transition-all"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="block text-white/60 hover:text-white transition-all"
              >
                Signup
              </button>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Legal
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/privacy-policy")}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-all group"
              >
                Privacy Policy

                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                />
              </button>

              <button
                onClick={() => navigate("/terms")}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-all group"
              >
                Terms & Conditions

                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                />
              </button>

              <button
                onClick={() => navigate("/refund-policy")}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-all group"
              >
                Refund Policy

                <ArrowUpRight
                  size={16}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                />
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Contact
            </h3>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-sm text-white/40">
                    Email
                  </p>

                  <p>support@aiaera.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-sm text-white/40">
                    Phone
                  </p>

                  <p>+91 9876543210</p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Globe size={18} />
                </div>

                <div>
                  <p className="text-sm text-white/40">
                    Website
                  </p>

                  <p>www.aiaera.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-white/40 text-sm text-center md:text-left">
            © 2026 AIAERA. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="text-white/40 hover:text-white transition-all"
            >
              Privacy
            </button>

            <button
              onClick={() => navigate("/terms")}
              className="text-white/40 hover:text-white transition-all"
            >
              Terms
            </button>

            <button
              onClick={() => navigate("/support")}
              className="text-white/40 hover:text-white transition-all"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;