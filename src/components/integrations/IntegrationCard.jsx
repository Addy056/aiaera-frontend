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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:border-violet-300
        hover:shadow-lg
        ${className}
      `}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-violet-200
                bg-violet-50
                text-violet-600
              "
            >
              {icon}
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-1 max-w-xs text-sm leading-5 text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ConnectionBadge status={status} />
            {actions}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex h-36 items-center justify-center text-sm text-slate-500">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-5 border-t border-slate-200 pt-5">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}