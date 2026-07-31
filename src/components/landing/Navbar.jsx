import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const navigation = [
  {
    label: "Features",
    id: "features",
  },
  {
    label: "Integrations",
    id: "integrations",
  },
  {
    label: "Pricing",
    id: "pricing",
  },
  {
    label: "FAQ",
    id: "faq",
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              scrolled
                ? "border border-slate-200/80 bg-white/90 px-4 py-3 sm:px-6 sm:py-3.5 shadow-lg shadow-slate-200/50 backdrop-blur-xl"
                : "bg-transparent px-0 py-0"
            }`}
          >

            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-md shadow-violet-200 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/favicon.png"
                  alt="AIAERA"
                  className="h-6 w-6 sm:h-6.5 sm:w-6.5 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  AIAERA
                </h1>
                <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-violet-600">
                  <Sparkles size={11} className="shrink-0" />
                  <span>AI Business Platform</span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-violet-600 py-1"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-violet-600 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-slate-300/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all duration-300 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <span>Start Free Trial</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs text-slate-700 transition-colors hover:bg-slate-50 lg:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenu ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="fixed inset-x-4 top-20 z-40 lg:hidden">
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-slate-300/50">
            
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Navigation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explore AIAERA
                  </p>
                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 p-4 sm:p-5">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 p-4 sm:p-5">
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenu(false);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-violet-50/50 hover:text-violet-700 hover:border-violet-300"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenu(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-colors hover:bg-violet-700"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/70 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Build Your AI Employee
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Start free. No credit card required.
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