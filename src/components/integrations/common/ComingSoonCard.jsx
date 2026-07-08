import { motion } from "framer-motion";
import {
  Sparkles,
  Clock3,
  ArrowRight,
} from "lucide-react";

export default function ComingSoonCard({
  title,
  description,
  icon: Icon,
  eta = "Coming Soon",
  features = [],
  onNotify,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* Background Glow */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {Icon ? (
                <Icon size={28} />
              ) : (
                <Sparkles size={28} />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>

          <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-500/10 dark:text-violet-400">
            Soon
          </div>
        </div>

        {/* ETA */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/10 dark:text-amber-400">
          <Clock3 size={18} />

          <span className="font-medium">
            {eta}
          </span>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Planned Features
            </p>

            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />

                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            This integration is currently under development.
          </span>

          {onNotify && (
            <button
              onClick={onNotify}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Notify Me

              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}