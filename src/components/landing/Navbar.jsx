import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });

      setMobileMenu(false);
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/40 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
        }`}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          {/* LEFT */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {/* Logo */}
            <div className="relative">
              <img
                src="/favicon.png"
                alt="AIAERA"
                className="w-12 h-12 rounded-2xl shadow-[0_10px_40px_rgba(124,58,237,0.45)] group-hover:scale-105 transition-all duration-300"
              />

              <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl opacity-70"></div>
            </div>

            {/* Text */}
            <div>
              <h1 className="text-2xl font-black tracking-wide bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                AIAERA
              </h1>

              <p className="text-xs text-white/45 flex items-center gap-1">
                <Sparkles size={12} />
                AI Business Automation
              </p>
            </div>
          </div>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-10">
            <button
              onClick={() => scrollToSection("features")}
              className="text-white/65 hover:text-white transition-all duration-300 relative group"
            >
              Features

              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className="text-white/65 hover:text-white transition-all duration-300 relative group"
            >
              Pricing

              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("footer")}
              className="text-white/65 hover:text-white transition-all duration-300 relative group"
            >
              Contact

              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] group-hover:w-full transition-all duration-300 rounded-full"></span>
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 text-white/80 hover:text-white"
            >
              Login
            </button>

            {/* CTA */}
            <button
              onClick={() => navigate("/signup")}
              className="group relative overflow-hidden px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_10px_40px_rgba(124,58,237,0.45)] hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 font-semibold">
                Get Started
              </span>

              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all"></div>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center justify-center"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden fixed top-[90px] left-4 right-4 z-40 rounded-[30px] border border-white/10 bg-black/70 backdrop-blur-3xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-5">
            <button
              onClick={() => scrollToSection("features")}
              className="text-left text-white/70 hover:text-white transition-all"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className="text-left text-white/70 hover:text-white transition-all"
            >
              Pricing
            </button>

            <button
              onClick={() => scrollToSection("footer")}
              className="text-left text-white/70 hover:text-white transition-all"
            >
              Contact
            </button>

            <div className="border-t border-white/10 pt-5 flex flex-col gap-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;