import { useNavigate } from "react-router-dom";
import Button from "../ui/button";

export default function PricingPreview() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#0a0a14] py-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Flexible Pricing
            </span>
          </h2>

          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose a plan that fits your business. Upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          <PriceCard
            title="Free"
            price="₹0"
            features={[
              "AI chatbot setup",
              "Website training",
              "Basic lead capture",
            ]}
            onClick={() => navigate("/signup")}
          />

          <PriceCard
            title="Basic"
            price="₹999 / month"
            features={[
              "Website embed widget",
              "Unlimited conversations",
              "Email support",
            ]}
            onClick={() => navigate("/signup")}
          />

          <PriceCard
            title="Pro"
            price="₹1999 / month"
            highlight
            features={[
              "WhatsApp & social integrations",
              "Appointments & Calendly",
              "Priority support",
            ]}
            onClick={() => navigate("/signup")}
          />

        </div>

        {/* Footer link */}
        <div className="mt-14 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
          >
            View full pricing →
          </Button>
        </div>

      </div>
    </section>
  );
}

function PriceCard({ title, price, features, highlight, onClick }) {
  return (
    <div
      className={`group relative rounded-2xl p-[1px] transition ${
        highlight
          ? "bg-gradient-to-br from-purple-500/30 via-transparent to-transparent"
          : "bg-white/10"
      }`}
    >
      <div
        className={`h-full rounded-2xl p-8 border transition-all duration-300 ${
          highlight
            ? "bg-[#11111b] border-purple-400/30 shadow-[0_35px_90px_rgba(0,0,0,0.6)]"
            : "bg-[#11111b] border-white/10"
        }`}
      >
        {highlight && (
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold
                           bg-purple-500/15 text-purple-300 border border-purple-400/20">
            Most Popular
          </span>
        )}

        <h3 className="text-lg font-semibold text-white">{title}</h3>

        <p className="mt-4 text-3xl font-bold text-white tracking-tight">
          {price}
        </p>

        <ul className="mt-6 space-y-3 text-sm text-gray-300 leading-relaxed">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="text-purple-400 mt-[3px]">✔</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button
          className="mt-8 w-full"
          onClick={onClick}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
