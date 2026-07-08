import { AnimatePresence, motion } from "framer-motion";

export default function IntegrationGrid({
  integrations = [],
  renderItem,
  emptyTitle = "No integrations found",
  emptyDescription = "Try changing your search or selected category.",
  className = "",
}) {
  if (!integrations.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          flex
          min-h-[320px]
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-dashed
          border-slate-300
          bg-white
          p-12
          text-center
          dark:border-slate-700
          dark:bg-slate-950
          ${className}
        `}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
          <svg
            className="h-10 w-10 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M7 12h10M12 7v10" />
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
            />
          </svg>
        </div>

        <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
          {emptyTitle}
        </h3>

        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {emptyDescription}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={`
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        ${className}
      `}
    >
      <AnimatePresence mode="popLayout">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id || integration.key || index}
            layout
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
              delay: index * 0.04,
            }}
          >
            {renderItem(integration)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}