import { motion } from "framer-motion";
import {
  RefreshCw,
  Plus,
  ShieldCheck,
} from "lucide-react";

export default function IntegrationsHeader({
  title = "Integrations",
  subtitle = "Connect your favorite platforms to automate conversations, bookings, payments, and business workflows.",
  syncing = false,
  onRefresh,
  onAddIntegration,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <ShieldCheck size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              <RefreshCw
                size={18}
                className={syncing ? "animate-spin" : ""}
              />

              Refresh
            </button>

            <button
              onClick={onAddIntegration}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              <Plus size={18} />

              Add Integration
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}