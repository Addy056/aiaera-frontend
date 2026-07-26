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
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              scrolled
                ? "border border-slate-200 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-xl"
                : "bg-transparent px-0 py-0"
            }`}
          >

            {/* Logo */}

            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-4"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-lg shadow-violet-200">

                <img
                  src="/favicon.png"
                  alt="AIAERA"
                  className="h-7 w-7 object-contain"
                />

              </div>

              <div className="text-left">

                <h1 className="text-2xl font-black tracking-tight text-slate-900">

                  AIAERA

                </h1>

                <div className="flex items-center gap-1 text-xs font-medium text-violet-600">

                  <Sparkles size={12} />

                  AI Business Platform

                </div>

              </div>

            </button>

            {/* Desktop Navigation */}

            <nav className="hidden items-center gap-10 lg:flex">

              {navigation.map((item) => (

                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-[15px] font-semibold text-slate-600 transition hover:text-violet-600"
                >

                  {item.label}

                  <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-violet-600 transition-all duration-300 hover:w-full group-hover:w-full" />

                </button>

              ))}

            </nav>

            {/* Desktop Actions */}

            <div className="hidden items-center gap-4 lg:flex">

              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
              >

                Login

              </button>

              <button
                onClick={() => navigate("/signup")}
                className="group flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-700"
              >

                Start Free Trial

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

              </button>

            </div>

            {/* Mobile Menu Button */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden"
            >

              {mobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}

            </button>

          </div>

        </div>

      </header>
      {/* Mobile Menu */}

      {mobileMenu && (
        <div className="fixed inset-x-4 top-24 z-40 lg:hidden">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Navigation
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Explore AIAERA
                  </p>

                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-slate-50"
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            <div className="space-y-2 p-6">

              {navigation.map((item) => (

                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-semibold text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600"
                >

                  {item.label}

                  <ArrowRight size={18} />

                </button>

              ))}

            </div>

            <div className="border-t border-slate-100 p-6">

              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenu(false);
                }}
                className="mb-3 w-full rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-600"
              >

                Login

              </button>

              <button
                onClick={() => {
                  navigate("/signup");
                  setMobileMenu(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >

                Start Free Trial

                <ArrowRight size={18} />

              </button>

              <div className="mt-6 rounded-2xl bg-violet-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">

                    <Sparkles size={18} />

                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Build Your AI Employee
                    </p>

                    <p className="text-sm text-slate-500">
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