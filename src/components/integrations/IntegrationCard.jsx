import { motion } from "framer-motion";

import ConnectionBadge from "./ConnectionBadge";

export default function IntegrationCard({
  title,
  subtitle,
  icon,
  status = "disconnected",
  children,
  actions = null,
  footer = null,
  className = "",
  loading = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        p-6
        transition-all
        duration-300
        hover:border-purple-500/30
        hover:shadow-[0_0_60px_rgba(127,90,240,0.18)]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7f5af0]/10 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-purple-500/20
                bg-[#7f5af0]/15
                text-purple-400
              "
            >
              {icon}
            </div>

            <div>
              <h2 className="mb-1 text-lg font-semibold text-white">
                {title}
              </h2>

              {subtitle && (
                <p className="max-w-sm text-sm text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionBadge status={status} />

            {actions}
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-400">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}

        {footer && (
          <div className="mt-6 border-t border-white/10 pt-5">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}