export default function PricingPreview() {
  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-fuchsia-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Simple,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Choose a plan that fits your business. Upgrade only when
            you’re ready — no hidden fees.
          </p>
        </div>

        {/* pricing cards */}
        <div className="grid md:grid-cols-3 gap-10">

          <PriceCard
            title="Free"
            price="₹0"
            desc="Get started with core features"
            features={[
              "AI chatbot setup",
              "Website training",
              "Basic lead capture",
              "Community support",
            ]}
          />

          <PriceCard
            title="Basic"
            price="₹999 / month"
            desc="Website chatbot deployment"
            features={[
              "Everything in Free",
              "Website embed widget",
              "Unlimited conversations",
              "Email support",
            ]}
          />

          <PriceCard
            title="Pro"
            price="₹1999 / month"
            desc="Full automation & integrations"
            highlight
            features={[
              "Everything in Basic",
              "WhatsApp & social integrations",
              "Appointments & Calendly",
              "Priority support",
            ]}
          />

        </div>

        {/* footer link */}
        <div className="mt-14 text-center">
          <button className="text-purple-400 font-medium hover:underline">
            View full pricing details →
          </button>
        </div>

      </div>
    </section>
  );
}

function PriceCard({ title, price, desc, features, highlight }) {
  return (
    <div
      className={`relative rounded-3xl p-[1px] transition ${
        highlight
          ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow-[0_30px_80px_rgba(127,90,240,0.45)] scale-[1.03]"
          : "bg-white/10"
      }`}
    >
      <div
        className={`rounded-3xl h-full p-8 backdrop-blur-xl border ${
          highlight
            ? "bg-[#11111d] border-white/20"
            : "bg-[#0f0f1a] border-white/10"
        }`}
      >
        {highlight && (
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
            Most Popular
          </span>
        )}

        <h3 className="text-xl font-semibold text-white">{title}</h3>

        <div className="mt-4 text-3xl font-bold text-white">
          {price}
        </div>

        <p className="mt-3 text-gray-400">{desc}</p>

        <ul className="mt-6 space-y-3 text-sm text-gray-300">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-purple-400 mt-[2px]">✔</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <button
          className={`mt-8 w-full py-3 rounded-xl font-medium transition ${
            highlight
              ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg hover:scale-[1.02]"
              : "bg-white/10 text-white hover:bg-white/15"
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
