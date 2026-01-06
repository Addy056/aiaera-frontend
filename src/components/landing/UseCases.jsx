export default function UseCases() {
  const items = [
    "SaaS Companies",
    "Marketing Agencies",
    "Real Estate Firms",
    "E-commerce Brands",
    "Consulting Businesses",
  ];

  return (
    <section className="relative py-32 bg-[#0a0a14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Trusted Across{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Industries
            </span>
          </h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Businesses of all sizes use AIAERA to automate conversations,
            generate leads, and scale customer engagement.
          </p>
        </div>

        {/* Use Case Pills */}
        <div className="flex flex-wrap justify-center gap-5">
          {items.map((item) => (
            <div
              key={item}
              className="group relative rounded-full p-[1px]
                         bg-gradient-to-r from-purple-500/25 via-transparent to-transparent"
            >
              <div
                className="rounded-full
                           bg-[#11111b]
                           border border-white/10
                           px-6 py-3
                           text-sm md:text-base
                           text-gray-200
                           shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                           transition
                           group-hover:border-purple-400/30
                           group-hover:-translate-y-[1px]"
              >
                {item}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
