import ConnectionBadge from "./ConnectionBadge";

export default function IntegrationCard({
  title,
  subtitle,
  icon,
  status = "disconnected",
  children,
}) {

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-[0_0_40px_rgba(127,90,240,0.12)]">

      <div className="absolute inset-0 bg-gradient-to-br from-[#7f5af0]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">

        <div className="flex items-start justify-between mb-6">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-[#7f5af0]/15 text-purple-400 flex items-center justify-center border border-purple-500/20">

              {icon}

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white mb-1">
                {title}
              </h2>

              <p className="text-sm text-gray-400 max-w-sm">
                {subtitle}
              </p>

            </div>

          </div>

          <ConnectionBadge status={status} />

        </div>

        <div className="space-y-4">
          {children}
        </div>

      </div>

    </div>
  );
}