// src/components/builder/AuroraLayer.jsx

import { motion } from "framer-motion";

export default function AuroraLayer() {
  return (
    <motion.div
      animate={{
        opacity: [0.35, 0.6, 0.35],
        scale: [1, 1.06, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 16,
        ease: "easeInOut",
      }}
      className="pointer-events-none absolute -top-52 -left-48 w-[620px] h-[620px] rounded-full blur-[140px]"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(191,167,255,0.25), rgba(127,90,240,0.18), rgba(0,234,255,0.14))",
      }}
    />
  );
}
