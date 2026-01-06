import * as React from "react";
import { motion } from "framer-motion";

/* Simple Tabs implementation (controlled & calm) */
const TabsContext = React.createContext(null);

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
    <div
      className={`flex gap-1 rounded-xl
                  bg-[#0f0f1a]
                  border border-white/10
                  p-1
                  shadow-[0_10px_35px_rgba(0,0,0,0.45)]
                  ${className}`}
    >
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
      aria-pressed={isActive}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200"}
                  ${className}`}
    >
      {children}

      {isActive && (
        <motion.div
          layoutId="tab-active"
          className="absolute inset-0 rounded-lg
                     bg-[#11111b]
                     border border-purple-400/30
                     shadow-[0_8px_30px_rgba(127,90,240,0.25)]
                     -z-10"
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
