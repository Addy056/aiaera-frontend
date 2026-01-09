// src/components/builder/AuroraLayer.jsx

import { motion } from "framer-motion";

export default function AuroraLayer() {
  return (
    <motion.div
      aria-hidden
      animate={{
        opacity: [0.18, 0.28, 0.18],
        scale: [1, 1.03, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 22,
        ease: "easeInOut",
      }}
      className="pointer-events-none absolute -top-64 -left-64
                 w-[560px] h-[560px]
                 rounded-full
                 blur-[180px]"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(127,90,240,0.22), rgba(127,90,240,0.12), transparent 70%)",
      }}
    />
  );
}
