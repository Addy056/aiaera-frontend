import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function IntegrationSearch({
  value,
  onChange,
  placeholder = "Search integrations...",
  className = "",
}) {
  const clearSearch = () => {
    onChange("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative w-full ${className}`}
    >
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-11
          pr-11
          text-sm
          text-slate-800
          placeholder:text-slate-400
          shadow-sm
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
          outline-none
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-white
          dark:placeholder:text-slate-500
          dark:focus:border-blue-500
          dark:focus:ring-blue-500/20
        "
      />

      {value && (
        <button
          type="button"
          onClick={clearSearch}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}