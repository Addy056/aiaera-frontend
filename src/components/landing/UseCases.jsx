export default function UseCases() {
  const items = [
    "SaaS Companies",
    "Marketing Agencies",
    "Real Estate Firms",
    "E-commerce Brands",
    "Consulting Businesses",
  ];

  return (
    <section className="relative py-28 bg-[#0a0a14] overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[420px] h-[420px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/3 w-[420px] h-[420px] bg-fuchsia-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trusted Across{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Industries
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Businesses of all sizes use AIAERA to automate conversations,
            generate leads, and scale customer engagement.
          </p>
        </div>

        {/* use case pills */}
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item) => (
            <div
              key={item}
              className="group relative rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-sm md:text-base text-gray-200 shadow-lg transition hover:-translate-y-1"
            >
              {/* hover glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition" />
              <span className="relative">{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
