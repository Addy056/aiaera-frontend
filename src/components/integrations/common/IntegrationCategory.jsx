import { motion } from "framer-motion";

export default function IntegrationCategory({
  categories = [],
  selected,
  onSelect,
  className = "",
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {categories.map((category, index) => {
        const active = selected === category.value;

        return (
          <motion.button
            key={category.value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
            }}
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => onSelect(category.value)}
            className={`
              group
              flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2.5
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              }
            `}
          >
            {category.icon && (
              <span
                className={`${
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-500"
                }`}
              >
                <category.icon size={16} />
              </span>
            )}

            <span>{category.label}</span>

            {typeof category.count === "number" && (
              <span
                className={`
                  rounded-full
                  px-2
                  py-0.5
                  text-xs
                  font-semibold
                  ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                `}
              >
                {category.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}