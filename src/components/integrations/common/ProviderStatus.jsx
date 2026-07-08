import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Clock3,
  XCircle,
} from "lucide-react";

const STATUS_MAP = {
  connected: {
    label: "Connected",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400",
  },

  disconnected: {
    label: "Disconnected",
    icon: XCircle,
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },

  pending: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-400",
  },

  syncing: {
    label: "Syncing",
    icon: Loader2,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400",
  },

  error: {
    label: "Attention Required",
    icon: AlertTriangle,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400",
  },

  "coming-soon": {
    label: "Coming Soon",
    icon: Clock3,
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-500/10 dark:text-violet-400",
  },
};

export default function ProviderStatus({
  status = "disconnected",
  label,
  className = "",
}) {
  const config =
    STATUS_MAP[status] ||
    STATUS_MAP.disconnected;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        ${config.className}
        ${className}
      `}
    >
      <Icon
        size={14}
        className={
          status === "syncing"
            ? "animate-spin"
            : ""
        }
      />

      <span>
        {label || config.label}
      </span>
    </motion.div>
  );
}