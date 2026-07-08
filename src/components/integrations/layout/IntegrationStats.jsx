import { motion } from "framer-motion";
import {
  Link2,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const icons = {
  total: Link2,
  connected: CheckCircle2,
  active: Zap,
  health: ShieldCheck,
};

export default function IntegrationStats({
  total = 0,
  connected = 0,
  active = 0,
  health = 100,
}) {
  const stats = [
    {
      key: "total",
      title: "Total Integrations",
      value: total,
      subtitle: "Available providers",
    },
    {
      key: "connected",
      title: "Connected",
      value: connected,
      subtitle: "Currently linked",
    },
    {
      key: "active",
      title: "Active Automations",
      value: active,
      subtitle: "Running workflows",
    },
    {
      key: "health",
      title: "System Health",
      value: `${health}%`,
      subtitle: "Integration status",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[stat.key];

        return (
          <motion.div
            key={stat.key}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -5,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              hover:shadow-xl
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                <Icon size={26} />
              </div>

              <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <TrendingUp size={14} />
              </div>
            </div>

            <div className="relative mt-6">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </h3>

              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {stat.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}