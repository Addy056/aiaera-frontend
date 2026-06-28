import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-4"
            : "py-6"
        }`}
      >
        {/* Aurora Glow */}

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute left-1/2 top-0 h-40 w-[650px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">

          <div
            className={`flex items-center justify-between rounded-[24px] border transition-all duration-500 ${
              scrolled
                ? "border-white/10 bg-black/45 backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] px-7 py-4"
                : "border-transparent bg-transparent px-0 py-0"
            }`}
          >

            {/* Logo */}

            <div
              onClick={() => navigate("/")}
              className="group flex cursor-pointer items-center gap-4"
            >

              <div className="relative">

                <div className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-xl opacity-80 group-hover:scale-125 transition-all duration-500" />

                <img
                  src="/favicon.png"
                  alt="AIAERA"
                  className="relative h-12 w-12 rounded-2xl shadow-[0_20px_45px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:rotate-3 group-hover:scale-105"
                />

              </div>

              <div>

                <h1 className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-2xl font-black tracking-wide text-transparent">
                  AIAERA
                </h1>

                <div className="mt-1 flex items-center gap-1 text-xs text-violet-200">

                  <Sparkles size={11} />

                  AI Business Platform

                </div>

              </div>

            </div>

            {/* Desktop Menu */}

            <div className="hidden lg:flex items-center gap-10">

              {[
                {
                  label: "Features",
                  id: "features",
                },
                {
                  label: "Pricing",
                  id: "pricing",
                },
                {
                  label: "Contact",
                  id: "footer",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative text-[15px] font-medium text-white/70 transition-all hover:text-white"
                >

                  {item.label}

                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />

                </button>
              ))}

            </div>

            {/* Desktop Buttons */}

            <div className="hidden lg:flex items-center gap-4">

              <button
                onClick={() => navigate("/login")}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 font-medium text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.08] hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3 font-semibold shadow-[0_20px_45px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(99,102,241,0.5)]"
              >

                Start Free

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </button>

            </div>

            {/* Mobile Button */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl lg:hidden"
            >

              {mobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}

            </button>

          </div>

        </div>

      </nav>
           {/* Mobile Menu */}

      {mobileMenu && (
        <div className="fixed left-4 right-4 top-[88px] z-40 lg:hidden">

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/70 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

            {/* Glow */}

            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10" />

            <div className="relative z-10 p-7">

              {/* Header */}

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold">
                    Navigation
                  </h3>

                  <p className="mt-1 text-sm text-white/50">
                    Explore AIAERA
                  </p>

                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Navigation */}

              <div className="space-y-3">

                {[
                  {
                    label: "Features",
                    id: "features",
                  },
                  {
                    label: "Pricing",
                    id: "pricing",
                  },
                  {
                    label: "Contact",
                    id: "footer",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.04] px-5 py-4 text-left transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.07]"
                  >

                    <span className="font-medium text-white/80 group-hover:text-white">
                      {item.label}
                    </span>

                    <ChevronRight
                      size={18}
                      className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-violet-300"
                    />

                  </button>
                ))}

              </div>

              {/* Divider */}

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* CTA */}

              <div className="space-y-4">

                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenu(false);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-4 font-medium transition-all duration-300 hover:bg-white/[0.08]"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenu(false);
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 py-4 font-semibold shadow-[0_15px_45px_rgba(99,102,241,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,102,241,0.5)]"
                >

                  Start Free

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </button>

              </div>

              {/* Bottom Trust */}

              <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">

                    <Sparkles
                      size={18}
                      className="text-violet-300"
                    />

                  </div>

                  <div>

                    <p className="font-semibold">
                      Start Free Today
                    </p>

                    <p className="text-sm text-white/55">
                      No credit card required.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;