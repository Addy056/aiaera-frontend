import * as React from "react";
import { motion } from "framer-motion";

/* Simple Tabs implementation (no clsx) */
const TabsContext = React.createContext();

export function Tabs({ defaultValue = "", children, className = "" }) {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div className={`flex gap-2 rounded-2xl bg-white/6 p-1 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = "" }) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  return (
    <button
      onClick={() => ctx?.setValue(value)}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? "text-white" : "text-gray-300"} ${className}`}
      aria-pressed={isActive}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="tab-active"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 -z-10"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      )}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
